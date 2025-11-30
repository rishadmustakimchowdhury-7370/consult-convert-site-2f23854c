import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, PenTool, Video, Image, Mic } from "lucide-react";

const features = [
  { icon: PenTool, title: "Blog Writing", description: "SEO-optimized articles that engage and convert your readers." },
  { icon: Video, title: "Video Content", description: "Compelling video scripts and production for maximum engagement." },
  { icon: Image, title: "Visual Content", description: "Infographics, social graphics, and branded imagery." },
  { icon: Mic, title: "Podcast Production", description: "From concept to editing, we handle your audio content." },
];

const process = [
  { step: "1", title: "Content Strategy", description: "Define your goals, audience, and content pillars" },
  { step: "2", title: "Content Calendar", description: "Plan topics, formats, and publishing schedule" },
  { step: "3", title: "Creation", description: "Professional writers and creators produce your content" },
  { step: "4", title: "Review & Edit", description: "Quality checks and revisions to ensure excellence" },
  { step: "5", title: "Publish & Promote", description: "Launch content and amplify reach across channels" },
];

const faqs = [
  { question: "What types of content do you create?", answer: "We create blog posts, articles, social media content, email newsletters, white papers, case studies, video scripts, infographics, and more." },
  { question: "How do you ensure content quality?", answer: "All content goes through our editorial process including research, writing by subject matter experts, editing, and final approval before delivery." },
  { question: "Can you match our brand voice?", answer: "Absolutely. We start with a detailed brand voice guide and tone analysis to ensure all content aligns perfectly with your existing brand." },
  { question: "Do you handle content distribution?", answer: "Yes! We can manage content publishing, social media distribution, email campaigns, and promotion across your chosen channels." },
];

const ContentCreation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold">Content Creation</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Compelling content that tells your story, engages your audience, and drives real results.
            </p>
            <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
              Create Amazing Content
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Content Services</h2>
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
          <h2 className="text-4xl font-bold text-center mb-16">Content Process</h2>
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
            <h2 className="text-4xl font-bold text-center mb-16">Content Packages</h2>
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-12 text-center space-y-6">
                <p className="text-xl text-muted-foreground">
                  Flexible monthly retainers or per-project pricing based on your content needs.
                </p>
                <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Discuss Content Needs
                </Button>
                <div className="flex flex-wrap justify-center gap-6 pt-6">
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>Expert Writers</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>Unlimited Revisions</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>Content Rights</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Common Questions</h2>
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
          <h2 className="text-4xl font-bold">Start Creating Today</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's develop a content strategy that positions you as an industry leader.
          </p>
          <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
            Launch Your Content Strategy
          </Button>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default ContentCreation;
