import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ConsultationDialog } from '@/components/ConsultationDialog';
import { SEOHead } from '@/components/SEOHead';
import { Loader2 } from 'lucide-react';

interface PageData {
  title: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
}

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from('pages')
        .select('title, content, meta_title, meta_description, canonical_url')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error || !data) {
        navigate('/404', { replace: true });
        return;
      }

      setPage(data);
      setLoading(false);
    };

    fetchPage();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={page.meta_title || page.title}
        description={page.meta_description || undefined}
        canonicalOverride={page.canonical_url}
      />
      <Header onConsultationClick={() => setIsDialogOpen(true)} />

      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-10 leading-tight">
              {page.title}
            </h1>
            {page.content && (
              <div
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-bold prose-h3:text-xl prose-h3:font-semibold prose-h4:text-lg prose-h4:font-semibold prose-img:rounded-xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            )}
          </div>
        </div>
      </article>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
