import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowRight, CheckCircle, Phone, Code, ShoppingCart, Palette, Globe, Search, 
  Youtube, Megaphone, Video, Gauge, ShieldCheck, Pin, Mail, Bot, MessageCircle,
  Smartphone, Zap, Award, Star, TrendingUp, Users, Clock, Shield
} from "lucide-react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  content: string | null;
  cover_image: string | null;
  icon_name: string | null;
  features: Feature[];
  process_steps: ProcessStep[];
  faqs: FAQ[];
  meta_title: string | null;
  meta_description: string | null;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, ShoppingCart, Palette, Globe, Search, Youtube, Megaphone, Video, 
  Gauge, ShieldCheck, Pin, Mail, Bot, MessageCircle, Smartphone, Zap, 
  Award, Star, TrendingUp, Users, Clock, Shield
};

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        navigate('/services');
        return;
      }

      setService({
        ...data,
        features: Array.isArray(data.features) ? (data.features as unknown as Feature[]) : [],
        process_steps: Array.isArray(data.process_steps) ? (data.process_steps as unknown as ProcessStep[]) : [],
        faqs: Array.isArray(data.faqs) ? (data.faqs as unknown as FAQ[]) : [],
      });
      setIsLoading(false);

      // Update page title and meta
      if (data.meta_title) {
        document.title = data.meta_title;
      } else {
        document.title = `${data.title} | Manha Tech`;
      }
    };

    fetchService();
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  const ServiceIcon = iconMap[service.icon_name || 'Code'] || Code;

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                <ServiceIcon className="w-4 h-4" />
                Professional Service
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {service.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {service.short_description || service.content?.substring(0, 200)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl"
                >
                  Book a Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+447426468550">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Us Now
                  </a>
                </Button>
              </div>
            </div>
            {service.cover_image && (
              <div className="relative animate-scale-in">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
                <img
                  src={service.cover_image}
                  alt={service.title}
                  className="relative rounded-2xl shadow-2xl w-full h-auto object-cover aspect-video"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {service.features.length > 0 && (
        <section className="py-20 bg-section-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">What We Offer</h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive solutions tailored to your needs
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.features.map((feature, index) => {
                const FeatureIcon = iconMap[feature.icon] || CheckCircle;
                return (
                  <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                        <FeatureIcon className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      {service.process_steps.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Our Process</h2>
              <p className="text-lg text-muted-foreground">
                A streamlined approach to deliver exceptional results
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {service.process_steps.map((step, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      {index < service.process_steps.length - 1 && (
                        <div className="w-0.5 h-full bg-primary/20 my-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Let's discuss how we can help transform your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setIsDialogOpen(true)}
                className="shadow-xl"
              >
                Book a Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <a href="tel:+447426468550">
                  <Phone className="w-5 h-5 mr-2" />
                  +44 7426 468550
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      {service.faqs.length > 0 && (
        <section className="py-20 bg-section-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about our {service.title.toLowerCase()} service
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {service.faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-card rounded-xl px-6 border"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Let's Work Together
            </h2>
            <p className="text-lg text-muted-foreground">
              Contact us today to discuss your project requirements and get a free quote.
            </p>
            <Button
              size="lg"
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl"
            >
              Book a Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default ServicePage;
