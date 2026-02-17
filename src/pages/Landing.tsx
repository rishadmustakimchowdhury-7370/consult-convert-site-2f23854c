import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { MathChallenge } from '@/components/MathChallenge';
import { WhatsAppChat } from '@/components/WhatsAppChat';
import {
  ArrowRight, Bot, Shield, Code, Search, Zap, Cloud, Lock,
  BarChart3, Globe, Cpu, ShoppingCart, Palette, Megaphone,
  Star, Quote, MessageCircle, Phone, Mail, ChevronRight,
  Layers, Target, TrendingUp, Network
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  icon_name: string | null;
}

interface SiteSettings {
  logo_url: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  whatsapp_url: string | null;
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
  Code, ShoppingCart, Palette, Globe, Search, Megaphone, Bot, Shield, Lock, Network, Cpu, BarChart3
};

const fallbackServices = [
  {
    id: "s1",
    title: "AI Agent Development",
    slug: "ai-agent-development",
    short_description: "Custom AI agents that automate workflows, optimize operations, enhance customer interaction, and streamline business processes using advanced AI technologies.",
    icon_name: "Bot",
  },
  {
    id: "s2",
    title: "Custom SaaS & Full-Stack Development",
    slug: "custom-saas-development",
    short_description: "Scalable, secure, and performance-driven web applications with modern frontend and backend architecture.",
    icon_name: "Code",
  },
  {
    id: "s3",
    title: "WordPress, Shopify & Webflow Development",
    slug: "wordpress-shopify-webflow",
    short_description: "High-converting, SEO-optimized websites designed for speed, user experience, and revenue growth.",
    icon_name: "Globe",
  },
  {
    id: "s4",
    title: "Technical SEO & Optimization Services",
    slug: "technical-seo",
    short_description: "Comprehensive SEO audits, on-page optimization, performance tuning, and ranking strategies to increase visibility and organic traffic.",
    icon_name: "Search",
  },
  {
    id: "s5",
    title: "Penetration Testing & Vulnerability Assessment",
    slug: "penetration-testing",
    short_description: "Professional security testing to identify vulnerabilities and strengthen digital infrastructure against cyber threats.",
    icon_name: "Shield",
  },
  {
    id: "s6",
    title: "Network Security Scanning",
    slug: "network-security",
    short_description: "Advanced network analysis and infrastructure scanning to ensure enterprise-grade protection.",
    icon_name: "Network",
  },
];

const fallbackTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Founder, Tech Startup",
    role: "USA",
    company: null,
    content: "Manha Teck transformed our digital infrastructure and automated key processes with AI-driven solutions.",
    rating: 5,
    image_url: null,
  },
  {
    id: "t2",
    name: "eCommerce Owner",
    role: "UAE",
    company: null,
    content: "Our website performance and SEO rankings improved significantly after their optimization strategy.",
    rating: 5,
    image_url: null,
  },
  {
    id: "t3",
    name: "IT Manager",
    role: "UK",
    company: null,
    content: "Their security audit revealed critical vulnerabilities and strengthened our system.",
    rating: 5,
    image_url: null,
  },
];

const features = [
  { icon: Cpu, title: "AI-First Architecture", desc: "Intelligent systems built with machine learning and automation at the core." },
  { icon: Shield, title: "Security-Integrated Systems", desc: "Every solution is engineered with enterprise-grade security from day one." },
  { icon: Cloud, title: "Cloud-Scalable Infrastructure", desc: "Architecture designed to scale seamlessly from startup to enterprise." },
  { icon: Target, title: "Conversion-Driven Design Strategy", desc: "Data-backed design decisions that maximize engagement and revenue." },
];

const stats = [
  { label: "Websites Engineered", value: 200 },
  { label: "AI Workflows Automated", value: 75 },
  { label: "Security Assessments Completed", value: 150 },
  { label: "SEO Campaigns Optimized", value: 120 },
];

// Animated counter component
const AnimatedCounter = ({ target, duration = 2 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}+</span>;
};

