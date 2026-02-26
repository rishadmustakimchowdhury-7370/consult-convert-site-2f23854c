import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  onConsultationClick: () => void;
}

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
  logo_url: string | null;
  site_title: string | null;
  site_description: string | null;
  updated_at?: string | null;
}

// Convert absolute site URLs to relative paths for client-side routing, ensure trailing slash
const toRelativeLink = (link: string): string => {
  let relative = link;
  try {
    const url = new URL(link);
    if (url.hostname === window.location.hostname || url.hostname === 'manhateck.com' || url.hostname === 'www.manhateck.com') {
      relative = url.pathname + url.search + url.hash;
    }
  } catch {
    // Already a relative path
  }
  // Ensure trailing slash (skip root and links with hash/query already)
  if (relative !== '/' && !relative.endsWith('/') && !relative.includes('?') && !relative.includes('#')) {
    relative = `${relative}/`;
  }
  return relative;
};

const withCacheBuster = (url: string, version?: string | null) => {
  const v = (version || "").trim();
  if (!v) return url;
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}v=${encodeURIComponent(v)}`;
};

// Recursive dropdown component for nested menus
const NestedDropdown = ({
  item,
  menuItems,
  depth = 0,
}: {
  item: MenuItem;
  menuItems: MenuItem[];
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const children = menuItems
    .filter((i) => i.parent_id === item.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  if (children.length === 0) {
    // Leaf node
    return (
      <Link
        to={toRelativeLink(item.link)}
        className="block px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
      >
        {item.title}
      </Link>
    );
  }

  // Node with children - show flyout submenu
  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer whitespace-nowrap">
        <Link to={toRelativeLink(item.link)} className="flex-1">
          {item.title}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 ml-2 shrink-0" />
      </div>
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 min-w-[200px] bg-popover border border-border rounded-lg shadow-xl py-1",
            depth === 0 ? "left-full top-0 -mt-1" : "left-full top-0 -mt-1"
          )}
        >
          {children.map((child) => (
            <NestedDropdown
              key={child.id}
              item={child}
              menuItems={menuItems}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Top-level dropdown for parent items with children
const TopLevelDropdown = ({
  item,
  menuItems,
}: {
  item: MenuItem;
  menuItems: MenuItem[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const children = menuItems
    .filter((i) => i.parent_id === item.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors outline-none">
        <Link to={toRelativeLink(item.link)}>{item.title}</Link>
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute z-50 left-0 top-full mt-2 min-w-[220px] bg-popover border border-border rounded-lg shadow-xl py-1">
          {children.map((child) => (
            <NestedDropdown
              key={child.id}
              item={child}
              menuItems={menuItems}
              depth={0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Mobile recursive menu
const MobileMenuItem = ({
  item,
  menuItems,
  depth,
  onClose,
}: {
  item: MenuItem;
  menuItems: MenuItem[];
  depth: number;
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const children = menuItems
    .filter((i) => i.parent_id === item.id)
    .sort((a, b) => a.sort_order - b.sort_order);
  const location = useLocation();

  return (
    <div>
      <div className="flex items-center" style={{ paddingLeft: `${depth * 16}px` }}>
        <Link
          to={toRelativeLink(item.link)}
          onClick={onClose}
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors hover:text-primary",
            location.pathname === toRelativeLink(item.link) ? "text-primary" : "text-foreground"
          )}
        >
          {item.title}
        </Link>
        {children.length > 0 && (
          <button onClick={() => setIsOpen(!isOpen)} className="p-1">
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        )}
      </div>
      {isOpen &&
        children.map((child) => (
          <MobileMenuItem
            key={child.id}
            item={child}
            menuItems={menuItems}
            depth={depth + 1}
            onClose={onClose}
          />
        ))}
    </div>
  );
};

export const Header = ({ onConsultationClick }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [logoReady, setLogoReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [menuRes, settingsRes, servicesRes] = await Promise.all([
      supabase
        .from("navigation_menu")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("site_settings")
        .select("logo_url, site_title, site_description, updated_at")
        .limit(1)
        .maybeSingle(),
      supabase
        .from("services")
        .select("title, slug, sort_order")
        .eq("is_active", true)
        .eq("status", "published")
        .order("sort_order", { ascending: true }),
    ]);

    if (menuRes.data && servicesRes.data) {
      // Find the "Services" parent menu item
      const servicesParent = menuRes.data.find(
        (item) => !item.parent_id && (item.link === '/services' || item.title.toLowerCase().includes('service'))
      );

      if (servicesParent) {
        // Remove old navigation_menu children of the services parent
        const nonServiceChildren = menuRes.data.filter(
          (item) => item.parent_id !== servicesParent.id
        );

        // Generate dynamic children from the services table
        const dynamicServiceItems: MenuItem[] = servicesRes.data.map((service, idx) => ({
          id: `dynamic-service-${service.slug}`,
          title: service.title,
          link: `/services/${service.slug}/`,
          location: servicesParent.location || 'header',
          parent_id: servicesParent.id,
          sort_order: service.sort_order ?? idx,
          is_active: true,
        }));

        setMenuItems([...nonServiceChildren, ...dynamicServiceItems]);
      } else {
        setMenuItems(menuRes.data);
      }
    } else if (menuRes.data) {
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

  const isActive = (path: string) => location.pathname === path;

  // Filter header menu items (parent items only)
  const headerParentItems = menuItems.filter(
    (item) =>
      (item.location === "header" || item.location === "both") && !item.parent_id
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-xl shadow-lg border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Branding */}
          <Link to="/" className="flex items-center gap-4 group shrink-0">
            {!logoReady ? (
              <div className="h-12 w-12 bg-muted/50 rounded-lg animate-pulse" />
            ) : settings?.logo_url ? (
              <div className="relative">
                <img
                  src={withCacheBuster(settings.logo_url, settings.updated_at)}
                  alt={settings?.site_title || "Logo"}
                  className="h-11 md:h-12 w-auto object-contain drop-shadow-[0_0_8px_hsl(210_100%_55%/0.4)]"
                />
              </div>
            ) : (
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-neon">
                <span className="text-primary-foreground font-bold text-xl">M</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-extrabold tracking-wide text-foreground uppercase leading-tight">
                {settings?.site_title || "ManhaTeck"}
              </span>
              <span className="text-[10px] md:text-xs font-medium tracking-widest text-primary/80 uppercase leading-tight">
                {settings?.site_description ? settings.site_description.substring(0, 40) : "Cybersecurity & Digital Solutions"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {headerParentItems.map((item) => {
              const children = menuItems.filter((i) => i.parent_id === item.id);

              if (children.length > 0) {
                return (
                  <TopLevelDropdown
                    key={item.id}
                    item={item}
                    menuItems={menuItems}
                  />
                );
              }

              return (
                <Link
                  key={item.id}
                  to={toRelativeLink(item.link)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive(toRelativeLink(item.link)) ? "text-primary" : "text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              onClick={onConsultationClick}
              className="btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
            >
              Book Free Consultation
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-secondary rounded-md transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 animate-fade-in">
            {headerParentItems.map((item) => (
              <MobileMenuItem
                key={item.id}
                item={item}
                menuItems={menuItems}
                depth={0}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            ))}
            <Button
              onClick={() => {
                onConsultationClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-4"
            >
              Book Free Consultation
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
