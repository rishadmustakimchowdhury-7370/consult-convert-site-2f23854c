import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onConsultationClick: () => void;
}

const services = [
  { name: "Web Development", path: "/services/web-development" },
  { name: "Digital Marketing", path: "/services/digital-marketing" },
  { name: "Brand Strategy", path: "/services/brand-strategy" },
  { name: "UI/UX Design", path: "/services/uiux-design" },
  { name: "SEO Services", path: "/services/seo-services" },
  { name: "Content Creation", path: "/services/content-creation" },
];

export const Header = ({ onConsultationClick }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

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
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Agency
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-foreground"
              )}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/about") ? "text-primary" : "text-foreground"
              )}
            >
              About
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors outline-none">
                <span>Services</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover">
                <DropdownMenuItem asChild>
                  <Link to="/services" className="w-full cursor-pointer">
                    All Services
                  </Link>
                </DropdownMenuItem>
                {services.map((service) => (
                  <DropdownMenuItem key={service.path} asChild>
                    <Link to={service.path} className="w-full cursor-pointer">
                      {service.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/contact"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/contact") ? "text-primary" : "text-foreground"
              )}
            >
              Contact
            </Link>
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
          <div className="lg:hidden py-4 space-y-4 animate-fade-in">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-foreground"
              )}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive("/about") ? "text-primary" : "text-foreground"
              )}
            >
              About
            </Link>
            <Link
              to="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive("/services") ? "text-primary" : "text-foreground"
              )}
            >
              Services
            </Link>
            {services.map((service) => (
              <Link
                key={service.path}
                to={service.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 pl-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {service.name}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive("/contact") ? "text-primary" : "text-foreground"
              )}
            >
              Contact
            </Link>
            <Button
              onClick={() => {
                onConsultationClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Book Free Consultation
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
