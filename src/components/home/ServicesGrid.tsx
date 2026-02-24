import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bot, Code, Globe, Search, Shield, Layers,
  ArrowRight, ShoppingCart, Palette, Youtube, Megaphone, Video,
  Gauge, ShieldCheck, Pin, Mail, MessageCircle, Smartphone, Zap,
  Award, Star, TrendingUp, Users, Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  icon_name: string | null;
  is_featured: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot, Code, Globe, Search, Shield, Layers, ShoppingCart, Palette, Youtube,
  Megaphone, Video, Gauge, ShieldCheck, Pin, Mail, MessageCircle, Smartphone,
  Zap, Award, Star, TrendingUp, Users, Clock,
};

const fallbackServices = [
  {
    icon: Bot,
    title: "AI Agent Development",
    description: "We design and deploy intelligent AI agents that automate workflows, enhance customer interaction, streamline operations, and optimize business performance.",
    slug: "ai-agent-development",
  },
  {
    icon: Layers,
    title: "Custom SaaS Development",
    description: "Scalable SaaS platforms with multi-user dashboards, subscription models, secure authentication, and cloud-native architecture.",
    slug: "custom-saas-development",
  },
  {
    icon: Code,
    title: "Full-Stack Development Agency",
    description: "Robust frontend and backend engineering using modern frameworks for high-performance web and app solutions.",
    slug: "full-stack-development",
  },
  {
    icon: Globe,
    title: "WordPress, Shopify & Webflow Development",
    description: "Conversion-focused, SEO-optimized websites built for performance, speed, and revenue growth.",
    slug: "web-development",
  },
  {
    icon: Search,
    title: "Technical SEO & Optimization Services",
    description: "Advanced SEO strategy including technical audits, on-page optimization, site speed enhancement, and search engine ranking improvements.",
    slug: "seo-services",
  },
  {
    icon: Shield,
    title: "Penetration Testing & Vulnerability Assessment",
    description: "Enterprise-level penetration testing, vulnerability scanning, and network security analysis to protect digital infrastructure.",
    slug: "penetration-testing",
  },
];

export const ServicesGrid = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("services")
        .select("id, title, slug, short_description, icon_name, is_featured")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (data) setServices(data);
    };
    fetch();
  }, []);

  const displayServices = services.length > 0 ? services : null;

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-section-bg to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-4 mb-16"
        >
          <p className="text-primary font-semibold text-sm tracking-widest uppercase">What We Do</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Our Core <span className="gradient-text">Capabilities</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices
            ? displayServices.map((service, idx) => {
                const Icon = iconMap[service.icon_name || "Code"] || Code;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Link
                      to={`/${service.slug}`}
                      className="glass-card-hover group block p-8 h-full"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-500">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {service.short_description || "Professional digital services tailored to your needs."}
                      </p>
                      <div className="flex items-center text-primary font-medium text-sm mt-5 group-hover:translate-x-2 transition-transform duration-300">
                        Learn more <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            : fallbackServices.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <Link
                      to={`/${service.slug}`}
                      className="glass-card-hover group block p-8 h-full"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-500">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                      <div className="flex items-center text-primary font-medium text-sm mt-5 group-hover:translate-x-2 transition-transform duration-300">
                        Learn more <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
};
