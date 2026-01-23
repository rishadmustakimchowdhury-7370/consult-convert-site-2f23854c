-- Replace overly-permissive contact_submissions INSERT policy (WITH CHECK true)
-- Keep public form submission but require basic non-empty fields
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (
  email IS NOT NULL AND length(trim(email)) > 3
  AND name IS NOT NULL AND length(trim(name)) > 0
);