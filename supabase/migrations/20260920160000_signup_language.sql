-- Store the language chosen on the site at signup (user metadata "lang": en | fr)
-- into profiles.language, so auth and onboarding emails go out in that language.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  ref_code text;
  referrer_id uuid;
  signup_lang text;
BEGIN
  ref_code := NEW.raw_user_meta_data->>'ref_code';
  signup_lang := CASE WHEN NEW.raw_user_meta_data->>'lang' IN ('en', 'fr') THEN NEW.raw_user_meta_data->>'lang' ELSE NULL END;

  IF ref_code IS NOT NULL AND ref_code <> '' THEN
    SELECT id INTO referrer_id
    FROM public.profiles
    WHERE referral_code = ref_code
    LIMIT 1;
  END IF;

  INSERT INTO public.profiles (
    id, email, full_name, first_name, last_name, phone, occupation, language,
    profile_type, status, accepted_terms, accepted_terms_at, referred_by
  ) VALUES (
    NEW.id,
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    NULLIF(NEW.raw_user_meta_data->>'occupation', ''),
    signup_lang,
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
    language = COALESCE(public.profiles.language, EXCLUDED.language),
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

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
