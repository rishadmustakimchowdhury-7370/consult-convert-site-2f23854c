import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/admin/RichTextEditor';
import SEOAnalyzer from '@/components/admin/SEOAnalyzer';
import { ArrowLeft, Save, Loader2, Clock, CheckCircle } from 'lucide-react';

export default function PageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [seoScore, setSeoScore] = useState(0);
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [pageId, setPageId] = useState<string | null>(id || null);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const contentChangedRef = useRef(false);

  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            navigate('/visage/pages');
          } else if (data) {
            setTitle(data.title || '');
            setSlug(data.slug || '');
            setContent(data.content || '');
            setStatus((data.status as 'draft' | 'published') || 'draft');
            setFocusKeyword(data.focus_keyword || '');
            setMetaTitle(data.meta_title || '');
            setMetaDescription(data.meta_description || '');
            setCanonicalUrl((data as any).canonical_url || '');
            setPageId(data.id);
          }
          setLoading(false);
        });
    }
  }, [id, isEditing, navigate, toast]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const markChanged = useCallback(() => {
    contentChangedRef.current = true;
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    markChanged();
    if (!isEditing || !slug) {
      setSlug(generateSlug(newTitle));
    }
    if (!metaTitle) {
      setMetaTitle(newTitle);
    }
  };

  // Auto-save logic
  const performAutoSave = useCallback(async () => {
    if (!contentChangedRef.current || !title.trim()) return;

    setAutoSaving(true);
    const pageData = {
      title,
      slug: slug || generateSlug(title),
      content,
      status: status as 'draft' | 'published',
      focus_keyword: focusKeyword,
      meta_title: metaTitle,
      meta_description: metaDescription,
      canonical_url: canonicalUrl || null,
      seo_score: seoScore,
    };

    try {
      if (pageId) {
        await supabase.from('pages').update(pageData).eq('id', pageId);
      } else {
        const { data } = await supabase.from('pages').insert(pageData).select('id').single();
        if (data) {
          setPageId(data.id);
          window.history.replaceState(null, '', `/visage/pages/${data.id}`);
        }
      }
      setLastSaved(new Date());
      contentChangedRef.current = false;
    } catch (error) {
      console.error('Autosave failed:', error);
    } finally {
      setAutoSaving(false);
    }
  }, [title, slug, content, status, focusKeyword, metaTitle, metaDescription, canonicalUrl, seoScore, pageId]);

  // Setup autosave interval (15 seconds)
  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      performAutoSave();
    }, 15000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [performAutoSave]);

  // Save and navigate away
  const saveAndGoBack = useCallback(async () => {
    if (contentChangedRef.current && title.trim()) {
      const pageData = {
        title,
        slug: slug || generateSlug(title),
        content,
        status: status as 'draft' | 'published',
        focus_keyword: focusKeyword,
        meta_title: metaTitle,
        meta_description: metaDescription,
        canonical_url: canonicalUrl || null,
        seo_score: seoScore,
      };
      try {
        if (pageId) {
          await supabase.from('pages').update(pageData).eq('id', pageId);
        } else {
          await supabase.from('pages').insert(pageData);
        }
      } catch (error) {
        console.error('Save on close failed:', error);
      }
    }
    navigate('/visage/pages');
  }, [title, slug, content, status, focusKeyword, metaTitle, metaDescription, canonicalUrl, seoScore, pageId, navigate]);

  const handleSave = async (newStatus?: 'draft' | 'published') => {
    if (!title.trim()) {
      toast({ title: 'Error', description: 'Title is required.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const finalStatus = newStatus || status;
    const pageData = {
      title,
      slug: slug || generateSlug(title),
      content,
      status: finalStatus as 'draft' | 'published',
      focus_keyword: focusKeyword,
      meta_title: metaTitle,
      meta_description: metaDescription,
      canonical_url: canonicalUrl || null,
      seo_score: seoScore,
    };

    let error;
    if (pageId) {
      ({ error } = await supabase.from('pages').update(pageData).eq('id', pageId));
    } else {
      const result = await supabase.from('pages').insert(pageData).select('id').single();
      error = result.error;
      if (result.data) setPageId(result.data.id);
    }

    setSaving(false);
    contentChangedRef.current = false;

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({
        title: finalStatus === 'published' ? 'Published!' : 'Saved!',
        description: finalStatus === 'published' ? 'Page published successfully.' : 'Page saved as draft.',
      });
      if (finalStatus === 'published') {
        navigate('/visage/pages');
      } else {
        setLastSaved(new Date());
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={saveAndGoBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-heading font-bold">
                {isEditing ? 'Edit Page' : 'New Page'}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant={status === 'published' ? 'default' : 'secondary'} className="text-xs">
                  {status === 'published' ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Published</>
                  ) : (
                    <><Clock className="w-3 h-3 mr-1" /> Draft</>
                  )}
                </Badge>
                {autoSaving && (
                  <span className="flex items-center gap-1 text-xs">
                    <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                  </span>
                )}
                {lastSaved && !autoSaving && (
                  <span className="text-xs">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            <Button onClick={() => handleSave('published')} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter page title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">/page/</span>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => { setSlug(generateSlug(e.target.value)); markChanged(); }}
                      placeholder="page-url-slug"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <RichTextEditor content={content} onChange={(val) => { setContent(val); markChanged(); }} />
                </div>
              </CardContent>
            </Card>

            {/* SEO Section */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="focus-keyword">Focus Keyword</Label>
                  <Input
                    id="focus-keyword"
                    value={focusKeyword}
                    onChange={(e) => { setFocusKeyword(e.target.value); markChanged(); }}
                    placeholder="Enter focus keyword for SEO"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta-title">
                    Meta Title <span className="text-muted-foreground">({metaTitle.length}/60)</span>
                  </Label>
                  <Input
                    id="meta-title"
                    value={metaTitle}
                    onChange={(e) => { setMetaTitle(e.target.value); markChanged(); }}
                    placeholder="SEO title (50-60 characters)"
                    maxLength={70}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta-description">
                    Meta Description <span className="text-muted-foreground">({metaDescription.length}/160)</span>
                  </Label>
                  <Textarea
                    id="meta-description"
                    value={metaDescription}
                    onChange={(e) => { setMetaDescription(e.target.value); markChanged(); }}
                    placeholder="SEO description (120-160 characters)"
                    maxLength={170}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Canonical URL <span className="text-muted-foreground">(auto-generated)</span>
                  </Label>
                  <Input
                    readOnly
                    value={slug ? `https://manhateck.com/page/${slug}/` : 'https://manhateck.com/page/your-page-slug/'}
                    className="bg-muted text-muted-foreground cursor-default"
                  />
                  <p className="text-xs text-green-500">
                    ✓ Auto-generated with trailing slash from page URL.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Analyzer Sidebar */}
          <div>
            <SEOAnalyzer
              title={title}
              slug={slug}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              content={content}
              focusKeyword={focusKeyword}
              onScoreChange={setSeoScore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
