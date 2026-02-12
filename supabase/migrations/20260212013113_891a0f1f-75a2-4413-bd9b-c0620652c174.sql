
-- Fix 1: Restrict user_roles visibility
-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Authenticated can view roles" ON public.user_roles;

-- Users can only view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 2: Block invoice deletions
CREATE POLICY "No one can delete invoices"
ON public.invoices
FOR DELETE
USING (false);
