-- Add favicon_url and additional settings to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS favicon_url text,
ADD COLUMN IF NOT EXISTS logo_width integer DEFAULT 180,
ADD COLUMN IF NOT EXISTS logo_height integer DEFAULT 60,
ADD COLUMN IF NOT EXISTS contact_email text DEFAULT 'info@manhateck.com',
ADD COLUMN IF NOT EXISTS contact_phone text DEFAULT '+447426468550',
ADD COLUMN IF NOT EXISTS contact_phone_secondary text DEFAULT '+8801839697370',
ADD COLUMN IF NOT EXISTS contact_address text DEFAULT 'Suite A, 82 James Carter Road, Mildenhall, Bury St. Edmunds, United Kingdom, IP28 7DE',
ADD COLUMN IF NOT EXISTS admin_email text DEFAULT 'mustakimchy21@gmail.com';

-- Create homepage_content table for dynamic homepage sections
CREATE TABLE public.homepage_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  title text,
  subtitle text,
  content text,
  button_text text,
  button_link text,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view homepage content" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage homepage content" ON public.homepage_content FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create services table for dynamic services
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  content text,
  icon_name text DEFAULT 'Code',
  cover_image text,
  meta_title text,
  meta_description text,
  features jsonb DEFAULT '[]'::jsonb,
  process_steps jsonb DEFAULT '[]'::jsonb,
  faqs jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create navigation_menu table for dynamic menus
CREATE TABLE public.navigation_menu (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  link text NOT NULL,
  parent_id uuid REFERENCES public.navigation_menu(id) ON DELETE CASCADE,
  location text DEFAULT 'header',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.navigation_menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active menu items" ON public.navigation_menu FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage menu items" ON public.navigation_menu FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create contact_submissions table for form submissions
CREATE TABLE public.contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text,
  service text,
  budget text,
  available_date text,
  available_time text,
  form_type text DEFAULT 'contact',
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update submissions" ON public.contact_submissions FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default homepage content
INSERT INTO public.homepage_content (section_key, title, subtitle, content, button_text, button_link) VALUES
('hero', 'Transform Your Business with Premium Solutions', 'We deliver cutting-edge digital solutions that drive growth, enhance user experience, and establish your brand as an industry leader.', NULL, 'Book a Free Consultation', '#consultation'),
('about', 'Who We Are', 'We''re a team of passionate experts dedicated to helping businesses thrive in the digital age.', 'With years of experience and a commitment to excellence, we transform ideas into impactful solutions that deliver measurable results. Our mission is simple: empower your business with innovative strategies and cutting-edge technology that drive sustainable growth.', 'Learn More', '/about'),
('cta', 'Ready to Get Started?', 'Let''s discuss how we can help transform your business and achieve your goals.', NULL, 'Book Your Free Consultation Now', '#consultation');

-- Insert default services
INSERT INTO public.services (title, slug, short_description, icon_name, sort_order) VALUES
('Web Development', 'web-development', 'Custom, scalable websites and web applications built with modern technologies to drive your business forward.', 'Code', 1),
('Digital Marketing', 'digital-marketing', 'Data-driven marketing strategies that increase your online visibility and convert visitors into customers.', 'Megaphone', 2),
('Brand Strategy', 'brand-strategy', 'Comprehensive brand development that tells your story and connects with your target audience.', 'Lightbulb', 3),
('UI/UX Design', 'uiux-design', 'Beautiful, intuitive interfaces that provide exceptional user experiences and drive engagement.', 'Palette', 4),
('SEO Services', 'seo-services', 'Proven SEO strategies to rank higher on search engines and attract more organic traffic.', 'TrendingUp', 5),
('Content Creation', 'content-creation', 'Compelling content that engages your audience and establishes your authority in your industry.', 'PenTool', 6);

-- Insert default navigation menu
INSERT INTO public.navigation_menu (title, link, location, sort_order) VALUES
('Home', '/', 'header', 1),
('About', '/about', 'header', 2),
('Services', '/services', 'header', 3),
('Blog', '/blog', 'header', 4),
('Contact', '/contact', 'header', 5);

-- Create triggers for updated_at
CREATE TRIGGER update_homepage_content_updated_at BEFORE UPDATE ON public.homepage_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_navigation_menu_updated_at BEFORE UPDATE ON public.navigation_menu FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();