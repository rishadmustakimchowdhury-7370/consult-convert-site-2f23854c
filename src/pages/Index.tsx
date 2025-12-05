import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Code, Megaphone, Lightbulb, Palette, TrendingUp, PenTool, 
  CheckCircle, Users, Clock, Shield, ShoppingCart, Search, 
  Smartphone, Zap, Award, Globe, ArrowRight, Star, Youtube,
  Video, Gauge, ShieldCheck, Pin, Mail, Bot, MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Autoplay from "embla-carousel-autoplay";
import ecommerceHero from "@/assets/ecommerce-hero.jpg";
import wordpressDesign from "@/assets/wordpress-design.jpg";
import seoServices from "@/assets/seo-services.jpg";
import smallBusinessSuccess from "@/assets/small-business-success.jpg";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  image_url: string | null;
}

const whyChooseFeatures = [
  {
    icon: Code,
    title: "Expertise in Web Design & Development Service",
    description: "Years of experience in creating visually stunning and highly functional ecommerce platforms that perform exceptionally.",
  },
  {
    icon: Palette,
    title: "Specialized WordPress Website Design Services",
    description: "Bespoke WordPress solutions with custom plugins and feature-rich designs that stand out in the digital marketplace.",
  },
  {
    icon: Users,
    title: "Professional Services for Enhanced User Experience",
    description: "Fast-loading pages, intuitive navigation, and responsive design to keep customers engaged and returning.",
  },
  {
    icon: Shield,
    title: "Cost-Effective Small Business Website Design Services",
    description: "Budget-friendly solutions perfect for smaller enterprises looking to carve out a strong digital presence.",
  },
];

const keyFeatures = [
  {
    icon: Globe,
    title: "Comprehensive Website Design and Development",
    description: "End-to-end solutions covering every stage from initial concept to execution, adaptable for all industries.",
    image: wordpressDesign,
  },
  {
    icon: Search,
    title: "Integrated Website Design and SEO Services",
    description: "Built-in SEO strategies ensuring your site ranks well and drives organic traffic from UK customers.",
    image: seoServices,
  },
  {
    icon: Award,
    title: "Affordable and High-Quality Deliverables",
    description: "Exceptional value without cutting corners—impressive returns on investment for UK clients.",
    image: smallBusinessSuccess,
  },
];

const benefits = [
  {
    icon: ShoppingCart,
    title: "Drive Sales and Revenue",
    description: "A well-optimized ecommerce website significantly improves conversion rates, turning visitors into loyal customers.",
  },
  {
    icon: Star,
    title: "Enhance Brand Identity",
    description: "Custom designs that align with and enhance your business identity through colors, typography, and premium elements.",
  },
  {
    icon: TrendingUp,
    title: "Ensure SEO and Growth Potential",
    description: "On-page optimization, mobile responsiveness, and strategic keyword placement for maximum visibility.",
  },
];

const faqs = [
  {
    question: "What Is Included in Ecommerce Website Design?",
    answer: "Our services include end-to-end solutions such as web design, development, SEO, mobile optimization, and ongoing support. Each aspect is carefully tailored to your business goals.",
  },
  {
    question: "How Much Does an Ecommerce Website Cost?",
    answer: "The cost depends on factors like size, complexity, and features required. At Manha Tech, we specialize in affordable website design services without compromising quality, making it easier for businesses of all sizes to invest in their online future.",
  },
  {
    question: "How Long Does It Take to Develop an Ecommerce Website?",
    answer: "Project timelines can vary based on your website's complexity. However, you can typically expect delivery within 4-8 weeks for most ecommerce projects.",
  },
  {
    question: "Do You Offer Support and Maintenance Services?",
    answer: "Yes, we provide ongoing support and maintenance to ensure your website runs smoothly, including updates, performance checks, and technical assistance.",
  },
];

