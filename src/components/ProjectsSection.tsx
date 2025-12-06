import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Briefcase, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  project_name: string;
  client_name: string;
  cover_image: string | null;
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_name, client_name, cover_image')
        .eq('is_public', true)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(6);

      if (data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-section-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
            <Briefcase className="w-4 h-4" />
            Our Portfolio
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Recent Projects
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore some of our recently completed projects for clients across various industries.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link
              to={`/projects/${project.id}`}
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
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  {project.project_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Client: {project.client_name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline" className="group">
            <Link to="/projects">
              View All Projects
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
