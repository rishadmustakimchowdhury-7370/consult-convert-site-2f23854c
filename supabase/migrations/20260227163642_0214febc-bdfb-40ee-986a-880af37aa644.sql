
-- Add Google Ads tracking fields to site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS google_ads_conversion_id text,
  ADD COLUMN IF NOT EXISTS google_ads_conversion_label text,
  ADD COLUMN IF NOT EXISTS google_ads_enabled boolean DEFAULT false;

-- Create conversion_events table to store conversion data
CREATE TABLE public.conversion_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  landing_page text,
  page_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert conversion events (public forms)
CREATE POLICY "Anyone can insert conversion events"
  ON public.conversion_events
  FOR INSERT
  WITH CHECK (true);

-- Admins can view conversion events
CREATE POLICY "Admins can view conversion events"
  ON public.conversion_events
  FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'super_admin'::app_role)
    OR has_role(auth.uid(), 'manager'::app_role)
  );

-- Admins can delete conversion events
CREATE POLICY "Admins can delete conversion events"
  ON public.conversion_events
  FOR DELETE
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'super_admin'::app_role)
  );
