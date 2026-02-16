import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Shield, Cloud, Code } from "lucide-react";

interface HeroSectionProps {
  onConsultationClick: () => void;
}

export const HeroSection = ({ onConsultationClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden neural-bg">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />

      {/* Floating icons */}
      <motion.div
        className="absolute top-32 right-[15%] hidden lg:flex items-center justify-center w-14 h-14 glass-card rounded-xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Bot className="w-7 h-7 text-primary" />
      </motion.div>
      <motion.div
        className="absolute top-48 left-[12%] hidden lg:flex items-center justify-center w-12 h-12 glass-card rounded-xl"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Shield className="w-6 h-6 text-accent" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-[20%] hidden lg:flex items-center justify-center w-12 h-12 glass-card rounded-xl"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Cloud className="w-6 h-6 text-primary" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-[25%] hidden lg:flex items-center justify-center w-14 h-14 glass-card rounded-xl"
        animate={{ y: [0, -22, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Code className="w-7 h-7 text-accent" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-primary text-sm font-medium"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
            AI-Driven Digital Engineering & Cybersecurity
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight"
          >
            AI Agent Development, Secure SaaS &{" "}
            <span className="gradient-text">High-Performance Digital Solutions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
          >
            Manha Teck delivers AI-powered automation systems, custom SaaS development, high-converting websites, enterprise cybersecurity solutions, and advanced SEO optimization engineered for growth and scalability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              size="lg"
              onClick={onConsultationClick}
              className="btn-glow bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 font-semibold group"
            >
              Book a Free Strategy Call
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-6 border-border/50 hover:border-primary/50 hover:bg-primary/5 text-foreground"
            >
              Explore Our Capabilities
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
