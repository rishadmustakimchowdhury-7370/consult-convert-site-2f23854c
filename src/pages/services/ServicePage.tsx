import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import Autoplay from "embla-carousel-autoplay";
import { 
  ArrowRight, CheckCircle, Phone, Code, ShoppingCart, Palette, Globe, Search, 
  Youtube, Megaphone, Video, Gauge, ShieldCheck, Pin, Mail, Bot, MessageCircle,
  Smartphone, Zap, Award, Star, TrendingUp, Users, Clock, Shield, MapPin
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
  canonical_url: string | null;
}

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  image_url: string | null;
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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      const [serviceRes, testimonialsRes] = await Promise.all([
        supabase
          .from('services')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle(),
        supabase
          .from('testimonials')
          .select('id, name, role, company, content, rating, image_url')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      if (serviceRes.error || !serviceRes.data) {
        navigate('/services');
        return;
      }

      setService({
        ...serviceRes.data,
        features: Array.isArray(serviceRes.data.features) ? (serviceRes.data.features as unknown as Feature[]) : [],
        process_steps: Array.isArray(serviceRes.data.process_steps) ? (serviceRes.data.process_steps as unknown as ProcessStep[]) : [],
        faqs: Array.isArray(serviceRes.data.faqs) ? (serviceRes.data.faqs as unknown as FAQ[]) : [],
        canonical_url: (serviceRes.data as any).canonical_url || null,
      });
      
      if (testimonialsRes.data) {
        setTestimonials(testimonialsRes.data);
      }
      
      setIsLoading(false);

      // Update page title and meta
      if (serviceRes.data.meta_title) {
        document.title = serviceRes.data.meta_title;
      } else {
        document.title = `${serviceRes.data.title} | Manha Tech`;
      }
    };

    fetchData();
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
      <SEOHead
        title={service.meta_title || `${service.title} | Manha Teck`}
        description={service.meta_description || service.short_description || undefined}
        canonicalOverride={service.canonical_url}
      />
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

      {/* Rich Content Section */}
      {service.content && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-bold prose-h3:text-xl prose-h3:font-semibold prose-h4:text-lg prose-h4:font-semibold prose-h5:text-base prose-h5:font-medium prose-h6:text-sm prose-h6:font-medium prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: service.content }}
              />
            </div>
          </div>
        </section>
      )}

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

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-section-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">What Our Clients Say</h2>
              <p className="text-lg text-muted-foreground">
                Don't just take our word for it - hear from our satisfied clients
              </p>
            </div>
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <TestimonialCard
                      name={testimonial.name}
                      role={testimonial.role || ''}
                      content={testimonial.content}
                      rating={testimonial.rating || 5}
                      image_url={testimonial.image_url}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
            </Carousel>
          </div>
        </section>
      )}

      {/* Location Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Visit Our Office</h2>
              <p className="text-lg text-muted-foreground">
                We'd love to meet you in person. Come visit us at our office or get in touch to schedule a meeting.
              </p>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Our Address</h3>
                  <p className="text-muted-foreground">
                    Suite A, 82 James Carter Road<br />
                    Mildenhall, Bury St. Edmunds<br />
                    United Kingdom, IP28 7DE
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2435.866684067!2d0.5066!3d52.3167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d85f9b5c1234567%3A0x1234567890abcdef!2s82%20James%20Carter%20Rd%2C%20Mildenhall%2C%20Bury%20Saint%20Edmunds%20IP28%207DE%2C%20UK!5e0!3m2!1sen!2suk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Manha Tech Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default ServicePage;
