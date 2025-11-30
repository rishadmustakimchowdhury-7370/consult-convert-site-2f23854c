import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Palette, Users, Zap, Eye } from "lucide-react";

const features = [
  { icon: Palette, title: "Beautiful Interfaces", description: "Stunning designs that capture your brand essence." },
  { icon: Users, title: "User-Centered", description: "Intuitive experiences based on user research and testing." },
  { icon: Zap, title: "Conversion Focused", description: "Designs optimized to drive actions and results." },
  { icon: Eye, title: "Accessibility First", description: "Inclusive design that works for everyone." },
];

const process = [
  { step: "1", title: "Research", description: "User interviews, analytics review, and competitor analysis" },
  { step: "2", title: "Wireframing", description: "Low-fidelity layouts to map user flows and structure" },
  { step: "3", title: "Visual Design", description: "High-fidelity mockups with your brand identity" },
  { step: "4", title: "Prototyping", description: "Interactive prototypes for testing and validation" },
  { step: "5", title: "Handoff", description: "Developer-ready files and comprehensive documentation" },
];

const faqs = [
  { question: "What deliverables do I receive?", answer: "You'll receive wireframes, high-fidelity designs, interactive prototypes, design system, and developer handoff files (Figma, Sketch, or Adobe XD)." },
  { question: "Do you conduct user testing?", answer: "Yes! We can facilitate user testing sessions to validate designs and gather feedback before development begins." },
  { question: "Can you redesign my existing product?", answer: "Absolutely. We specialize in both new product design and redesigning existing applications to improve usability and conversion." },
  { question: "What tools do you use?", answer: "We primarily use Figma for design and prototyping, along with tools like Maze for user testing and FigJam for collaborative workshops." },
];

const UIUXDesign = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold">UI/UX Design</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Create delightful user experiences that engage, convert, and retain your customers.
            </p>
            <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
              Transform Your UX
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Design Excellence</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <Card key={feature.title} className="border-2 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
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

      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Design Process</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {process.map((item, i) => (
              <div key={item.step} className="flex items-start space-x-6 p-6 bg-card rounded-xl border-2 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">{item.step}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Design Packages</h2>
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-12 text-center space-y-6">
                <p className="text-xl text-muted-foreground">
                  From single screens to complete design systems, we tailor packages to your needs.
                </p>
                <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Discuss Your Project
                </Button>
                <div className="flex flex-wrap justify-center gap-6 pt-6">
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>Source Files Included</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>Unlimited Revisions</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>Developer Support</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border-2 rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready for Beautiful Design?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's create user experiences that your customers will love.
          </p>
          <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
            Start Your Design Project
          </Button>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default UIUXDesign;
