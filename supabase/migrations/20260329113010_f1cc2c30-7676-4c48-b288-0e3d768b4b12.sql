
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  ref_code text;
  referrer_id uuid;
BEGIN
  ref_code := NEW.raw_user_meta_data->>'ref_code';
  
  IF ref_code IS NOT NULL AND ref_code != '' THEN
    SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = ref_code LIMIT 1;
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
  );
  RETURN NEW;
END;
$function$;
