import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
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
      <Helmet>
        <title>AI Agent Development, SaaS & Cybersecurity Solutions | Manha Teck</title>
        <meta name="description" content="Manha Teck delivers AI-powered automation, custom SaaS development, full-stack engineering, WordPress & Shopify development, technical SEO, and penetration testing services." />
        <meta name="keywords" content="AI Agent Development, Custom SaaS Development, Full-Stack Development Agency, WordPress Development Agency, Shopify Development Expert, Webflow Design Agency, Technical SEO Services, SEO Optimization Agency, Penetration Testing Company, Vulnerability Assessment Services, Network Security Scanning" />
      </Helmet>

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
