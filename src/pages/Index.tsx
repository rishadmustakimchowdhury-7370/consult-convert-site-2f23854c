import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Code, Megaphone, Lightbulb, Palette, TrendingUp, PenTool, CheckCircle, Users, Clock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Autoplay from "embla-carousel-autoplay";
import heroImage from "@/assets/hero-image.jpg";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  image_url: string | null;
}

const services = [
  {
    title: "Web Development",
    description: "Custom, scalable websites and web applications built with modern technologies to drive your business forward.",
    icon: Code,
    link: "/services/web-development",
  },
  {
    title: "Digital Marketing",
    description: "Data-driven marketing strategies that increase your online visibility and convert visitors into customers.",
    icon: Megaphone,
    link: "/services/digital-marketing",
  },
  {
    title: "Brand Strategy",
    description: "Comprehensive brand development that tells your story and connects with your target audience.",
    icon: Lightbulb,
    link: "/services/brand-strategy",
  },
  {
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that provide exceptional user experiences and drive engagement.",
    icon: Palette,
    link: "/services/uiux-design",
  },
  {
    title: "SEO Services",
    description: "Proven SEO strategies to rank higher on search engines and attract more organic traffic.",
    icon: TrendingUp,
    link: "/services/seo-services",
  },
  {
    title: "Content Creation",
    description: "Compelling content that engages your audience and establishes your authority in your industry.",
    icon: PenTool,
    link: "/services/content-creation",
  },
];

const whyChooseUs = [
  {
    icon: Users,
    title: "Expert Team",
    description: "Seasoned professionals with proven track records in their respective fields.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "We respect deadlines and deliver quality work exactly when we promise.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "Every project undergoes rigorous quality checks before delivery.",
  },
  {
    icon: CheckCircle,
    title: "Transparent Pricing",
    description: "Clear, upfront pricing with no hidden costs or surprise fees.",
  },
];

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, name, role, company, content, rating, image_url')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setTestimonials(data);
      }
      setIsLoading(false);
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Transform Your Business with{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Premium Solutions
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We deliver cutting-edge digital solutions that drive growth, enhance user experience, and establish your brand as an industry leader.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
                >
                  Book a Free Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-lg px-8 py-6 border-2 hover:border-primary hover:bg-primary/5"
                >
                  Explore Services
                </Button>
              </div>
            </div>
            <div className="animate-scale-in">
              <img
                src={heroImage}
                alt="Professional workspace showcasing modern digital agency environment"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">Who We Are</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're a team of passionate experts dedicated to helping businesses thrive in the digital age. With years of experience and a commitment to excellence, we transform ideas into impactful solutions that deliver measurable results.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is simple: empower your business with innovative strategies and cutting-edge technology that drive sustainable growth.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions tailored to your business needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={service.title} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-pulse text-muted-foreground">Loading testimonials...</div>
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-muted-foreground">No testimonials yet.</p>
          ) : (
            <div className="px-12">
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
                <CarouselContent className="-ml-4">
                  {testimonials.map((testimonial) => (
                    <CarouselItem 
                      key={testimonial.id} 
                      className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
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
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What sets us apart from the competition
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={item.title}
                className="text-center space-y-4 p-6 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Let's discuss how we can help transform your business and achieve your goals.
          </p>
          <Button
            size="lg"
            onClick={() => setIsDialogOpen(true)}
            className="bg-white hover:bg-white/90 text-primary text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
          >
            Book Your Free Consultation Now
          </Button>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Index;