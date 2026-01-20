-- Fix user_roles RLS to allow super_admin to manage all roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Super admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Add invitation_status column to team_members
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS invitation_status text DEFAULT 'pending' CHECK (invitation_status IN ('pending', 'accepted'));

-- Update existing team members to 'accepted' status
UPDATE public.team_members SET invitation_status = 'accepted' WHERE invitation_status IS NULL;