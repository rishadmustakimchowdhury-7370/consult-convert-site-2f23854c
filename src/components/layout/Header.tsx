import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
}

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
    const [menuRes, settingsRes] = await Promise.all([
      supabase
        .from('navigation_menu')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('site_settings')
        .select('logo_url, site_title')
        .limit(1)
        .maybeSingle()
    ]);

    if (menuRes.data) {
      setMenuItems(menuRes.data);
    }
    if (settingsRes.data) {
      setSettings(settingsRes.data);
      // Preload the logo image before showing
      if (settingsRes.data.logo_url) {
        const img = new Image();
        img.onload = () => setLogoReady(true);
        img.onerror = () => setLogoReady(true);
        img.src = settingsRes.data.logo_url;
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
    item => (item.location === 'header' || item.location === 'both') && !item.parent_id
  );

  // Get submenu items for a parent
  const getSubItems = (parentId: string) => 
    menuItems.filter(item => item.parent_id === parentId);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group h-10">
            {!logoReady ? (
              <div className="h-10 w-32 bg-muted/50 rounded" />
            ) : settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings?.site_title || 'Logo'} className="h-10" />
            ) : (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                  <span className="text-primary-foreground font-bold text-xl">A</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Agency
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {headerParentItems.map((item) => {
              const subItems = getSubItems(item.id);
              
              if (subItems.length > 0) {
                // Item has submenu - render dropdown
                return (
                  <DropdownMenu key={item.id}>
                    <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors outline-none">
                      <span>{item.title}</span>
                      <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-popover">
                      <DropdownMenuItem asChild>
                        <Link to={item.link} className="w-full cursor-pointer">
                          All {item.title}
                        </Link>
                      </DropdownMenuItem>
                      {subItems.map((subItem) => (
                        <DropdownMenuItem key={subItem.id} asChild>
                          <Link to={subItem.link} className="w-full cursor-pointer">
                            {subItem.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              // Regular link without submenu
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive(item.link) ? "text-primary" : "text-foreground"
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
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
          <div className="lg:hidden py-4 space-y-2 animate-fade-in">
            {headerParentItems.map((item) => {
              const subItems = getSubItems(item.id);
              
              return (
                <div key={item.id}>
                  <Link
                    to={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block py-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive(item.link) ? "text-primary" : "text-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                  {/* Show submenus */}
                  {subItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 pl-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              );
            })}
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
