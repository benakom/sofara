-- Ambassador validation flow
-- Every signup becomes a profile with status 'pending' and carries everything the
-- signup form collected (email, first/last name, occupation). A super admin validates
-- it (status 'approved') or rejects it. Only super admins can change a status.
-- Also records when the "under review" and "welcome" emails were sent.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS under_review_email_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_email_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_profiles_status_created ON public.profiles(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(lower(email));

-- Backfill from auth.users for accounts that already exist.
UPDATE public.profiles p
SET email = u.email,
    first_name = COALESCE(p.first_name, u.raw_user_meta_data->>'first_name'),
    last_name = COALESCE(p.last_name, u.raw_user_meta_data->>'last_name'),
    occupation = COALESCE(p.occupation, u.raw_user_meta_data->>'occupation')
FROM auth.users u
WHERE u.id = p.id AND (p.email IS NULL OR p.first_name IS NULL);

-- Existing accounts keep their access; anyone still sitting in the legacy
-- 'onboarding' state is treated as validated (they were auto-approved before).
UPDATE public.profiles SET status = 'approved' WHERE status = 'onboarding';

-- New signups start as pending and carry the full application.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  ref_code text;
  referrer_id uuid;
BEGIN
  ref_code := NEW.raw_user_meta_data->>'ref_code';

  IF ref_code IS NOT NULL AND ref_code <> '' THEN
    SELECT id INTO referrer_id
    FROM public.profiles
    WHERE referral_code = ref_code
    LIMIT 1;
  END IF;

  INSERT INTO public.profiles (
    id, email, full_name, first_name, last_name, phone, occupation,
    profile_type, status, accepted_terms, accepted_terms_at, referred_by
  ) VALUES (
    NEW.id,
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    NULLIF(NEW.raw_user_meta_data->>'occupation', ''),
    'referrer',
    'pending',
    true,
    now(),
    referrer_id
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    occupation = COALESCE(EXCLUDED.occupation, public.profiles.occupation),
    profile_type = COALESCE(public.profiles.profile_type, 'referrer'),
    status = COALESCE(public.profiles.status, 'pending'),
    accepted_terms = true,
    accepted_terms_at = COALESCE(public.profiles.accepted_terms_at, now()),
    referred_by = COALESCE(public.profiles.referred_by, EXCLUDED.referred_by),
    updated_at = now();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Keep profiles.email in sync if the auth email changes.
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.profiles SET email = NEW.email, updated_at = now() WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_email_changed ON auth.users;
CREATE TRIGGER on_auth_user_email_changed
AFTER UPDATE OF email ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_email();
REVOKE EXECUTE ON FUNCTION public.sync_profile_email() FROM PUBLIC, anon, authenticated;

-- Only super admins (or the service role / SQL) may change validation fields.
-- The self-update RLS policy has no WITH CHECK, so this trigger is the guard.
CREATE OR REPLACE FUNCTION public.protect_profile_validation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  jwt_role text;
BEGIN
  jwt_role := COALESCE(current_setting('request.jwt.claims', true)::jsonb->>'role', '');
  IF jwt_role = 'authenticated' AND NOT public.is_superadmin() THEN
    NEW.status := OLD.status;
    NEW.reviewed_at := OLD.reviewed_at;
    NEW.reviewed_by := OLD.reviewed_by;
    NEW.email := OLD.email;
    NEW.under_review_email_at := OLD.under_review_email_at;
    NEW.approved_email_at := OLD.approved_email_at;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_protect_profile_validation ON public.profiles;
CREATE TRIGGER trg_protect_profile_validation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_validation();

-- Self-inserted profiles (fallback path in the app) can never start approved.
CREATE OR REPLACE FUNCTION public.default_profile_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  jwt_role text;
BEGIN
  jwt_role := COALESCE(current_setting('request.jwt.claims', true)::jsonb->>'role', '');
  IF jwt_role = 'authenticated' AND NOT public.is_superadmin() THEN
    NEW.status := 'pending';
    NEW.reviewed_at := NULL;
    NEW.reviewed_by := NULL;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_default_profile_status ON public.profiles;
CREATE TRIGGER trg_default_profile_status
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.default_profile_status();
