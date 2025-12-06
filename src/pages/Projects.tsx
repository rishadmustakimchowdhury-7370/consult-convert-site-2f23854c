import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ConsultationDialog } from '@/components/ConsultationDialog';
import { WhatsAppChat } from '@/components/WhatsAppChat';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Briefcase, Loader2 } from 'lucide-react';

interface Project {
  id: string;
  project_name: string;
  client_name: string;
  cover_image: string | null;
  project_description: string | null;
}

export default function Projects() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_name, client_name, cover_image, project_description')
        .eq('is_public', true)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Briefcase className="w-4 h-4" />
              Our Portfolio
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Our Completed{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Explore our portfolio of successful projects delivered to clients across various industries.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-6">
                We're working on exciting projects. Check back soon!
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Start Your Project
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="group rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 bg-card transition-all duration-300 hover:shadow-xl animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {project.cover_image ? (
                      <img
                        src={project.cover_image}
                        alt={project.project_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Briefcase className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.project_name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-3">
                      Client: {project.client_name}
                    </p>
                    {project.project_description && (
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {project.project_description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-section-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-muted-foreground">
              Let's work together to bring your vision to life. Get in touch for a free consultation.
            </p>
            <Button
              size="lg"
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl"
            >
              Book a Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppChat />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
