import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, TrendingUp, Target, Users, BarChart } from "lucide-react";

const features = [
  { icon: TrendingUp, title: "Growth-Focused", description: "Strategies designed to increase your revenue and market share." },
  { icon: Target, title: "Targeted Campaigns", description: "Reach the right audience at the right time with precision targeting." },
  { icon: Users, title: "Lead Generation", description: "Convert visitors into qualified leads and paying customers." },
  { icon: BarChart, title: "Data Analytics", description: "Track performance and optimize campaigns based on real data." },
];

const process = [
  { step: "1", title: "Audit & Analysis", description: "Comprehensive review of your current marketing efforts" },
  { step: "2", title: "Strategy Development", description: "Create a customized marketing plan for your goals" },
  { step: "3", title: "Campaign Launch", description: "Execute multi-channel marketing campaigns" },
  { step: "4", title: "Optimization", description: "Continuous testing and improvement for better results" },
  { step: "5", title: "Reporting", description: "Transparent reporting on performance and ROI" },
];

const faqs = [
  { question: "What platforms do you advertise on?", answer: "We manage campaigns across Google Ads, Facebook, Instagram, LinkedIn, Twitter, and other platforms based on where your audience is most active." },
  { question: "How do you measure success?", answer: "We track key metrics including conversion rates, cost per acquisition, return on ad spend, and overall ROI. You'll receive detailed monthly reports." },
  { question: "What's your minimum budget requirement?", answer: "We recommend a minimum monthly ad spend of $2,000-$3,000 for meaningful results, though this can vary based on your industry and goals." },
  { question: "How quickly will I see results?", answer: "Some channels like PPC can show results within weeks, while SEO and content marketing typically take 3-6 months to show significant impact." },
];

const DigitalMarketing = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold">Digital Marketing</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Data-driven marketing strategies that grow your business and maximize your ROI.
            </p>
            <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
              Grow Your Business
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">What We Offer</h2>
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
          <h2 className="text-4xl font-bold text-center mb-16">Our Process</h2>
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
            <h2 className="text-4xl font-bold text-center mb-16">Investment & ROI</h2>
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-12 text-center space-y-6">
                <p className="text-xl text-muted-foreground">
                  Our pricing is performance-based and scales with your business. Get a customized proposal.
                </p>
                <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Request Pricing
                </Button>
                <div className="flex flex-wrap justify-center gap-6 pt-6">
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>No Long-Term Contracts</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>Transparent Reporting</span></div>
                  <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-primary" /><span>ROI Guarantee</span></div>
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
          <h2 className="text-4xl font-bold">Start Growing Today</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's create a marketing strategy that delivers real results.
          </p>
          <Button size="lg" onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
            Get Your Free Marketing Audit
          </Button>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default DigitalMarketing;
