-- Consent-first lead intake
-- Ambassadors must declare how they know the lead, how the lead agreed to be contacted,
-- and attest it; the DB rejects anything else. Admins verify consent on the first call.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS lead_country TEXT,
  ADD COLUMN IF NOT EXISTS lead_language TEXT,
  ADD COLUMN IF NOT EXISTS relationship TEXT,
  ADD COLUMN IF NOT EXISTS relationship_details TEXT,
  ADD COLUMN IF NOT EXISTS campaign_name TEXT,
  ADD COLUMN IF NOT EXISTS campaign_link TEXT,
  ADD COLUMN IF NOT EXISTS consent_method TEXT,
  ADD COLUMN IF NOT EXISTS consent_date DATE,
  ADD COLUMN IF NOT EXISTS consent_evidence_url TEXT,
  ADD COLUMN IF NOT EXISTS budget_range TEXT,
  ADD COLUMN IF NOT EXISTS timeline TEXT,
  ADD COLUMN IF NOT EXISTS purpose TEXT,
  ADD COLUMN IF NOT EXISTS preferred_channel TEXT,
  ADD COLUMN IF NOT EXISTS best_time TEXT,
  ADD COLUMN IF NOT EXISTS attested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_status TEXT NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS consent_note TEXT,
  ADD COLUMN IF NOT EXISTS consent_checked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_checked_by UUID;

DO $$ BEGIN
  ALTER TABLE public.leads ADD CONSTRAINT leads_consent_status_check CHECK (consent_status IN ('unverified', 'verified', 'disputed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Leads that existed before this rule are left as "unverified"; new ones must pass the trigger.
CREATE OR REPLACE FUNCTION public.enforce_lead_intake()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  jwt_role text;
BEGIN
  jwt_role := COALESCE(current_setting('request.jwt.claims', true)::jsonb->>'role', '');
  -- Only ambassadors submitting through the app are held to the intake rules.
  IF jwt_role <> 'authenticated' OR public.is_superadmin() THEN
    RETURN NEW;
  END IF;

  IF NEW.phone IS NULL OR length(regexp_replace(NEW.phone, '\D', '', 'g')) < 8 THEN
    RAISE EXCEPTION 'A phone number with country code is required' USING ERRCODE = '23514';
  END IF;
  IF NEW.relationship IS NULL OR NEW.relationship NOT IN ('personal', 'client', 'community', 'campaign', 'content', 'event', 'other') THEN
    RAISE EXCEPTION 'Tell us how you know this person' USING ERRCODE = '23514';
  END IF;
  IF NEW.relationship_details IS NULL OR length(btrim(NEW.relationship_details)) < 20 THEN
    RAISE EXCEPTION 'Give at least 20 characters of context about this person' USING ERRCODE = '23514';
  END IF;
  IF NEW.relationship = 'campaign' AND (NEW.campaign_name IS NULL OR btrim(NEW.campaign_name) = '' OR NEW.campaign_link IS NULL OR NEW.campaign_link !~* '^https?://') THEN
    RAISE EXCEPTION 'Media buyers must name the campaign and link the form or landing page' USING ERRCODE = '23514';
  END IF;
  IF NEW.relationship = 'content' AND (NEW.campaign_link IS NULL OR NEW.campaign_link !~* '^https?://') THEN
    RAISE EXCEPTION 'Creators must link their profile or channel' USING ERRCODE = '23514';
  END IF;
  IF NEW.consent_method IS NULL OR NEW.consent_method NOT IN ('written', 'form', 'verbal') THEN
    RAISE EXCEPTION 'The person must have agreed to be contacted by Sofara (written, form or verbal)' USING ERRCODE = '23514';
  END IF;
  IF NEW.consent_date IS NULL OR NEW.consent_date > (now() + interval '1 day')::date THEN
    RAISE EXCEPTION 'A valid consent date is required' USING ERRCODE = '23514';
  END IF;
  IF NEW.attested_at IS NULL THEN
    RAISE EXCEPTION 'The consent declarations must be accepted' USING ERRCODE = '23514';
  END IF;

  NEW.consent_status := 'unverified';
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_enforce_lead_intake ON public.leads;
CREATE TRIGGER trg_enforce_lead_intake
BEFORE INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.enforce_lead_intake();
REVOKE EXECUTE ON FUNCTION public.enforce_lead_intake() FROM PUBLIC, anon, authenticated;

-- Ambassadors cannot rewrite the consent record after submission.
CREATE OR REPLACE FUNCTION public.protect_lead_intake()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  jwt_role text;
BEGIN
  jwt_role := COALESCE(current_setting('request.jwt.claims', true)::jsonb->>'role', '');
  IF jwt_role = 'authenticated' AND NOT public.is_superadmin() THEN
    NEW.relationship := OLD.relationship;
    NEW.relationship_details := OLD.relationship_details;
    NEW.campaign_name := OLD.campaign_name;
    NEW.campaign_link := OLD.campaign_link;
    NEW.consent_method := OLD.consent_method;
    NEW.consent_date := OLD.consent_date;
    NEW.consent_evidence_url := OLD.consent_evidence_url;
    NEW.attested_at := OLD.attested_at;
    NEW.consent_status := OLD.consent_status;
    NEW.consent_note := OLD.consent_note;
    NEW.consent_checked_at := OLD.consent_checked_at;
    NEW.consent_checked_by := OLD.consent_checked_by;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_protect_lead_intake ON public.leads;
CREATE TRIGGER trg_protect_lead_intake
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.protect_lead_intake();
REVOKE EXECUTE ON FUNCTION public.protect_lead_intake() FROM PUBLIC, anon, authenticated;

-- Admin: record the consent check made on the first call. A shared note event notifies the ambassador.
CREATE OR REPLACE FUNCTION public.admin_set_lead_consent(p_lead_id UUID, p_status TEXT, p_note TEXT DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  v_lead public.leads%ROWTYPE;
  v_event_id uuid;
BEGIN
  IF NOT public.is_superadmin() THEN
    RAISE EXCEPTION 'Only Sofara admins can verify consent' USING ERRCODE = '42501';
  END IF;
  IF p_status NOT IN ('unverified', 'verified', 'disputed') THEN
    RAISE EXCEPTION 'Invalid consent status' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_lead FROM public.leads WHERE id = p_lead_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead not found' USING ERRCODE = 'P0002'; END IF;

  UPDATE public.leads SET
    consent_status = p_status,
    consent_note = COALESCE(p_note, consent_note),
    consent_checked_at = now(),
    consent_checked_by = auth.uid()
  WHERE id = p_lead_id;

  IF p_status = 'verified' OR p_status = 'disputed' THEN
    INSERT INTO public.lead_stage_events (lead_id, user_id, from_stage, to_stage, changed_by, note, visible_to_ambassador, kind)
    VALUES (
      p_lead_id, v_lead.user_id, v_lead.stage, v_lead.stage, auth.uid(),
      CASE WHEN p_status = 'verified'
        THEN 'Consent confirmed: the lead agreed to be contacted through you.' || COALESCE(' ' || p_note, '')
        ELSE 'Consent disputed: the lead says they did not agree to be contacted through you. Please reply to this note with the context.' || COALESCE(' ' || p_note, '')
      END,
      true, 'note'
    ) RETURNING id INTO v_event_id;
  END IF;

  RETURN jsonb_build_object('lead_id', p_lead_id, 'consent_status', p_status, 'event_id', v_event_id);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.admin_set_lead_consent(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_lead_consent(UUID, TEXT, TEXT) TO authenticated, service_role;
