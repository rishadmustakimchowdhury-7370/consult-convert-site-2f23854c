import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Linkedin, Instagram, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: string;
  title: string;
  link: string;
  location: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
}

interface SiteSettings {
  site_title: string | null;
  site_description: string | null;
  logo_url: string | null;
  updated_at?: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_phone_secondary: string | null;
  contact_address: string | null;
  whatsapp_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
}

const withCacheBuster = (url: string, version?: string | null) => {
  const v = (version || "").trim();
  if (!v) return url;
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}v=${encodeURIComponent(v)}`;
};

const toWhatsAppHref = (value?: string | null, fallbackPhone?: string | null) => {
  const v = (value || "").trim();
  if (v) {
    if (v.startsWith("http://") || v.startsWith("https://")) return v;
    const phone = v.replace(/[^0-9]/g, "");
    if (phone) return `https://wa.me/${phone}`;
  }
  const phone = (fallbackPhone || "447426468550").replace(/[^0-9]/g, "");
  return `https://wa.me/${phone}`;
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [menuRes, settingsRes] = await Promise.all([
      supabase
        .from("navigation_menu")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("site_settings")
        .select(
          "site_title, site_description, logo_url, updated_at, contact_email, contact_phone, contact_phone_secondary, contact_address, whatsapp_url, facebook_url, linkedin_url, instagram_url"
        )
        .limit(1)
        .maybeSingle(),
    ]);

    if (menuRes.data) {
      setMenuItems(menuRes.data);
    }

    if (settingsRes.data) {
      const nextSettings = settingsRes.data;
      setSettings(nextSettings);

      const nextLogoSrc = nextSettings.logo_url
        ? withCacheBuster(nextSettings.logo_url, nextSettings.updated_at)
        : null;

      if (nextLogoSrc) {
        setLogoReady(false);
        const img = new Image();
        img.onload = () => setLogoReady(true);
        img.onerror = () => setLogoReady(true);
        img.src = nextLogoSrc;
      } else {
        setLogoReady(true);
      }
    } else {
      setLogoReady(true);
    }
  };

  // Filter footer menu items (parent items only that show in footer or both)
  const footerMenuItems = menuItems.filter(
    item => (item.location === 'footer' || item.location === 'both') && !item.parent_id
  );

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group h-10">
              {!logoReady ? (
                <div className="h-10 w-32 bg-background/20 rounded" />
              ) : settings?.logo_url ? (
                <img
                  src={withCacheBuster(settings.logo_url, settings.updated_at)}
                  alt={settings?.site_title || "Logo"}
                  className="h-10"
                />
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                    <span className="text-primary-foreground font-bold text-xl">M</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {settings?.site_title || "Manhateck"}
                  </span>
                </>
              )}
            </Link>
            <p className="text-sm text-background/80">
              {settings?.site_description || 'Delivering premium digital solutions that transform your business and drive real results.'}
            </p>
            <div className="flex space-x-4">
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.whatsapp_url && (
                <a
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(settings.whatsapp_url!, "_blank", "noopener,noreferrer");
                  }}
                  className="w-10 h-10 bg-background/10 hover:bg-[#25D366] rounded-full flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {/* Fallback social icons if none configured */}
              {!settings?.facebook_url && !settings?.linkedin_url && !settings?.instagram_url && !settings?.whatsapp_url && (
                <>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={toWhatsAppHref(null, settings?.contact_phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(toWhatsAppHref(null, settings?.contact_phone), "_blank", "noopener,noreferrer");
                    }}
                    className="w-10 h-10 bg-background/10 hover:bg-[#25D366] rounded-full flex items-center justify-center transition-colors"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links - Dynamic from database */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerMenuItems.length > 0 ? (
                footerMenuItems.map((item) => (
                  <li key={item.id}>
                    {item.link.startsWith('http') ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-background/80 hover:text-background transition-colors"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <Link
                        to={item.link}
                        className="text-sm text-background/80 hover:text-background transition-colors"
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))
              ) : (
                // Fallback links if no menu items configured
                <>
                  <li>
                    <Link to="/" className="text-sm text-background/80 hover:text-background transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-sm text-background/80 hover:text-background transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/services" className="text-sm text-background/80 hover:text-background transition-colors">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="text-sm text-background/80 hover:text-background transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-sm text-background/80 hover:text-background transition-colors">
                      Contact
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services/web-development"
                  className="text-sm text-background/80 hover:text-background transition-colors"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services/digital-marketing"
                  className="text-sm text-background/80 hover:text-background transition-colors"
                >
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link
                  to="/services/uiux-design"
                  className="text-sm text-background/80 hover:text-background transition-colors"
                >
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link
                  to="/services/seo-services"
                  className="text-sm text-background/80 hover:text-background transition-colors"
                >
                  SEO Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-background/80">
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${settings?.contact_email || 'info@manhateck.com'}`} className="hover:text-background transition-colors">
                  {settings?.contact_email || 'info@manhateck.com'}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <a href={`tel:${settings?.contact_phone || '+447426468550'}`} className="hover:text-background transition-colors block">
                    {settings?.contact_phone || '+44 742 646 8550'}
                  </a>
                  {(settings?.contact_phone_secondary || !settings) && (
                    <a href={`tel:${settings?.contact_phone_secondary || '+8801839697370'}`} className="hover:text-background transition-colors block">
                      {settings?.contact_phone_secondary || '+880 183 969 7370'}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a
                  href={toWhatsAppHref(settings?.whatsapp_url, settings?.contact_phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      toWhatsAppHref(settings?.whatsapp_url, settings?.contact_phone),
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="hover:text-background transition-colors"
                >
                  WhatsApp: {settings?.contact_phone || '+44 742 646 8550'}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {settings?.contact_address ? (
                    settings.contact_address.split(',').map((part, idx) => (
                      <span key={idx}>{part.trim()}{idx < settings.contact_address!.split(',').length - 1 && <br />}</span>
                    ))
                  ) : (
                    <>
                      Suite A, 82 James Carter Road<br />
                      Mildenhall, Bury St. Edmunds<br />
                      United Kingdom, IP28 7DE
                    </>
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-background/60">
            © {currentYear} {settings?.site_title || 'Manhateck'}. All rights reserved.
          </p>
          <Link
            to="/privacy-policy"
            className="text-sm text-background/60 hover:text-background transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};