const ukBusinessReasons = [
  {
    icon: Smartphone,
    title: "Adapt to Changing Consumer Trends",
    description: "More UK consumers are shopping online than ever before. Stay ahead of growing consumer demand.",
  },
  {
    icon: Zap,
    title: "Stay Competitive in a Digitally Driven Market",
    description: "A standout ecommerce site makes all the difference in capturing market share in the competitive online marketplace.",
  },
];

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data: testimonialData } = await supabase
        .from('testimonials')
        .select('id, name, role, company, content, rating, image_url')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (testimonialData) {
        setTestimonials(testimonialData);
      }
      setIsLoading(false);
    };
    
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                <ShoppingCart className="w-4 h-4" />
                Professional Ecommerce Solutions
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Ecommerce Website Design Services -{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Manha Tech
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Drive your business forward with bespoke ecommerce website design services in the UK. Today, having a robust online store is no longer optional—it's a critical factor in staying competitive, boosting customer engagement, and driving sales.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                At Manha Tech, we specialize in designing ecommerce websites tailored to businesses of all sizes—from startups to established enterprises. Our commitment to excellence, coupled with cost-effective solutions, makes us the ideal partner for both small businesses and larger corporations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all group"
                >
                  Book a Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('why-choose')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-lg px-8 py-6 border-2 hover:border-primary hover:bg-primary/5"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="animate-scale-in relative flex items-center justify-center">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
              <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                <img
                  src={ecommerceHero}
                  alt="Ecommerce Website Design Services - Professional online store interface showcasing modern web design"
                  className="relative rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
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
              Our Services
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Comprehensive Digital Solutions for Your Business
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From web development to digital marketing, we offer end-to-end services to help your business thrive in the digital landscape.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                icon: Code,
                title: "WordPress Web Design",
                description: "Custom WordPress websites with stunning designs, powerful functionality, and easy content management.",
                link: "/services/web-development"
              },
              {
                icon: ShoppingCart,
                title: "Shopify Web Design",
                description: "Professional Shopify stores optimized for conversions, seamless checkout, and brand consistency.",
                link: "/services/web-development"
              },
              {
                icon: Palette,
                title: "Wix Web Design",
                description: "Beautiful, responsive Wix websites that are easy to maintain and perfect for growing businesses.",
                link: "/services/web-development"
              },
              {
                icon: Globe,
                title: "Webflow Design & Development",
                description: "Cutting-edge Webflow sites with advanced animations, interactions, and CMS capabilities.",
                link: "/services/web-development"
              },
              {
                icon: Search,
                title: "Affordable Local SEO",
                description: "Dominate local search results with targeted SEO strategies that bring customers to your door.",
                link: "/services/seo-services"
              },
              {
                icon: Youtube,
                title: "YouTube SEO Agency",
                description: "Optimize your videos for maximum visibility, engagement, and subscriber growth on YouTube.",
                link: "/services/seo-services"
              },
              {
                icon: Megaphone,
                title: "Google Ads Management",
                description: "Expert Google Ads campaigns that maximize ROI and drive qualified traffic to your business.",
                link: "/services/digital-marketing"
              },
              {
                icon: Video,
                title: "Video Editing",
                description: "Professional video editing services that transform raw footage into compelling visual stories.",
                link: "/services/content-creation"
              },
              {
                icon: Gauge,
                title: "Website Speed Optimization",
                description: "Boost your site performance with expert speed optimization for better UX and SEO rankings.",
                link: "/services/web-development"
              },
              {
                icon: ShieldCheck,
                title: "WordPress Malware Removal",
                description: "Complete malware cleanup and security hardening to protect your WordPress site from threats.",
                link: "/services/web-development"
              },
              {
                icon: Pin,
                title: "Pinterest Marketing",
                description: "Strategic Pinterest campaigns that drive traffic, increase brand awareness, and boost sales.",
                link: "/services/digital-marketing"
              },
              {
                icon: Mail,
                title: "Email Marketing Automation",
                description: "Automated email campaigns that nurture leads, drive conversions, and build customer loyalty.",
                link: "/services/digital-marketing"
              },
              {
                icon: Bot,
                title: "AI Automation Agent",
                description: "Intelligent AI agents that automate workflows, save time, and streamline business operations.",
                link: "/services/brand-strategy"
              },
              {
                icon: MessageCircle,
                title: "AI Chatbot Solutions",
                description: "Custom AI chatbots that provide 24/7 customer support and enhance user engagement.",
                link: "/services/brand-strategy"
              }
            ].map((service, index) => (
              <a
                key={service.title}
                href={service.link}
                className="group block p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 animate-fade-in-up relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <service.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                  <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
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

      {/* Why Choose Manha Tech Section */}
      <section id="why-choose" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Why Choose Manha Tech for Ecommerce Website Design?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We bring years of experience, cutting-edge technology, and a passion for excellence to every project.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {whyChooseFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Key Features of Our Ecommerce Website Design Services
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Comprehensive solutions that drive results for your online business
            </p>
          </div>
          <div className="space-y-16 lg:space-y-24">
            {keyFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">{feature.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    variant="outline"
                    className="group"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl"></div>
                  <img
                    src={feature.image}
                    alt={`Ecommerce Website Design Services - ${feature.title}`}
                    className="relative rounded-xl shadow-xl w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Benefits of Our Ecommerce Website Design Services
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transform your online presence and drive measurable business growth
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="group text-center p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <benefit.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              FAQs About Ecommerce Website Design Services
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Get answers to your most common questions
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

      {/* Why Essential for UK Businesses */}
      <section className="py-20 md:py-28 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Why Ecommerce Website Design Is Essential for UK Businesses
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ecommerce has surged in popularity, with more consumers in the UK shopping online than ever before.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {ukBusinessReasons.map((reason, index) => (
              <div
                key={reason.title}
                className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <reason.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Star className="w-4 h-4 fill-primary" />
              Client Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              What Our Clients Say About Our
              <span className="block text-primary mt-2">Ecommerce Website Design Services</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it—discover how UK businesses have transformed their online presence with our professional ecommerce solutions
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
              
              {/* Carousel indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.min(4, Math.ceil(testimonials.length / 4)) }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary/30 hover:bg-primary transition-colors cursor-pointer"></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-accent relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-full text-white/95 text-sm font-medium border border-white/20">
                <Award className="w-4 h-4" />
                Over a Decade of Excellence
              </div>
            </div>
            
            {/* Main heading */}
            <div className="text-center space-y-6 mb-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Get Started with Manha Tech Today
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Whether you're a small business or an established enterprise, Manha Tech is here to help you succeed. Our ecommerce website design services are designed to meet your unique needs, ensuring complete customer satisfaction.
              </p>
            </div>
            
            {/* CTA Button */}
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
            
            {/* Trust indicators */}
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
