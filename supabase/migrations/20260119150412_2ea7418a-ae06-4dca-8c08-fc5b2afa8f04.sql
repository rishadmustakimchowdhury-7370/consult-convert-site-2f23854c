-- Drop old policy
DROP POLICY IF EXISTS "Admins can manage invoices" ON public.invoices;

-- Create new policy that checks for all admin roles
CREATE POLICY "Admins can manage invoices" 
ON public.invoices 
FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role)
);

-- Also fix invoice_items table
DROP POLICY IF EXISTS "Admins can manage invoice items" ON public.invoice_items;

CREATE POLICY "Admins can manage invoice items" 
ON public.invoice_items 
FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role)
);