import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FinalCTAProps {
  onConsultationClick: () => void;
}

export const FinalCTA = ({ onConsultationClick }: FinalCTAProps) => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/15" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Ready to Build, Automate &{" "}
            <span className="gradient-text">Secure Your Digital Infrastructure?</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Partner with Manha Teck to implement AI-driven systems, scalable SaaS platforms, high-performance websites, advanced SEO strategies, and enterprise-grade cybersecurity.
          </p>
          <div className="pt-4">
            <Button
              size="lg"
              onClick={onConsultationClick}
              className="btn-glow bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 font-semibold group"
            >
              Schedule Your Strategy Call
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
