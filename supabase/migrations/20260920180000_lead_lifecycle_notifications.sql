-- Lead lifecycle tracking + notifications
-- 1. Super admins can update leads (there was no UPDATE policy: admin changes hit 0 rows).
-- 2. Richer lead fields: assigned admin, next action date, lost reason, updated_by; updated_at auto-touch.
-- 3. lead_stage_events carries notes and admin-only entries; the stage trigger picks up a note
--    set through admin_update_lead() so one change = one event = one notification.
-- 4. notifications table (in-app, realtime) fed by a trigger on lead_stage_events, which also
--    pings the lead-notifications edge function for the email.
-- 5. profiles.notify_email lets ambassadors opt out of email notifications.

-- ---------- leads ----------
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS assigned_to UUID,
  ADD COLUMN IF NOT EXISTS next_action_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lost_reason TEXT,
  ADD COLUMN IF NOT EXISTS updated_by UUID,
  ADD COLUMN IF NOT EXISTS last_stage_at TIMESTAMPTZ;

UPDATE public.leads SET last_stage_at = COALESCE(last_stage_at, updated_at, created_at) WHERE last_stage_at IS NULL;

CREATE OR REPLACE FUNCTION public.touch_lead_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  NEW.updated_by := COALESCE(auth.uid(), NEW.updated_by);
  IF NEW.stage IS DISTINCT FROM OLD.stage THEN
    NEW.last_stage_at := now();
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_touch_lead_updated_at ON public.leads;
CREATE TRIGGER trg_touch_lead_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.touch_lead_updated_at();

