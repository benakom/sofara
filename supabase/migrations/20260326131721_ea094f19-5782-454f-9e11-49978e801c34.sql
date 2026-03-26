-- Fix 1: Allow godchildren to view their own referral bonuses
CREATE POLICY "Users can view own godchild bonuses"
ON public.referral_bonuses
FOR SELECT
TO authenticated
USING (auth.uid() = godchild_id);

-- Fix 2: Explicitly deny UPDATE on user_roles for non-superadmins
CREATE POLICY "Only superadmins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'superadmin'))
WITH CHECK (has_role(auth.uid(), 'superadmin'));