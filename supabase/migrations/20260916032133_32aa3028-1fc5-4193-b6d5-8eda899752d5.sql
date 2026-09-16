-- Sofara: lead stage timeline + stage changes reserved to super admins + vocabulary normalization.

-- 1. Normalize legacy stage / status values to the canonical vocabulary.
UPDATE public.leads SET stage = CASE stage
  WHEN 'contacté' THEN 'prequalifie'
  WHEN 'contacte' THEN 'prequalifie'
  WHEN 'qualifié' THEN 'qualifie'
  WHEN 'négociation' THEN 'offre_envoyee'
  WHEN 'negociation' THEN 'offre_envoyee'
  WHEN 'closing' THEN 'dp_paye'
  WHEN 'perdu' THEN 'injoignable'
  WHEN 'lost' THEN 'injoignable'
  WHEN 'new' THEN 'nouveau'
  ELSE stage END
WHERE stage IN ('contacté','contacte','qualifié','négociation','negociation','closing','perdu','lost','new');
UPDATE public.leads SET stage = 'nouveau' WHERE stage IS NULL OR stage = '';

UPDATE public.commissions SET status = CASE status
  WHEN 'confirmed' THEN 'validated'
  WHEN 'approved' THEN 'validated'
  WHEN 'pending' THEN 'estimated'
  ELSE status END
WHERE status IN ('confirmed','approved','pending');
UPDATE public.commissions SET status = 'estimated' WHERE status IS NULL OR status = '';

-- 2. Stage history, written by trigger so it is complete regardless of who changes the stage.
CREATE TABLE IF NOT EXISTS public.lead_stage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,                      -- lead owner (ambassador)
  from_stage text,
  to_stage text NOT NULL,
  changed_by uuid,                            -- auth user who made the change (null = system)
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lead_stage_events_lead ON public.lead_stage_events (lead_id, created_at);

ALTER TABLE public.lead_stage_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners can view own lead events" ON public.lead_stage_events;
CREATE POLICY "Owners can view own lead events" ON public.lead_stage_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Superadmins can view all lead events" ON public.lead_stage_events;
CREATE POLICY "Superadmins can view all lead events" ON public.lead_stage_events
  FOR SELECT TO authenticated USING (public.is_superadmin());
DROP POLICY IF EXISTS "Superadmins can add lead notes" ON public.lead_stage_events;
CREATE POLICY "Superadmins can add lead notes" ON public.lead_stage_events
  FOR INSERT TO authenticated WITH CHECK (public.is_superadmin());
GRANT SELECT, INSERT ON public.lead_stage_events TO authenticated;
GRANT ALL ON public.lead_stage_events TO service_role;

CREATE OR REPLACE FUNCTION public.log_lead_stage_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.lead_stage_events (lead_id, user_id, from_stage, to_stage, changed_by)
    VALUES (NEW.id, NEW.user_id, NULL, COALESCE(NEW.stage, 'nouveau'), auth.uid());
  ELSIF TG_OP = 'UPDATE' AND NEW.stage IS DISTINCT FROM OLD.stage THEN
    INSERT INTO public.lead_stage_events (lead_id, user_id, from_stage, to_stage, changed_by)
    VALUES (NEW.id, NEW.user_id, OLD.stage, COALESCE(NEW.stage, 'nouveau'), auth.uid());
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.log_lead_stage_event() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_log_lead_stage_event ON public.leads;
CREATE TRIGGER trg_log_lead_stage_event
AFTER INSERT OR UPDATE OF stage ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.log_lead_stage_event();

-- 3. Only super admins may move a lead between stages. Ambassadors keep editing their own lead details.
CREATE OR REPLACE FUNCTION public.enforce_stage_change_by_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.stage IS DISTINCT FROM OLD.stage AND auth.uid() IS NOT NULL AND NOT public.is_superadmin() THEN
    RAISE EXCEPTION 'Only Sofara admins can change the stage of a lead' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_stage_change_by_admin() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_enforce_stage_change_by_admin ON public.leads;
CREATE TRIGGER trg_enforce_stage_change_by_admin
BEFORE UPDATE OF stage ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.enforce_stage_change_by_admin();

-- New leads always start at "nouveau", whoever inserts them.
ALTER TABLE public.leads ALTER COLUMN stage SET DEFAULT 'nouveau';

-- 4. Backfill one "created" event for existing leads that have no history yet.
INSERT INTO public.lead_stage_events (lead_id, user_id, from_stage, to_stage, changed_by, created_at)
SELECT l.id, l.user_id, NULL, COALESCE(l.stage, 'nouveau'), NULL, l.created_at
FROM public.leads l
WHERE NOT EXISTS (SELECT 1 FROM public.lead_stage_events e WHERE e.lead_id = l.id);