import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationDialog } from "@/components/ConsultationDialog";
import { SEOHead } from "@/components/SEOHead";

const PrivacyPolicy = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy | Manha Teck"
        description="Read Manha Teck's privacy policy to understand how we collect, use, and protect your personal information."
      />
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-5xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-8 text-foreground/80">
              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Introduction</h2>
                <p className="leading-relaxed">
                  At Agency, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Information We Collect</h2>
                <p className="leading-relaxed">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and contact information</li>
                  <li>Email address and phone number</li>
                  <li>Business information and project details</li>
                  <li>Communication preferences</li>
                  <li>Any other information you choose to provide</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">How We Use Your Information</h2>
                <p className="leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Respond to your inquiries and fulfill your requests</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Analyze usage patterns and improve user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Data Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Third-Party Services</h2>
                <p className="leading-relaxed">
                  We may use third-party services to help us operate our business and provide services to you. These third parties have access to your information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Your Rights (GDPR)</h2>
                <p className="leading-relaxed">
                  If you are a resident of the European Economic Area (EEA), you have certain data protection rights:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The right to access, update, or delete your information</li>
                  <li>The right to rectification</li>
                  <li>The right to object</li>
                  <li>The right to restriction of processing</li>
                  <li>The right to data portability</li>
                  <li>The right to withdraw consent</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Cookies</h2>
                <p className="leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Children's Privacy</h2>
                <p className="leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Contact Us</h2>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <ul className="space-y-2 ml-4">
                  <li>Email: privacy@agency.com</li>
                  <li>Phone: +1 (234) 567-890</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default PrivacyPolicy;
