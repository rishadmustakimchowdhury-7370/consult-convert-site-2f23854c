-- Add SEO visibility toggle column to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS discourage_search_engines boolean DEFAULT false;