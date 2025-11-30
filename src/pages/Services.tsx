import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Code, Megaphone, Lightbulb, Palette, TrendingUp, PenTool } from "lucide-react";

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

const Services = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold">Our Services</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Comprehensive digital solutions designed to help your business thrive in the modern marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={service.title} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold">Not Sure Which Service You Need?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's discuss your goals and find the perfect solution for your business.
          </p>
          <Button
            size="lg"
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-xl"
          >
            Schedule a Free Consultation
          </Button>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Services;
