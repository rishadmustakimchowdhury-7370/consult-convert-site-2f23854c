
-- Add canonical_url override field to blogs and pages
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS canonical_url text;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS canonical_url text;
