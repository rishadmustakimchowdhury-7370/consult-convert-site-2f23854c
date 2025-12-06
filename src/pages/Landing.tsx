import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { MathChallenge } from '@/components/MathChallenge';
import { WhatsAppChat } from '@/components/WhatsAppChat';
import {
  ArrowRight, CheckCircle, Star, Zap, Shield, Clock, Users,
  Code, ShoppingCart, Palette, Globe, Search, Megaphone,
  Phone, Mail, MapPin, MessageCircle
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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, ShoppingCart, Palette, Globe, Search, Megaphone
};

const benefits = [
  { icon: Zap, title: 'Fast Delivery', description: 'Quick turnaround on all projects' },
  { icon: Shield, title: 'Secure & Reliable', description: 'Built with best practices' },
  { icon: Clock, title: '24/7 Support', description: 'Always here when you need us' },
  { icon: Users, title: 'Dedicated Team', description: 'Expert professionals at your service' },
];

const testimonials = [
  { name: 'John Smith', company: 'Tech Corp', content: 'Excellent service! They delivered our ecommerce site on time and exceeded expectations.', rating: 5 },
  { name: 'Sarah Johnson', company: 'Fashion Hub', content: 'Professional team with great attention to detail. Highly recommend!', rating: 5 },
  { name: 'Mike Brown', company: 'Local Business', content: 'Affordable and high-quality web design. Very satisfied with the results.', rating: 5 },
];

export default function Landing() {
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
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
      const [servicesRes, settingsRes] = await Promise.all([
        supabase
          .from('services')
          .select('id, title, slug, short_description, icon_name')
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('site_settings')
          .select('logo_url, contact_phone, contact_email, whatsapp_url')
          .limit(1)
          .single()
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
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

    // Save to database
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

    // Send email notification
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
    navigate('/thank-you');
  };

  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="h-10" />
          ) : (
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Manha Tech
            </span>
          )}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${(settings?.contact_phone || '+447426468550').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </a>
            <Button onClick={scrollToForm}>
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              Professional Digital Services
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
              Transform Your Business with{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Expert Digital Solutions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From stunning websites to powerful marketing strategies, we help UK businesses grow online. Get a free consultation today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={scrollToForm}
                className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all group"
              >
                Get a Free Quote
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open(`tel:${settings?.contact_phone || '+447426468550'}`)}
                className="text-lg px-8 py-6"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, index) => {
              const ServiceIcon = iconMap[service.icon_name || 'Code'] || Code;
              return (
                <Card key={service.id} className="group hover:shadow-xl hover:border-primary/50 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <ServiceIcon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground">{service.short_description || 'Professional digital services.'}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button size="lg" onClick={scrollToForm}>
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground">Trusted by businesses across the UK</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <section id="lead-form" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Get Your Free Consultation</h2>
                <p className="text-lg text-muted-foreground">
                  Fill out the form and our team will get back to you within 24 hours with a customized solution for your business.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Free no-obligation quote</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Expert consultation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Fast response within 24 hours</span>
                  </div>
                </div>
                
                <div className="pt-6 space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-5 h-5 text-primary" />
                    <a href={`tel:${settings?.contact_phone || '+447426468550'}`} className="hover:text-primary transition-colors">
                      {settings?.contact_phone || '+447426468550'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href={`mailto:${settings?.contact_email || 'info@manhateck.com'}`} className="hover:text-primary transition-colors">
                      {settings?.contact_email || 'info@manhateck.com'}
                    </a>
                  </div>
                </div>
              </div>

              <Card className="shadow-2xl border-2">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+44..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Service Needed *</Label>
                      <Select
                        value={formData.service}
                        onValueChange={(value) => setFormData({ ...formData, service: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.title}>
                              {service.title}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your project..."
                        rows={3}
                      />
                    </div>

                    <MathChallenge onVerified={setIsVerified} />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting || !isVerified}
                    >
                      {isSubmitting ? 'Submitting...' : 'Get Free Quote'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Manha Tech. All rights reserved.</p>
        </div>
      </footer>

      {/* WhatsApp Chat Widget */}
      <WhatsAppChat phoneNumber={settings?.contact_phone || '+447426468550'} />
    </div>
  );
}
