import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Target, Eye, Award } from "lucide-react";
import aboutBg from "@/assets/about-bg.jpg";

const milestones = [
  { number: "500+", label: "Projects Completed" },
  { number: "50+", label: "Team Members" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "10+", label: "Years Experience" },
];

const About = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Us | Manha Teck"
        description="Learn about Manha Teck — a leading digital agency delivering AI-powered automation, custom web development, SEO, and cybersecurity solutions worldwide."
      />
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={aboutBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold">About Us</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're more than just an agency — we're your partner in digital transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-center mb-12">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded over a decade ago, our agency was built on a simple yet powerful belief: every business deserves access to world-class digital solutions that drive real results. What started as a small team of passionate developers and designers has grown into a full-service agency trusted by companies worldwide.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we combine cutting-edge technology with creative excellence to deliver solutions that not only meet but exceed our clients' expectations. Our commitment to innovation, quality, and client success has made us a leader in the digital space.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-8 rounded-xl bg-card animate-fade-in-up">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower businesses with innovative digital solutions that drive growth, enhance customer experiences, and create lasting value.
              </p>
            </div>
            <div className="text-center space-y-4 p-8 rounded-xl bg-card animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted partner for businesses seeking digital transformation, known for excellence, innovation, and measurable results.
              </p>
            </div>
            <div className="text-center space-y-4 p-8 rounded-xl bg-card animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Our Values</h3>
              <p className="text-muted-foreground leading-relaxed">
                Excellence, integrity, innovation, and client success guide everything we do. We believe in transparency, accountability, and continuous improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Our Achievements</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Numbers that speak to our commitment and success
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.label}
                className="text-center space-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {milestone.number}
                </div>
                <p className="text-lg text-muted-foreground">{milestone.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold">Let's Work Together</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to take your business to the next level? Get in touch with us today.
          </p>
          <Button
            size="lg"
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-xl"
          >
            Book a Free Consultation
          </Button>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default About;
