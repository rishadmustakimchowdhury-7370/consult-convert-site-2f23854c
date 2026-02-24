import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Code, ShoppingCart, Palette, Globe, Search, Youtube, Megaphone, Video, Gauge, ShieldCheck, Pin, Mail, Bot, MessageCircle, Smartphone, Zap, Award, Star, TrendingUp, Users, Clock, Shield, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Code, ShoppingCart, Palette, Globe, Search, Youtube, Megaphone, Video, Gauge, ShieldCheck, Pin, Mail, Bot, MessageCircle, Smartphone, Zap, Award, Star, TrendingUp, Users, Clock, Shield,
};

const Services = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ['public-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('title, slug, short_description, icon_name, cover_image')
        .eq('is_active', true)
        .eq('status', 'published')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold">Our Services</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Comprehensive digital solutions designed to help your business thrive in the modern marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(services || []).map((service, index) => {
                const Icon = iconMap[service.icon_name || 'Code'] || Code;
                return (
                  <Link
                    key={service.slug}
                    to={`/service/${service.slug}`}
                    className="block group animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary/50 bg-card">
                      <CardHeader className="space-y-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                          <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed line-clamp-3 break-words overflow-hidden">
                          {service.short_description || ''}
                        </CardDescription>
                        <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-2 transition-transform">
                          Learn more
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold">Not Sure Which Service You Need?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's discuss your goals and find the perfect solution for your business.
          </p>
          <Button
            size="lg"
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-xl"
          >
            Schedule a Free Consultation
          </Button>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Services;