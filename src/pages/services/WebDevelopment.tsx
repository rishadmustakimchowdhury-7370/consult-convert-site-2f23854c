import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Code, Smartphone, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Custom Development",
    description: "Tailored solutions built from the ground up to match your exact requirements.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Perfect performance across all devices, from mobile to desktop.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed and performance to keep your users engaged.",
  },
  {
    icon: Shield,
    title: "Secure & Scalable",
    description: "Built with security best practices and designed to grow with your business.",
  },
];

const process = [
  { step: "1", title: "Discovery", description: "We analyze your requirements and define project scope" },
  { step: "2", title: "Design", description: "Create wireframes and visual designs for approval" },
  { step: "3", title: "Development", description: "Build your application with modern technologies" },
  { step: "4", title: "Testing", description: "Rigorous quality assurance and user testing" },
  { step: "5", title: "Launch", description: "Deploy to production and provide ongoing support" },
];

const faqs = [
  {
    question: "What technologies do you use?",
    answer: "We use modern, industry-standard technologies including React, Next.js, Node.js, and cloud platforms like AWS and Vercel. We choose the best stack for each project based on your specific needs.",
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity, but a typical website takes 4-8 weeks, while more complex web applications may take 3-6 months. We'll provide a detailed timeline during our consultation.",
  },
  {
    question: "Do you provide ongoing maintenance?",
    answer: "Yes! We offer comprehensive maintenance packages including security updates, performance optimization, feature additions, and technical support.",
  },
  {
    question: "Can you integrate with existing systems?",
    answer: "Absolutely. We have extensive experience integrating with various APIs, databases, CRM systems, payment gateways, and other third-party services.",
  },
];

const WebDevelopment = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold">Web Development</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Custom websites and web applications that drive results and deliver exceptional user experiences.
            </p>
            <Button
              size="lg"
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features & Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="border-2 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Development Process</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {process.map((item, index) => (
              <div
                key={item.step}
                className="flex items-start space-x-6 p-6 bg-card rounded-xl border-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Placeholder */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Flexible Pricing Options</h2>
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-12 text-center space-y-6">
                <p className="text-xl text-muted-foreground">
                  Every project is unique. Our pricing is tailored to your specific needs, ensuring you get the best value for your investment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Get a Custom Quote
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center gap-6 pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>No Hidden Fees</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Flexible Payment Plans</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Money-Back Guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border-2 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Start Your Project?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's discuss your vision and create something amazing together.
          </p>
          <Button
            size="lg"
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
          >
            Schedule Your Free Consultation
          </Button>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default WebDevelopment;
