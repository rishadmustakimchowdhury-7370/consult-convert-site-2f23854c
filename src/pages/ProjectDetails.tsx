import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ConsultationDialog } from '@/components/ConsultationDialog';
import { WhatsAppChat } from '@/components/WhatsAppChat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Briefcase, Calendar, User, Loader2, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  project_name: string;
  client_name: string;
  cover_image: string | null;
  project_description: string | null;
  status: string;
  creation_date: string;
  delivery_date: string | null;
}

const statusLabels: Record<string, string> = {
  lead: 'Lead',
  proposal: 'Proposal',
  approved: 'Approved',
  in_progress: 'In Progress',
  review: 'Under Review',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  review: 'bg-yellow-100 text-yellow-800',
};

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('projects')
        .select('id, project_name, client_name, cover_image, project_description, status, creation_date, delivery_date')
        .eq('id', id)
        .eq('is_public', true)
        .maybeSingle();

      if (data) {
        setProject(data);
        
        // Fetch related projects
        const { data: related } = await supabase
          .from('projects')
          .select('id, project_name, client_name, cover_image, project_description, status, creation_date, delivery_date')
          .eq('is_public', true)
          .eq('status', 'completed')
          .neq('id', id)
          .limit(3);

        if (related) {
          setRelatedProjects(related);
        }
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header onConsultationClick={() => setIsDialogOpen(true)} />
        <div className="container mx-auto px-4 py-20 text-center">
          <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or is not public.</p>
          <Button asChild>
            <Link to="/projects/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
        <Footer />
        <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <div className="container mx-auto px-4">
          <Link
            to="/projects/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
              {project.cover_image ? (
                <img
                  src={project.cover_image}
                  alt={project.project_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Briefcase className="w-20 h-20 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <Badge className={statusColors[project.status] || 'bg-muted text-muted-foreground'}>
                  {statusLabels[project.status] || project.status}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                {project.project_name}
              </h1>

              <div className="flex flex-wrap gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Client: {project.client_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Started: {new Date(project.creation_date).toLocaleDateString()}</span>
                </div>
                {project.delivery_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span>Delivered: {new Date(project.delivery_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {project.project_description && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {project.project_description}
                  </p>
                </div>
              )}

              <Button
                size="lg"
                onClick={() => setIsDialogOpen(true)}
                className="mt-8"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-section-bg">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">More Projects</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  to={`/projects/${relatedProject.id}`}
                  className="group rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 bg-card transition-all duration-300 hover:shadow-xl"
                >
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {relatedProject.cover_image ? (
                      <img
                        src={relatedProject.cover_image}
                        alt={relatedProject.project_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Briefcase className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {relatedProject.project_name}
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      Client: {relatedProject.client_name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24">
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
