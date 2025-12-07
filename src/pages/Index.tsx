import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { TestimonialCard } from "@/components/TestimonialCard";
import { ProjectsSection } from "@/components/ProjectsSection";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Code, Megaphone, Lightbulb, Palette, TrendingUp, PenTool, 
  CheckCircle, Users, Clock, Shield, ShoppingCart, Search, 
  Smartphone, Zap, Award, Globe, ArrowRight, Star, Youtube,
  Video, Gauge, ShieldCheck, Pin, Mail, Bot, MessageCircle,
  Rocket, Target, HeadphonesIcon, Building2, GraduationCap, 
  Stethoscope, Home, Wrench, Briefcase
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Autoplay from "embla-carousel-autoplay";
import manhateckHero from "@/assets/manhateck-hero.jpg";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  image_url: string | null;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  icon_name: string | null;
  is_featured: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, ShoppingCart, Palette, Globe, Search, Youtube, Megaphone, Video, 
  Gauge, ShieldCheck, Pin, Mail, Bot, MessageCircle, Smartphone, Zap, 
  Award, Star, TrendingUp, Users, Clock, Shield, Rocket, Target, 
  HeadphonesIcon, Building2, GraduationCap, Stethoscope, Home, Wrench, Briefcase
};

const whyChooseFeatures = [
  {
    icon: Rocket,
    title: "Fast Delivery Without Compromising Quality",
    description: "We deliver projects on time while maintaining the highest standards of quality and attention to detail.",
  },
  {
    icon: TrendingUp,
    title: "Proven Results with Measurable Growth",
    description: "Our strategies are data-driven, ensuring you see real, trackable improvements in your business metrics.",
  },
  {
    icon: Target,
    title: "UK-Focused Digital Strategies",
    description: "We understand the UK market and create strategies specifically designed for local business success.",
  },
  {
    icon: Bot,
    title: "AI-Driven Optimization",
    description: "Leverage cutting-edge AI technology for websites, SEO, and marketing automation.",
  },
  {
    icon: Shield,
    title: "Affordable Packages for All Sizes",
    description: "Budget-friendly solutions perfect for startups to established enterprises looking to grow.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support for Ongoing Growth",
    description: "Continuous support and optimization to ensure your digital presence keeps evolving.",
  },
];

const processSteps = [
  {
    step: 1,
    title: "Discovery & Strategy",
    description: "We understand your business goals, target audience, and vision.",
    icon: Lightbulb,
  },
  {
    step: 2,
    title: "Design & Development",
    description: "We create visually stunning, high-performance websites.",
    icon: Palette,
  },
  {
    step: 3,
    title: "SEO, Marketing & AI Integration",
    description: "We optimize your website, run digital campaigns, and automate workflows.",
    icon: Search,
  },
  {
    step: 4,
    title: "Testing & Launch",
    description: "Comprehensive testing for speed, performance, and mobile readiness.",
    icon: Rocket,
  },
  {
    step: 5,
    title: "Support & Optimization",
    description: "Ongoing monitoring, updates, and optimization to ensure growth.",
    icon: HeadphonesIcon,
  },
];

const industries = [
  { icon: Briefcase, title: "Small Businesses & Startups" },
  { icon: ShoppingCart, title: "Ecommerce Stores" },
  { icon: Building2, title: "Real Estate & Construction" },
  { icon: Stethoscope, title: "Healthcare & Medical" },
  { icon: GraduationCap, title: "Education & Online Coaching" },
  { icon: Wrench, title: "Local Service Providers" },
];

