import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  image_url: string | null;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Founder, Tech Startup",
    role: "USA",
    company: null,
    content: "Manha Teck developed a custom AI automation system that transformed our operations and reduced manual workload significantly.",
    rating: 5,
    image_url: null,
  },
  {
    id: "2",
    name: "SaaS Founder",
    role: "UK",
    company: null,
    content: "Our SaaS platform was delivered with exceptional scalability and clean architecture. Highly professional execution.",
    rating: 5,
    image_url: null,
  },
  {
    id: "3",
    name: "eCommerce Brand Owner",
    role: "UAE",
    company: null,
    content: "Their technical SEO services dramatically improved our search rankings and website performance.",
    rating: 5,
    image_url: null,
  },
  {
    id: "4",
    name: "IT Director",
    role: "Europe",
    company: null,
    content: "The penetration testing report revealed critical vulnerabilities and strengthened our infrastructure security.",
    rating: 5,
    image_url: null,
  },
];

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id, name, role, company, content, rating, image_url")
        .order("created_at", { ascending: false })
        .limit(50);
      if (data && data.length > 0) setTestimonials(data);
    };
    fetch();
  }, []);

  const display = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-section-bg to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Testimonials</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Client <span className="gradient-text">Success Stories</span>
          </h2>
        </motion.div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {display.map((t, idx) => (
              <CarouselItem key={t.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-card p-8 h-full flex flex-col"
                >
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

                  <p className="text-foreground/85 leading-relaxed text-sm flex-1 mb-6">
                    "{t.content}"
                  </p>

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
  );
};
