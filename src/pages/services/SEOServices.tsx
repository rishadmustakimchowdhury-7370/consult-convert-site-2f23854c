import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Search, TrendingUp, Link2, FileText } from "lucide-react";

const features = [
  { icon: Search, title: "Keyword Research", description: "Find high-value keywords that your customers are searching for." },
  { icon: TrendingUp, title: "Rank Tracking", description: "Monitor your search rankings and organic traffic growth." },
  { icon: Link2, title: "Link Building", description: "Earn high-quality backlinks to boost your domain authority." },
  { icon: FileText, title: "Content Optimization", description: "Optimize existing content and create SEO-friendly new content." },
];

const process = [
  { step: "1", title: "SEO Audit", description: "Comprehensive analysis of your current SEO performance" },
  { step: "2", title: "Strategy", description: "Custom SEO roadmap based on your goals and competition" },
  { step: "3", title: "On-Page SEO", description: "Optimize site structure, content, and technical elements" },
  { step: "4", title: "Off-Page SEO", description: "Build authority through quality backlinks and citations" },
  { step: "5", title: "Monitor & Report", description: "Track rankings, traffic, and adjust strategy for growth" },
];

const faqs = [
  { question: "How long until I see results?", answer: "SEO is a long-term strategy. You'll typically see initial improvements in 3-4 months, with significant results in 6-12 months depending on competition." },
  { question: "What's included in your SEO service?", answer: "Technical SEO, on-page optimization, content strategy, link building, local SEO (if applicable), and monthly reporting with insights." },
  { question: "Do you guarantee rankings?", answer: "No reputable SEO company can guarantee specific rankings due to constant algorithm changes. We focus on sustainable growth through best practices." },
  { question: "How do you measure success?", answer: "We track organic traffic, keyword rankings, domain authority, conversion rates, and ultimately, the ROI from your organic search channel." },
];

const SEOServices = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold">SEO Services</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Dominate search results and drive qualified organic traffic to your business.
            </p>
            <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
              Boost Your Rankings
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Comprehensive SEO</h2>
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
          <h2 className="text-4xl font-bold text-center mb-16">Our SEO Method</h2>
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
            <h2 className="text-4xl font-bold text-center mb-16">SEO Pricing</h2>
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-12 text-center space-y-6">
                <p className="text-xl text-muted-foreground">
                  Monthly SEO packages designed to grow with your business and deliver measurable ROI.
                </p>
                <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get SEO Proposal
                </Button>
                <div className="flex flex-wrap justify-center gap-6 pt-6">
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>No Long Contracts</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>Monthly Reports</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>White-Hat Only</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">SEO Questions</h2>
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
          <h2 className="text-4xl font-bold">Start Ranking Higher Today</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get a free SEO audit and discover opportunities to grow your organic traffic.
          </p>
          <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
            Get Your Free SEO Audit
          </Button>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default SEOServices;
