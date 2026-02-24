import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2, Search, FileText, Files, TrendingUp, AlertTriangle, CheckCircle, Wrench, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateSEOScore } from '@/utils/seoScoring';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  content: string | null;
  type: 'blog' | 'page' | 'service';
}

interface SEOScore {
  item: ContentItem;
  score: number;
  issues: string[];
}

export default function SEOTools() {
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<SEOScore[]>([]);

  const computeScore = (item: ContentItem): SEOScore => {
    const result = calculateSEOScore({
      title: item.title,
      slug: item.slug,
      metaTitle: item.meta_title || '',
      metaDescription: item.meta_description || '',
      content: item.content || '',
      focusKeyword: item.focus_keyword || '',
    });

    const issues = result.checks
      .filter(c => !c.passed)
      .map(c => c.label);

    return { item, score: result.score, issues };
  };

  useEffect(() => {
    const fetchContent = async () => {
      const [blogsResult, pagesResult, servicesResult] = await Promise.all([
        supabase.from('blogs').select('id, title, slug, meta_title, meta_description, focus_keyword, content'),
        supabase.from('pages').select('id, title, slug, meta_title, meta_description, focus_keyword, content'),
        supabase.from('services').select('id, title, slug, meta_title, meta_description, content'),
      ]);

      const blogs = (blogsResult.data || []).map(b => ({ ...b, type: 'blog' as const }));
      const pages = (pagesResult.data || []).map(p => ({ ...p, type: 'page' as const }));
      const services = (servicesResult.data || []).map(s => ({ ...s, type: 'service' as const, focus_keyword: null }));

      const allContent = [...blogs, ...pages, ...services];
      const calculatedScores = allContent.map(computeScore);
      calculatedScores.sort((a, b) => a.score - b.score);

      setScores(calculatedScores);
      setLoading(false);
    };

    fetchContent();
  }, []);

  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getLinkPath = (item: ContentItem) => {
    if (item.type === 'blog') return `/visage/blogs/${item.id}`;
    if (item.type === 'page') return `/visage/pages/${item.id}`;
    return `/visage/services`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">SEO Tools</h1>
        <p className="text-muted-foreground">Monitor and improve your content's SEO (weighted 100-point system)</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average SEO Score</p>
                <p className="text-3xl font-bold">{averageScore}/100</p>
              </div>
              <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', getScoreColor(averageScore))}>
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <Progress value={averageScore} className={cn('h-2 mt-4', getProgressColor(averageScore))} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Content Analyzed</p>
                <p className="text-3xl font-bold">{scores.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Badge variant="secondary">
                <FileText className="w-3 h-3 mr-1" />
                {scores.filter(s => s.item.type === 'blog').length} Blogs
              </Badge>
              <Badge variant="secondary">
                <Files className="w-3 h-3 mr-1" />
                {scores.filter(s => s.item.type === 'page').length} Pages
              </Badge>
              <Badge variant="secondary">
                <Wrench className="w-3 h-3 mr-1" />
                {scores.filter(s => s.item.type === 'service').length} Services
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Needs Attention</p>
                <p className="text-3xl font-bold">{scores.filter(s => s.score < 60).length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Content with score below 60/100
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle>Content SEO Analysis</CardTitle>
          <CardDescription>Weighted scoring: click any item to edit and improve its SEO</CardDescription>
        </CardHeader>
        <CardContent>
          {scores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No content to analyze yet.</p>
              <p className="text-sm">Create some blog posts, pages, or services to see their SEO scores.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((item) => (
                <Link
                  key={`${item.item.type}-${item.item.id}`}
                  to={getLinkPath(item.item)}
                  className="block"
                >
                  <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-secondary/50 transition-colors">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg',
                      getScoreColor(item.score)
                    )}>
                      {item.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{item.item.title}</p>
                        <Badge variant="outline" className="text-xs capitalize">
                          {item.item.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">/{item.item.slug}</p>
                      {item.issues.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.issues.slice(0, 2).map((issue, i) => (
                            <span key={i} className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                              {issue}
                            </span>
                          ))}
                          {item.issues.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{item.issues.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="hidden md:block w-32">
                      <Progress value={item.score} className={cn('h-2', getProgressColor(item.score))} />
                    </div>
                    {item.score >= 80 ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : item.score >= 60 ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
