
-- Add status and onboarding fields to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS profile_type text,
  ADD COLUMN IF NOT EXISTS accepted_terms boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS accepted_terms_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone;

-- Create a security definer function to check profile status without recursion
CREATE OR REPLACE FUNCTION public.get_profile_status(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(status, 'pending')
  FROM public.profiles
  WHERE id = _user_id
$$;

-- Update RLS on leads: only approved users can INSERT
DROP POLICY IF EXISTS "Users can insert own leads" ON public.leads;
CREATE POLICY "Users can insert own leads" ON public.leads
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.get_profile_status(auth.uid()) = 'approved');

-- Update RLS on commissions: only approved users can INSERT
DROP POLICY IF EXISTS "Users can insert own commissions" ON public.commissions;
CREATE POLICY "Users can insert own commissions" ON public.commissions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.get_profile_status(auth.uid()) = 'approved');

-- Update RLS on kyc_submissions: only approved users can INSERT
DROP POLICY IF EXISTS "Users can insert own kyc submissions" ON public.kyc_submissions;
CREATE POLICY "Users can insert own kyc submissions" ON public.kyc_submissions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.get_profile_status(auth.uid()) = 'approved');

-- Superadmins can update any profile (for approvals)
DROP POLICY IF EXISTS "Superadmins can update all profiles" ON public.profiles;
CREATE POLICY "Superadmins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_superadmin());
