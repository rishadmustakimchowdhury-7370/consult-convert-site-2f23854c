import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ConsultationDialog } from '@/components/ConsultationDialog';
import { SEOHead } from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  cover_image: string | null;
  author_name: string | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  categories?: { name: string; slug: string } | null;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*, categories(name, slug)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (!error && data) {
        setBlog(data as Blog);
        // Update page title
        document.title = data.meta_title || data.title;
      }
      setLoading(false);
    };

    fetchBlog();
  }, [slug]);

  const readingTime = blog?.content 
    ? Math.ceil(blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)
    : 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onConsultationClick={() => setIsDialogOpen(true)} />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4" />
            <div className="h-4 bg-muted rounded w-1/2 mb-8" />
            <div className="h-64 bg-muted rounded mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header onConsultationClick={() => setIsDialogOpen(true)} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={blog.meta_title || blog.title}
        description={blog.meta_description || blog.excerpt || undefined}
        canonicalOverride={blog.canonical_url}
      />
      <Header onConsultationClick={() => setIsDialogOpen(true)} />
      
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <Link 
              to="/blog/" 
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            {/* Category */}
            {blog.categories && (
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                {blog.categories.name}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              {blog.author_name && (
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {blog.author_name}
                </span>
              )}
              {blog.published_at && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(blog.published_at), 'MMMM d, yyyy')}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </span>
            </div>

            {/* Cover Image - Fixed 16:9 aspect ratio */}
            {blog.cover_image && (
              <div className="relative rounded-xl overflow-hidden mb-10 shadow-lg aspect-video">
                <img
                  src={blog.cover_image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-ul:text-foreground/90 prose-ol:text-foreground/90 prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary/40 prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:bg-muted"
              dangerouslySetInnerHTML={{ __html: blog.content || '' }}
            />
          </div>
        </div>
      </article>

      <Footer />
      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}