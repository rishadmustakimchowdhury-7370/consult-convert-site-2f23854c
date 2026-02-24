
-- Add status column to services table (matching blogs/pages pattern)
ALTER TABLE public.services 
ADD COLUMN status public.content_status DEFAULT 'draft'::public.content_status;

-- Set all existing active services to 'published' so nothing breaks
UPDATE public.services SET status = 'published' WHERE is_active = true;

-- Set inactive services to 'draft'
UPDATE public.services SET status = 'draft' WHERE is_active = false;

-- Drop the old RLS policy for public viewing and replace with status-based one
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;

CREATE POLICY "Anyone can view published services"
ON public.services
FOR SELECT
USING (status = 'published'::public.content_status AND is_active = true);
