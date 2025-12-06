-- Create project status enum
CREATE TYPE public.project_status AS ENUM ('lead', 'proposal', 'approved', 'in_progress', 'review', 'completed', 'cancelled');

-- Create projects table for project management
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  project_description TEXT,
  cover_image TEXT,
  status project_status NOT NULL DEFAULT 'lead',
  creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_date DATE,
  earning_amount DECIMAL(12,2) DEFAULT 0,
  cost_amount DECIMAL(12,2) DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS policies for projects
CREATE POLICY "Admins can manage all projects"
ON public.projects
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view public completed projects"
ON public.projects
FOR SELECT
USING (is_public = true AND status = 'completed'::project_status);

-- Create project files table
CREATE TABLE public.project_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- RLS policies for project files
CREATE POLICY "Admins can manage project files"
ON public.project_files
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add SEO verification fields to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS google_verification_meta TEXT,
ADD COLUMN IF NOT EXISTS bing_verification_meta TEXT,
ADD COLUMN IF NOT EXISTS google_verification_file TEXT,
ADD COLUMN IF NOT EXISTS bing_verification_file TEXT;

-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for project files
CREATE POLICY "Admins can upload project files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'project-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view project files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete project files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'project-files' AND has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for SEO verification files (public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('seo-verification', 'seo-verification', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for SEO verification files
CREATE POLICY "Admins can manage SEO verification files"
ON storage.objects
FOR ALL
USING (bucket_id = 'seo-verification' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view SEO verification files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'seo-verification');

-- Trigger for updated_at on projects
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();