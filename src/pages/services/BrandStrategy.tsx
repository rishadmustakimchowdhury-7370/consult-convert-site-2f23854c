import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Heart, Compass, Sparkles, BookOpen } from "lucide-react";

const features = [
  { icon: Heart, title: "Brand Identity", description: "Define your unique voice, values, and visual identity." },
  { icon: Compass, title: "Strategic Positioning", description: "Stand out in your market with clear differentiation." },
  { icon: Sparkles, title: "Creative Storytelling", description: "Craft compelling narratives that resonate with your audience." },
  { icon: BookOpen, title: "Brand Guidelines", description: "Comprehensive documentation for consistent brand expression." },
];

const process = [
  { step: "1", title: "Brand Discovery", description: "Deep dive into your business, values, and target audience" },
  { step: "2", title: "Market Research", description: "Analyze competitors and identify market opportunities" },
  { step: "3", title: "Strategy Development", description: "Create your brand positioning and messaging framework" },
  { step: "4", title: "Visual Identity", description: "Design logo, colors, typography, and visual elements" },
  { step: "5", title: "Brand Guidelines", description: "Document everything for consistent implementation" },
];

const faqs = [
  { question: "What's included in brand strategy?", answer: "Our comprehensive package includes brand positioning, messaging framework, visual identity, brand guidelines, and implementation support." },
  { question: "How long does the process take?", answer: "A typical brand strategy project takes 6-12 weeks, depending on the scope and complexity of your business." },
  { question: "Do you provide ongoing support?", answer: "Yes! We offer brand management services to ensure consistent application across all touchpoints." },
  { question: "Can you rebrand an existing business?", answer: "Absolutely. We specialize in both new brand creation and strategic rebranding for established businesses." },
];

const BrandStrategy = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold">Brand Strategy</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Build a powerful brand that connects with your audience and drives lasting success.
            </p>
            <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
              Define Your Brand
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Strategic Brand Development</h2>
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
          <h2 className="text-4xl font-bold text-center mb-16">Our Approach</h2>
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
            <h2 className="text-4xl font-bold text-center mb-16">Investment in Your Brand</h2>
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-12 text-center space-y-6">
                <p className="text-xl text-muted-foreground">
                  Custom brand strategy packages tailored to your business size and goals.
                </p>
                <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Custom Proposal
                </Button>
                <div className="flex flex-wrap justify-center gap-6 pt-6">
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>Full Brand Package</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>Unlimited Revisions</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>File Ownership</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Your Questions Answered</h2>
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
          <h2 className="text-4xl font-bold">Ready to Build Your Brand?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's create a brand that stands out and drives real business results.
          </p>
          <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
            Start Your Brand Journey
          </Button>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default BrandStrategy;
