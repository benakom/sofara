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
    id,
    full_name,
    phone,
    profile_type,
    status,
    accepted_terms,
    accepted_terms_at,
    referred_by
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    'referrer',
    'approved',
    true,
    now(),
    referrer_id
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    profile_type = COALESCE(public.profiles.profile_type, 'referrer'),
    status = COALESCE(public.profiles.status, 'approved'),
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