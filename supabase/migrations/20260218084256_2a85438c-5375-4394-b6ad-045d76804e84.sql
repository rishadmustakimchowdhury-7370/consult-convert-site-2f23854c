
DROP POLICY "Admins can manage services" ON public.services;

CREATE POLICY "Admins can manage services"
ON public.services
FOR ALL
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
  OR has_role(auth.uid(), 'manager'::app_role)
);