const faqs = [
  {
    question: "What services does Manhateck provide in the UK?",
    answer: "We offer website design, SEO, digital marketing, Google Ads, and AI automation services tailored for UK businesses.",
  },
  {
    question: "How much does a website cost in the UK?",
    answer: "Costs vary based on features, platform, and complexity. Simple sites start affordably, while custom solutions are priced per project. Contact us for a free quote.",
  },
  {
    question: "Do you offer SEO with website design?",
    answer: "Yes! We provide combined packages for faster rankings and better ROI. All our websites are built with SEO best practices from the ground up.",
  },
  {
    question: "What is AI automation, and how can it help?",
    answer: "AI automates repetitive tasks such as CRM, lead generation, and customer support, saving time and increasing efficiency for your business.",
  },
  {
    question: "How long does it take to build a website?",
    answer: "Typically 7–21 days depending on the project scope. We'll provide a clear timeline during your free consultation.",
  },
];

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [testimonialsRes, servicesRes] = await Promise.all([
        supabase
          .from('testimonials')
          .select('id, name, role, company, content, rating, image_url')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('services')
          .select('id, title, slug, short_description, icon_name, is_featured')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
      ]);
      
      if (testimonialsRes.data) {
        setTestimonials(testimonialsRes.data);
      }
      if (servicesRes.data) {
        setServices(servicesRes.data);
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Professional Website Design, SEO & AI Services UK | Manhateck</title>
        <meta name="description" content="UK-based Manhateck offers website design, SEO, digital marketing, and AI automation services to grow your business efficiently." />
        <meta name="keywords" content="Professional Website Design UK, SEO Services UK, AI Automation UK, Digital Marketing UK, Manhateck" />
        <link rel="canonical" href="https://manhateck.com" />
      </Helmet>
      
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/8"></div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/8 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Content - Takes 5 columns on large screens */}
            <div className="lg:col-span-5 space-y-6 animate-fade-in-up order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                <Rocket className="w-4 h-4" />
                Transform Your Business with Manhateck
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Professional Website Design, SEO & AI Automation Services in the{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  UK
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Welcome to Manhateck, your trusted UK partner for Website Design, SEO, Digital Marketing, and AI Automation Services. We help businesses of all sizes create a strong online presence, attract more customers, and grow efficiently.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Whether you need a WordPress website, Shopify ecommerce store, local SEO, digital marketing, or AI-powered automation, Manhateck delivers solutions tailored for business success in the UK.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-xl hover:shadow-2xl transition-all group"
                >
                  Book a Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('why-choose')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 border-2 hover:border-primary hover:bg-primary/5"
                >
                  Learn More
                </Button>
              </div>
            </div>
            {/* Image - Takes 7 columns on large screens for larger display */}
            <div className="lg:col-span-7 animate-scale-in relative order-1 lg:order-2">
              <div className="absolute -inset-6 bg-gradient-to-r from-primary/25 to-accent/25 rounded-3xl blur-3xl opacity-60"></div>
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/15 via-transparent to-accent/15 rounded-3xl"></div>
              <div className="relative">
                <img
                  src={manhateckHero}
                  alt="Professional Website Design, SEO & AI Automation Services"
                  className="relative rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[16/10] ring-1 ring-primary/10"
                />
                {/* Floating badges for credibility */}
                <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-background/95 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-xl border border-border/50 animate-fade-in-up">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-foreground">100+ Projects</p>
                      <p className="text-xs text-muted-foreground">Delivered Successfully</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-background/95 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-xl border border-border/50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Star className="w-5 h-5 md:w-6 md:h-6 text-accent fill-accent" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-foreground">5-Star Rated</p>
                      <p className="text-xs text-muted-foreground">UK Agency</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4">
          <p className="text-center text-xl md:text-2xl lg:text-3xl font-semibold text-primary-foreground max-w-4xl mx-auto leading-relaxed">
            We don't just build websites — we create digital ecosystems that attract customers, generate leads, and automate workflows.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-28 bg-section-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              Our Core Services
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Comprehensive Digital Solutions for UK Businesses
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From web development to AI automation, we offer end-to-end services to help your business thrive in the digital landscape.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => {
              const ServiceIcon = iconMap[service.icon_name || 'Code'] || Code;
              return (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="group block p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 animate-fade-in-up relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <ServiceIcon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{service.short_description || 'Professional digital services tailored to your needs.'}</p>
                    <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
            {services.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No services available yet. Add services from the admin dashboard.
              </div>
            )}
          </div>
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">Need a custom solution tailored to your specific needs?</p>
            <Button
              size="lg"
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all group"
            >
              Get a Custom Quote
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why UK Businesses Choose Manhateck Section */}
      <section id="why-choose" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Award className="w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Why UK Businesses Choose Manhateck
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We combine creativity, technology, and automation to deliver high-impact digital solutions that help UK businesses stay ahead.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Section - Creative Design */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-background via-primary/5 to-accent/5 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 backdrop-blur-sm rounded-full text-primary text-sm font-semibold border border-primary/20">
              <Target className="w-4 h-4" />
              Our Process
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
              How Manhateck Works
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              A proven 5-step process designed to transform your digital presence and accelerate business growth
            </p>
          </div>

          {/* Process Steps - Horizontal Flow */}
          <div className="max-w-7xl mx-auto">
            {/* Desktop: Horizontal connected cards */}
            <div className="hidden lg:block relative">
              {/* Connecting line */}
              <div className="absolute top-[72px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-30"></div>
              
              <div className="grid grid-cols-5 gap-4">
                {processSteps.map((step, index) => (
                  <div
                    key={step.step}
                    className="group relative animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Step number circle */}
                    <div className="relative z-10 mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl font-bold text-primary-foreground">{step.step}</span>
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-0 group-hover:opacity-75"></div>
                    </div>
                    
                    {/* Card */}
                    <div className="relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group-hover:-translate-y-2 h-full">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                          <step.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tablet/Mobile: Vertical timeline */}
            <div className="lg:hidden space-y-6">
              {processSteps.map((step, index) => (
                <div
                  key={step.step}
                  className="group flex gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Left side: Step number & line */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl font-bold text-primary-foreground">{step.step}</span>
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="w-0.5 flex-1 my-3 bg-gradient-to-b from-primary to-accent/30 rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Right side: Content card */}
                  <div className="flex-1 pb-6">
                    <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <step.icon className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Button
              size="lg"
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all group px-8 py-6 text-lg"
            >
              Start Your Journey Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Globe className="w-4 h-4" />
              Industries We Serve
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Industries We Serve Across the UK
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We work with businesses across various sectors, delivering tailored digital solutions
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry, index) => (
              <div
                key={industry.title}
                className="group p-6 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <industry.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{industry.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 md:py-28 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <MessageCircle className="w-4 h-4" />
              FAQs
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Get answers to your most common questions about our services
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border-2 border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Star className="w-4 h-4 fill-primary" />
              Client Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              What Our Clients Say About
              <span className="block text-primary mt-2">Manhateck's Digital Services</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it — discover how UK businesses have transformed their online presence with our professional solutions
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                Loading testimonials...
              </div>
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No testimonials yet.</p>
          ) : (
            <div className="px-4 md:px-16">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 4000,
                    stopOnInteraction: false,
                    stopOnMouseEnter: true,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent className="-ml-6">
                  {testimonials.map((testimonial) => (
                    <CarouselItem 
                      key={testimonial.id} 
                      className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <TestimonialCard
                        name={testimonial.name}
                        role={testimonial.role || undefined}
                        company={testimonial.company || undefined}
                        content={testimonial.content}
                        rating={testimonial.rating || 5}
                        image_url={testimonial.image_url}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4 lg:-left-8 bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg" />
                <CarouselNext className="hidden md:flex -right-4 lg:-right-8 bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg" />
              </Carousel>
              
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.min(4, Math.ceil(testimonials.length / 4)) }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary/30 hover:bg-primary transition-colors cursor-pointer"></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <ProjectsSection />

      {/* Final CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-full text-white/95 text-sm font-medium border border-white/20">
                <Rocket className="w-4 h-4" />
                Ready to Transform Your Business?
              </div>
            </div>
            
            <div className="text-center space-y-6 mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Get Started with Manhateck Today
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Whether you're a small business or an established enterprise, Manhateck is here to help you succeed with website design, SEO, and AI automation services tailored for UK businesses.
              </p>
            </div>
            
            <div className="flex justify-center mb-12">
              <Button
                size="lg"
                onClick={() => setIsDialogOpen(true)}
                className="bg-white hover:bg-white/95 text-primary text-lg font-semibold px-10 py-7 rounded-xl shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 group"
              >
                Book Your Free Consultation Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10+</div>
                <div className="text-sm text-white/80 font-medium">Years Experience</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-sm text-white/80 font-medium">Projects Delivered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-sm text-white/80 font-medium">Client Satisfaction</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-white/80 font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppChat phoneNumber="+447426468550" />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Index;
