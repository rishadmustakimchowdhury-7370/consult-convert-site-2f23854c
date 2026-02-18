
-- Fix pages RLS
DROP POLICY "Admins can manage all pages" ON public.pages;
CREATE POLICY "Admins can manage all pages" ON public.pages FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Fix testimonials RLS
DROP POLICY "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Fix categories RLS
DROP POLICY "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Fix projects RLS
DROP POLICY "Admins can manage all projects" ON public.projects;
CREATE POLICY "Admins can manage all projects" ON public.projects FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Fix blogs RLS
DROP POLICY "Admins can manage all blogs" ON public.blogs;
CREATE POLICY "Admins can manage all blogs" ON public.blogs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'editor'::app_role) OR has_role(auth.uid(), 'seo_manager'::app_role));

-- Fix media RLS
DROP POLICY "Admins can manage media" ON public.media;
CREATE POLICY "Admins can manage media" ON public.media FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Fix navigation_menu RLS
DROP POLICY "Admins can manage menu items" ON public.navigation_menu;
CREATE POLICY "Admins can manage menu items" ON public.navigation_menu FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Fix homepage_content RLS
DROP POLICY "Admins can manage homepage content" ON public.homepage_content;
CREATE POLICY "Admins can manage homepage content" ON public.homepage_content FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Fix site_settings RLS
DROP POLICY "Admins can manage settings" ON public.site_settings;
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Fix project_files RLS
DROP POLICY "Admins can manage project files" ON public.project_files;
CREATE POLICY "Admins can manage project files" ON public.project_files FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Fix contact_submissions RLS
DROP POLICY "Admins can view submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

DROP POLICY "Admins can update submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update submissions" ON public.contact_submissions FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));
