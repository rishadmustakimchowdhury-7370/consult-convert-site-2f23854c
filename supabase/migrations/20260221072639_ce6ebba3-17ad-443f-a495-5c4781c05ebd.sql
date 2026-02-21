
-- Drop all existing storage policies
DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload project files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view project files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage SEO verification files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view SEO verification files" ON storage.objects;

-- Media bucket: public read
CREATE POLICY "Anyone can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Media bucket: admin roles can upload
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'media' AND (
    public.has_role(auth.uid(), 'admin'::public.app_role) OR
    public.has_role(auth.uid(), 'super_admin'::public.app_role) OR
    public.has_role(auth.uid(), 'manager'::public.app_role) OR
    public.has_role(auth.uid(), 'editor'::public.app_role)
  )
);

-- Media bucket: admin roles can update
CREATE POLICY "Admins can update media" ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'media' AND (
    public.has_role(auth.uid(), 'admin'::public.app_role) OR
    public.has_role(auth.uid(), 'super_admin'::public.app_role) OR
    public.has_role(auth.uid(), 'manager'::public.app_role) OR
    public.has_role(auth.uid(), 'editor'::public.app_role)
  )
);

-- Media bucket: admin roles can delete
CREATE POLICY "Admins can delete media" ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'media' AND (
    public.has_role(auth.uid(), 'admin'::public.app_role) OR
    public.has_role(auth.uid(), 'super_admin'::public.app_role) OR
    public.has_role(auth.uid(), 'manager'::public.app_role) OR
    public.has_role(auth.uid(), 'editor'::public.app_role)
  )
);

-- Project files bucket
CREATE POLICY "Admins can view project files" ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'project-files' AND (
    public.has_role(auth.uid(), 'admin'::public.app_role) OR
    public.has_role(auth.uid(), 'super_admin'::public.app_role) OR
    public.has_role(auth.uid(), 'manager'::public.app_role)
  )
);

CREATE POLICY "Admins can upload project files" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-files' AND (
    public.has_role(auth.uid(), 'admin'::public.app_role) OR
    public.has_role(auth.uid(), 'super_admin'::public.app_role) OR
    public.has_role(auth.uid(), 'manager'::public.app_role)
  )
);

CREATE POLICY "Admins can delete project files" ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'project-files' AND (
    public.has_role(auth.uid(), 'admin'::public.app_role) OR
    public.has_role(auth.uid(), 'super_admin'::public.app_role) OR
    public.has_role(auth.uid(), 'manager'::public.app_role)
  )
);

-- SEO verification bucket
CREATE POLICY "Public can view SEO verification files" ON storage.objects FOR SELECT USING (bucket_id = 'seo-verification');

CREATE POLICY "Admins can manage SEO verification files" ON storage.objects FOR ALL TO authenticated
USING (
  bucket_id = 'seo-verification' AND (
    public.has_role(auth.uid(), 'admin'::public.app_role) OR
    public.has_role(auth.uid(), 'super_admin'::public.app_role)
  )
)
WITH CHECK (
  bucket_id = 'seo-verification' AND (
    public.has_role(auth.uid(), 'admin'::public.app_role) OR
    public.has_role(auth.uid(), 'super_admin'::public.app_role)
  )
);
