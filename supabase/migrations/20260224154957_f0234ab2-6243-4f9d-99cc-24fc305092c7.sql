
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS seo_score integer DEFAULT 0;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS seo_score integer DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS seo_score integer DEFAULT 0;
