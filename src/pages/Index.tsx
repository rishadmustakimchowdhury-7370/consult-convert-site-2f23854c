import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustSection } from "@/components/home/TrustSection";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { FeatureHighlight } from "@/components/home/FeatureHighlight";
import { PerformanceStats } from "@/components/home/PerformanceStats";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { FinalCTA } from "@/components/home/FinalCTA";

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="AI Agent Development, SaaS & Cybersecurity Solutions | Manha Teck"
        description="Manha Teck delivers AI-powered automation, custom SaaS development, full-stack engineering, WordPress & Shopify development, technical SEO, and penetration testing services."
      />

      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      <HeroSection onConsultationClick={() => setIsDialogOpen(true)} />
      <TrustSection />
      <ServicesGrid />
      <FeatureHighlight />
      <PerformanceStats />
      <TestimonialsSection />
      <IndustriesSection />
      <FinalCTA onConsultationClick={() => setIsDialogOpen(true)} />

      <Footer />
      <WhatsAppChat />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Index;
