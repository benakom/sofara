-- Fix 1: Remove user INSERT policy on commissions (privilege escalation)
DROP POLICY IF EXISTS "Users can insert own commissions" ON public.commissions;
DROP POLICY IF EXISTS "Approved users can insert own commissions" ON public.commissions;

-- Only superadmins can insert commissions
CREATE POLICY "Only superadmins can insert commissions"
ON public.commissions
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'superadmin'));

-- Fix 2: has_role() should use the _user_id parameter, not auth.uid()
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;