export default function Landing() {
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const [servicesRes, settingsRes, testimonialsRes] = await Promise.all([
        supabase
          .from('services')
          .select('id, title, slug, short_description, icon_name')
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('site_settings')
          .select('logo_url, contact_phone, contact_email, whatsapp_url')
          .limit(1)
          .single(),
        supabase
          .from('testimonials')
          .select('id, name, role, company, content, rating, image_url')
          .order('created_at', { ascending: false })
          .limit(6)
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      toast({ title: 'Verification Required', description: 'Please complete the math challenge.', variant: 'destructive' });
      return;
    }

    if (!formData.name || !formData.email || !formData.service) {
      toast({ title: 'Missing Fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
        form_type: 'landing',
      });

    if (dbError) {
      toast({ title: 'Error', description: dbError.message, variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    try {
      await supabase.functions.invoke('send-email', {
        body: {
          type: 'landing_lead',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
        },
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    setIsSubmitting(false);
    setIsDialogOpen(false);
    navigate('/thank-you');
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    setIsVerified(false);
  };

  const allServices = services.length > 0 ? services : fallbackServices;
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  const LeadForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="popup-name">Full Name *</Label>
        <Input id="popup-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="popup-email">Email Address *</Label>
        <Input id="popup-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="popup-phone">Phone Number</Label>
        <Input id="popup-phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+44..." />
      </div>
      <div className="space-y-2">
        <Label>Service Needed *</Label>
        <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
          <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
          <SelectContent>
            {allServices.map((s) => (<SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>))}
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="popup-message">Message</Label>
        <Textarea id="popup-message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us about your project..." rows={3} />
      </div>
      <MathChallenge onVerified={setIsVerified} />
      <Button type="submit" size="lg" className="w-full btn-glow bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || !isVerified}>
        {isSubmitting ? 'Submitting...' : 'Get Free Strategy Call'}
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </form>
  );

  const openDialog = () => setIsDialogOpen(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Manha Teck" className="h-10" />
            ) : (
              <span className="text-2xl font-bold gradient-text">Manha Teck</span>
            )}
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/447426468550"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.preventDefault(); (window.top ?? window).open("https://wa.me/447426468550", "_blank", "noopener,noreferrer"); }}
              className="w-10 h-10 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </a>
            <Button onClick={openDialog} className="btn-glow bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex items-center py-20 overflow-hidden neural-bg">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />

        {/* Floating icons */}
        <motion.div className="absolute top-32 right-[15%] hidden lg:flex items-center justify-center w-14 h-14 glass-card rounded-xl" animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <Bot className="w-7 h-7 text-primary" />
        </motion.div>
        <motion.div className="absolute top-48 left-[12%] hidden lg:flex items-center justify-center w-12 h-12 glass-card rounded-xl" animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
          <Shield className="w-6 h-6 text-accent" />
        </motion.div>
        <motion.div className="absolute bottom-32 left-[20%] hidden lg:flex items-center justify-center w-12 h-12 glass-card rounded-xl" animate={{ y: [0, -18, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
          <Code className="w-6 h-6 text-primary" />
        </motion.div>
        <motion.div className="absolute bottom-40 right-[25%] hidden lg:flex items-center justify-center w-14 h-14 glass-card rounded-xl" animate={{ y: [0, -22, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
          <Search className="w-7 h-7 text-accent" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-primary text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
              AI-Driven Digital Engineering & Cybersecurity
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
              AI Agent Development, Secure Web Engineering &{" "}
              <span className="gradient-text">Advanced SEO Solutions</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Manha Teck builds AI-powered automation systems, high-performance websites, enterprise cybersecurity solutions, and data-driven SEO strategies designed to scale modern businesses.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={openDialog} className="btn-glow bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 font-semibold group">
                Book a Free Strategy Call
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="text-lg px-8 py-6 border-border/50 hover:border-primary/50 hover:bg-primary/5 text-foreground">
                View Our Services
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. ABOUT / VALUE PROPOSITION ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-section-bg to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-6">
              <p className="text-primary font-semibold text-sm tracking-widest uppercase">About Us</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Engineering Digital Systems That{" "}
                <span className="gradient-text">Drive Growth</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                At Manha Teck, we combine artificial intelligence, scalable development frameworks, advanced cybersecurity practices, and technical SEO expertise to build secure, high-performing digital ecosystems. We don't just design websites — we engineer intelligent infrastructure that supports long-term business growth.
              </p>
              <Button variant="outline" onClick={openDialog} className="border-primary/30 hover:bg-primary/10 text-foreground group">
                Learn More About Us <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="glass-card p-8 space-y-6">
                {[
                  { icon: Cpu, label: "AI-Powered Automation" },
                  { icon: Shield, label: "Enterprise Security" },
                  { icon: TrendingUp, label: "Growth-Driven SEO" },
                  { icon: Layers, label: "Scalable Architecture" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-[60px]" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-[60px]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. SERVICES ── */}
      <section id="services" className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">What We Do</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Our Core <span className="gradient-text">Services</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((service, idx) => {
              const ServiceIcon = iconMap[service.icon_name || 'Code'] || Code;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="glass-card-hover p-8 h-full flex flex-col group cursor-pointer">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary group-hover:to-accent transition-all duration-500">
                      <ServiceIcon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                      {service.short_description || 'Professional digital services.'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. WHY CHOOSE US ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-section-bg to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Why Us</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Built for Performance.{" "}
              <span className="gradient-text">Secured by Design.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-8 text-center group hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-all">
                  <f.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. RESULTS / STATS ── */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Our Impact</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Delivering <span className="gradient-text">Measurable Impact</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-8 text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text counter-glow mb-3">
                  <AnimatedCounter target={stat.value} />
                </div>
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-section-bg to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Testimonials</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Client <span className="gradient-text">Success Stories</span>
            </h2>
          </motion.div>

          <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]} className="w-full">
            <CarouselContent className="-ml-4">
              {displayTestimonials.map((t, idx) => (
                <CarouselItem key={t.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} className="glass-card p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Quote className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground/85 leading-relaxed text-sm flex-1 mb-6">"{t.content}"</p>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        {t.role && <p className="text-xs text-muted-foreground">{t.role}{t.company ? ` at ${t.company}` : ""}</p>}
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-card border-border hover:bg-primary/20" />
            <CarouselNext className="hidden md:flex -right-4 bg-card border-border hover:bg-primary/20" />
          </Carousel>
        </div>
      </section>

      {/* ── 7. FINAL CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/15" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Ready to Upgrade Your{" "}
              <span className="gradient-text">Digital Infrastructure?</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Partner with Manha Teck to implement AI-driven automation, high-performance development, enterprise security, and strategic SEO optimization.
            </p>
            <div className="pt-4">
              <Button size="lg" onClick={openDialog} className="btn-glow bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 font-semibold group">
                Schedule Your Strategy Call
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 bg-card/50 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Manha Teck" className="h-10 mb-4" />
              ) : (
                <span className="text-2xl font-bold gradient-text block mb-4">Manha Teck</span>
              )}
              <p className="text-muted-foreground text-sm leading-relaxed">
                AI-Driven Digital Engineering & Cybersecurity Agency. Building intelligent, secure, and scalable digital systems for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">Contact</h4>
              <div className="space-y-3 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href={`tel:${settings?.contact_phone || '+447426468550'}`} className="hover:text-primary transition-colors">
                    {settings?.contact_phone || '+447426468550'}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href={`mailto:${settings?.contact_email || 'info@manhateck.com'}`} className="hover:text-primary transition-colors">
                    {settings?.contact_email || 'info@manhateck.com'}
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <button onClick={openDialog} className="text-muted-foreground hover:text-primary transition-colors block">Get a Quote</button>
                <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="text-muted-foreground hover:text-primary transition-colors block">Our Services</button>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} Manha Teck. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Book Your Free Strategy Call</DialogTitle>
          </DialogHeader>
          <LeadForm />
        </DialogContent>
      </Dialog>

      <WhatsAppChat />
    </div>
  );
}
