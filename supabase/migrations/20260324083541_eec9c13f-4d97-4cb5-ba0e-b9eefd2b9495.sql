-- Add referral columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

-- Create referral_bonuses table
CREATE TABLE public.referral_bonuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  super_ambassador_id uuid NOT NULL REFERENCES public.profiles(id),
  godchild_id uuid NOT NULL REFERENCES public.profiles(id),
  commission_id uuid REFERENCES public.commissions(id),
  bonus_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_bonuses ENABLE ROW LEVEL SECURITY;

-- RLS: users see own bonuses
CREATE POLICY "Users can view own referral bonuses"
  ON public.referral_bonuses FOR SELECT TO authenticated
  USING (auth.uid() = super_ambassador_id);

-- RLS: superadmins manage all
CREATE POLICY "Superadmins manage referral bonuses"
  ON public.referral_bonuses FOR ALL TO authenticated
  USING (is_superadmin())
  WITH CHECK (is_superadmin());

-- Function to generate referral code from name
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  base_code text;
  final_code text;
  suffix text;
BEGIN
  IF NEW.referral_code IS NULL AND NEW.full_name IS NOT NULL THEN
    base_code := upper(split_part(NEW.full_name, ' ', 1));
    base_code := regexp_replace(base_code, '[^A-Z0-9]', '', 'g');
    base_code := left(base_code, 6);
    suffix := upper(substr(md5(random()::text), 1, 3));
    final_code := base_code || '-' || suffix;
    WHILE EXISTS (SELECT 1 FROM profiles WHERE referral_code = final_code) LOOP
      suffix := upper(substr(md5(random()::text), 1, 3));
      final_code := base_code || '-' || suffix;
    END LOOP;
    NEW.referral_code := final_code;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_generate_referral_code
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_referral_code();