DO $$ BEGIN
  CREATE POLICY "Superadmins can update all leads" ON public.leads
    FOR UPDATE TO authenticated
    USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Superadmins can delete leads" ON public.leads
    FOR DELETE TO authenticated USING (public.is_superadmin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- lead_stage_events ----------
ALTER TABLE public.lead_stage_events
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'stage',
  ADD COLUMN IF NOT EXISTS visible_to_ambassador BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notified_at TIMESTAMPTZ;

DO $$ BEGIN
  ALTER TABLE public.lead_stage_events ADD CONSTRAINT lead_stage_events_kind_check CHECK (kind IN ('stage', 'note'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Ambassadors only see events shared with them.
DROP POLICY IF EXISTS "Owners can view own lead events" ON public.lead_stage_events;
CREATE POLICY "Owners can view own lead events" ON public.lead_stage_events
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND visible_to_ambassador);

-- Stage trigger: also records the note/visibility passed through admin_update_lead().
CREATE OR REPLACE FUNCTION public.log_lead_stage_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_note text;
  v_visible boolean;
BEGIN
  v_note := NULLIF(current_setting('sofara.stage_note', true), '');
  v_visible := COALESCE(NULLIF(current_setting('sofara.stage_visible', true), '')::boolean, true);
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.lead_stage_events (lead_id, user_id, from_stage, to_stage, changed_by, kind)
    VALUES (NEW.id, NEW.user_id, NULL, COALESCE(NEW.stage, 'nouveau'), auth.uid(), 'stage');
  ELSIF TG_OP = 'UPDATE' AND NEW.stage IS DISTINCT FROM OLD.stage THEN
    INSERT INTO public.lead_stage_events (lead_id, user_id, from_stage, to_stage, changed_by, note, visible_to_ambassador, kind)
    VALUES (NEW.id, NEW.user_id, OLD.stage, COALESCE(NEW.stage, 'nouveau'), auth.uid(), v_note, v_visible, 'stage');
  END IF;
  RETURN NEW;
END;
$$;

-- One call from the admin UI: stage + note + follow-up fields, producing a single event.
CREATE OR REPLACE FUNCTION public.admin_update_lead(
  p_lead_id UUID,
  p_stage TEXT DEFAULT NULL,
  p_note TEXT DEFAULT NULL,
  p_visible BOOLEAN DEFAULT true,
  p_next_action TEXT DEFAULT NULL,
  p_next_action_at TIMESTAMPTZ DEFAULT NULL,
  p_lost_reason TEXT DEFAULT NULL,
  p_score TEXT DEFAULT NULL,
  p_assigned_to UUID DEFAULT NULL,
  p_clear_next_action BOOLEAN DEFAULT false
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_lead public.leads%ROWTYPE;
  v_stage_changed boolean := false;
  v_event_id uuid;
BEGIN
  IF NOT public.is_superadmin() THEN
    RAISE EXCEPTION 'Only Sofara admins can update leads' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_lead FROM public.leads WHERE id = p_lead_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead not found' USING ERRCODE = 'P0002';
  END IF;

  v_stage_changed := p_stage IS NOT NULL AND p_stage IS DISTINCT FROM v_lead.stage;

  -- Hand the note to the stage trigger so it lands on the same event row.
  PERFORM set_config('sofara.stage_note', CASE WHEN v_stage_changed THEN COALESCE(p_note, '') ELSE '' END, true);
  PERFORM set_config('sofara.stage_visible', COALESCE(p_visible, true)::text, true);

  UPDATE public.leads SET
    stage = COALESCE(p_stage, stage),
    next_action = CASE WHEN p_clear_next_action THEN NULL ELSE COALESCE(p_next_action, next_action) END,
    next_action_at = CASE WHEN p_clear_next_action THEN NULL ELSE COALESCE(p_next_action_at, next_action_at) END,
    lost_reason = COALESCE(p_lost_reason, lost_reason),
    score = COALESCE(p_score, score),
    assigned_to = COALESCE(p_assigned_to, assigned_to)
  WHERE id = p_lead_id;

  PERFORM set_config('sofara.stage_note', '', true);

  IF v_stage_changed THEN
    SELECT id INTO v_event_id FROM public.lead_stage_events
    WHERE lead_id = p_lead_id AND kind = 'stage' ORDER BY created_at DESC LIMIT 1;
  ELSIF p_note IS NOT NULL AND btrim(p_note) <> '' THEN
    INSERT INTO public.lead_stage_events (lead_id, user_id, from_stage, to_stage, changed_by, note, visible_to_ambassador, kind)
    VALUES (p_lead_id, v_lead.user_id, v_lead.stage, v_lead.stage, auth.uid(), p_note, COALESCE(p_visible, true), 'note')
    RETURNING id INTO v_event_id;
  END IF;

  RETURN jsonb_build_object('lead_id', p_lead_id, 'stage_changed', v_stage_changed, 'event_id', v_event_id);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.admin_update_lead(UUID, TEXT, TEXT, BOOLEAN, TEXT, TIMESTAMPTZ, TEXT, TEXT, UUID, BOOLEAN) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_lead(UUID, TEXT, TEXT, BOOLEAN, TEXT, TIMESTAMPTZ, TEXT, TEXT, UUID, BOOLEAN) TO authenticated, service_role;

-- ---------- profiles ----------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notify_email BOOLEAN NOT NULL DEFAULT true;

-- ---------- notifications ----------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('lead_stage', 'lead_note', 'new_lead', 'commission', 'system')),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.lead_stage_events(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id) WHERE read_at IS NULL;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Users read own notifications" ON public.notifications
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users mark own notifications read" ON public.notifications
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users delete own notifications" ON public.notifications
    FOR DELETE TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Service role manages notifications" ON public.notifications
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

-- Realtime for the bell.
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL; END $$;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Event -> notification rows (+ email ping). Never blocks the originating write.
CREATE OR REPLACE FUNCTION public.notify_lead_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_lead public.leads%ROWTYPE;
  v_owner public.profiles%ROWTYPE;
  v_data jsonb;
  v_admin record;
  v_key text;
BEGIN
  SELECT * INTO v_lead FROM public.leads WHERE id = NEW.lead_id;
  IF NOT FOUND THEN RETURN NEW; END IF;
  SELECT * INTO v_owner FROM public.profiles WHERE id = v_lead.user_id;

  v_data := jsonb_build_object(
    'lead_id', v_lead.id,
    'lead_name', btrim(COALESCE(v_lead.first_name, '') || ' ' || COALESCE(v_lead.last_name, '')),
    'lead_first_name', v_lead.first_name,
    'from_stage', NEW.from_stage,
    'to_stage', NEW.to_stage,
    'note', CASE WHEN NEW.visible_to_ambassador THEN NEW.note ELSE NULL END,
    'ambassador_id', v_lead.user_id,
    'ambassador_name', v_owner.full_name
  );

  IF NEW.kind = 'stage' AND NEW.from_stage IS NULL THEN
    -- New lead created by the ambassador: tell every super admin (web only).
    FOR v_admin IN SELECT user_id FROM public.user_roles WHERE role = 'superadmin' LOOP
      INSERT INTO public.notifications (user_id, type, lead_id, event_id, data, url)
      VALUES (v_admin.user_id, 'new_lead', v_lead.id, NEW.id, v_data, '/admin/pipeline?lead=' || v_lead.id);
    END LOOP;
    RETURN NEW;
  END IF;

  IF NOT NEW.visible_to_ambassador THEN RETURN NEW; END IF;
  -- Changes made by the ambassador themselves need no notification.
  IF NEW.changed_by IS NOT NULL AND NEW.changed_by = v_lead.user_id THEN RETURN NEW; END IF;

  INSERT INTO public.notifications (user_id, type, lead_id, event_id, data, url)
  VALUES (v_lead.user_id, CASE WHEN NEW.kind = 'note' THEN 'lead_note' ELSE 'lead_stage' END, v_lead.id, NEW.id, v_data, '/dashboard/pipeline?lead=' || v_lead.id);

  -- Email: fire and forget; the hourly sweep in lead-notifications catches anything missed.
  BEGIN
    SELECT decrypted_secret INTO v_key FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key' LIMIT 1;
    IF v_key IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://ecimeextrtqousziglgy.supabase.co/functions/v1/lead-notifications',
        headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_key),
        body := jsonb_build_object('event_id', NEW.id),
        timeout_milliseconds := 15000
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_notify_lead_event ON public.lead_stage_events;
CREATE TRIGGER trg_notify_lead_event
AFTER INSERT ON public.lead_stage_events
FOR EACH ROW EXECUTE FUNCTION public.notify_lead_event();
REVOKE EXECUTE ON FUNCTION public.notify_lead_event() FROM PUBLIC, anon, authenticated;

-- Safety net: every 10 minutes, email any event that was not notified.
DO $$
DECLARE existing_job INT;
BEGIN
  SELECT jobid INTO existing_job FROM cron.job WHERE jobname = 'lead-notifications-sweep';
  IF existing_job IS NOT NULL THEN PERFORM cron.unschedule(existing_job); END IF;
  PERFORM cron.schedule(
    'lead-notifications-sweep',
    '*/10 * * * *',
    $cron$
    SELECT net.http_post(
      url := 'https://ecimeextrtqousziglgy.supabase.co/functions/v1/lead-notifications',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key' LIMIT 1)
      ),
      body := '{"action":"sweep"}'::jsonb,
      timeout_milliseconds := 60000
    );
    $cron$
  );
END $$;
