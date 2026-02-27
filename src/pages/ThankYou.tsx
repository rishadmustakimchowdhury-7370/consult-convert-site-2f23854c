import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { ConsultationDialog } from "@/components/ConsultationDialog";

const ThankYou = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Thank You | Manha Teck" description="Thank you for contacting Manha Teck. We will get back to you within 24 hours." />
      <Header onConsultationClick={() => setIsDialogOpen(true)} />
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold">Thank You!</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your message has been received successfully. We appreciate you reaching out to us and will get back to you within 24 hours.
            </p>
            <p className="text-muted-foreground">
              A confirmation email has been sent to your email address.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/">Return to Home</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services/">Explore Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default ThankYou;
