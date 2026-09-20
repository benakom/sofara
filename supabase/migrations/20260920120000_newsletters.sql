-- Ambassador newsletter automation
-- Tables: newsletter_settings (single row), newsletter_campaigns (monthly sends),
-- newsletter_sends (one row per user x issue x campaign). Adds profiles.language.
-- Schedules the send-newsletters edge function hourly via pg_cron + pg_net,
-- authenticated with the service-role key stored in vault as
-- 'email_queue_service_role_key' (the same secret the email queue cron uses).

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language TEXT CHECK (language IN ('en', 'fr'));

CREATE TABLE IF NOT EXISTS public.newsletter_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  onboarding_enabled BOOLEAN NOT NULL DEFAULT true,
  -- Only ambassadors approved on or after this date receive the onboarding drip.
  onboarding_since TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.newsletter_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'all' CHECK (audience IN ('all', 'inactive')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sending', 'sent', 'cancelled', 'failed')),
  scheduled_for TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_count INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.newsletter_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issue_id TEXT NOT NULL,
  campaign_id UUID REFERENCES public.newsletter_campaigns(id) ON DELETE SET NULL,
  lang TEXT NOT NULL,
  email TEXT NOT NULL,
  message_id TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Onboarding: one send per user per issue. Campaigns: one send per user per campaign.
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_sends_onboarding
  ON public.newsletter_sends(user_id, issue_id) WHERE campaign_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_sends_campaign
  ON public.newsletter_sends(user_id, campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_user ON public.newsletter_sends(user_id);

ALTER TABLE public.newsletter_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;

-- Super admins manage settings and campaigns from /admin/newsletters; service role does everything.
DO $$ BEGIN
  CREATE POLICY "Superadmins manage newsletter settings" ON public.newsletter_settings
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'superadmin'::app_role))
    WITH CHECK (public.has_role(auth.uid(), 'superadmin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Superadmins manage newsletter campaigns" ON public.newsletter_campaigns
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'superadmin'::app_role))
    WITH CHECK (public.has_role(auth.uid(), 'superadmin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Superadmins read newsletter sends" ON public.newsletter_sends
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'superadmin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Service role manages newsletter settings" ON public.newsletter_settings
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role manages newsletter campaigns" ON public.newsletter_campaigns
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role manages newsletter sends" ON public.newsletter_sends
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Hourly cron: onboarding steps that became due + campaigns whose time has come.
DO $$
DECLARE
  existing_job INT;
BEGIN
  SELECT jobid INTO existing_job FROM cron.job WHERE jobname = 'send-newsletters';
  IF existing_job IS NOT NULL THEN
    PERFORM cron.unschedule(existing_job);
  END IF;

  PERFORM cron.schedule(
    'send-newsletters',
    '5 * * * *',
    $cron$
    SELECT net.http_post(
      url := 'https://ecimeextrtqousziglgy.supabase.co/functions/v1/send-newsletters',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key' LIMIT 1)
      ),
      body := '{"action":"run","source":"cron"}'::jsonb,
      timeout_milliseconds := 120000
    );
    $cron$
  );
END $$;
