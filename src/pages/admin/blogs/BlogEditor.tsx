import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import AdvancedRichTextEditor from '@/components/admin/AdvancedRichTextEditor';
import SEOAnalyzer from '@/components/admin/SEOAnalyzer';
import ImageUpload from '@/components/admin/ImageUpload';
import BlogPreviewDialog from '@/components/admin/BlogPreviewDialog';
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  FileText,
  Settings,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

type BlogStatus = 'draft' | 'published';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Blog Data
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [status, setStatus] = useState<BlogStatus>('draft');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [blogId, setBlogId] = useState<string | null>(id || null);
  const [seoScore, setSeoScore] = useState(0);

  // Autosave timer ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const contentChangedRef = useRef(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
            navigate('/visage/blogs');
          } else if (data) {
            setTitle(data.title || '');
            setSlug(data.slug || '');
            setContent(data.content || '');
            setExcerpt(data.excerpt || '');
            setCoverImage(data.cover_image || '');
            setCoverImageAlt(data.cover_image_alt || '');
            setCategoryId(data.category_id || '');
            setAuthorName(data.author_name || '');
            setStatus((data.status as BlogStatus) || 'draft');
            setFocusKeyword(data.focus_keyword || '');
            setMetaTitle(data.meta_title || '');
            setMetaDescription(data.meta_description || '');
            setCanonicalUrl((data as any).canonical_url || '');
            setBlogId(data.id);
          }
          setLoading(false);
        });
    }
  }, [id, isEditing, navigate, toast]);

  // Autosave functionality
  const performAutoSave = useCallback(async () => {
    if (!contentChangedRef.current || !title.trim()) return;
    
    setAutoSaving(true);
    const blogData = {
      title,
      slug: slug || generateSlug(title),
      content,
      excerpt,
      cover_image: coverImage,
      cover_image_alt: coverImageAlt,
      category_id: categoryId || null,
      author_name: authorName,
      status,
      focus_keyword: focusKeyword,
      meta_title: metaTitle,
      meta_description: metaDescription,
      canonical_url: canonicalUrl || null,
      seo_score: seoScore,
    };

    try {
      if (blogId) {
        await supabase.from('blogs').update(blogData).eq('id', blogId);
      } else {
        const { data } = await supabase.from('blogs').insert(blogData).select('id').single();
        if (data) {
          setBlogId(data.id);
          // Update URL without full navigation
          window.history.replaceState(null, '', `/visage/blogs/${data.id}`);
        }
      }
      setLastSaved(new Date());
      contentChangedRef.current = false;
    } catch (error) {
      console.error('Autosave failed:', error);
    } finally {
      setAutoSaving(false);
    }
  }, [title, slug, content, excerpt, coverImage, coverImageAlt, categoryId, authorName, status, focusKeyword, metaTitle, metaDescription, blogId]);

  // Setup autosave interval (30 seconds)
  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      performAutoSave();
    }, 30000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [performAutoSave]);

  // Mark content as changed when any field updates
  const handleFieldChange = useCallback(<T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    setter(value);
    contentChangedRef.current = true;
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    handleFieldChange(setTitle, newTitle);
    if (!isEditing || !slug) {
      setSlug(generateSlug(newTitle));
    }
    if (!metaTitle) {
      setMetaTitle(newTitle);
    }
  };

  const handleSave = async (newStatus?: BlogStatus) => {
    if (!title.trim()) {
      toast({ title: 'Error', description: 'Title is required.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const finalStatus = newStatus || status;
    const blogData = {
      title,
      slug: slug || generateSlug(title),
      content,
      excerpt,
      cover_image: coverImage,
      cover_image_alt: coverImageAlt,
      category_id: categoryId || null,
      author_name: authorName,
      status: finalStatus,
      focus_keyword: focusKeyword,
      meta_title: metaTitle,
      meta_description: metaDescription,
      canonical_url: canonicalUrl || null,
      seo_score: seoScore,
      published_at: finalStatus === 'published' ? new Date().toISOString() : null,
    };

    let error;
    if (blogId) {
      ({ error } = await supabase.from('blogs').update(blogData).eq('id', blogId));
    } else {
      const result = await supabase.from('blogs').insert(blogData).select('id').single();
      error = result.error;
      if (result.data) {
        setBlogId(result.data.id);
      }
    }

    setSaving(false);
    contentChangedRef.current = false;

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ 
        title: finalStatus === 'published' ? 'Published!' : 'Saved!', 
        description: finalStatus === 'published' 
          ? 'Blog post published successfully.' 
          : 'Blog post saved as draft.'
      });
      if (finalStatus === 'published') {
        navigate('/visage/blogs');
      } else {
        setLastSaved(new Date());
      }
    }
  };

  const selectedCategory = categories.find(c => c.id === categoryId);

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
            <Button variant="ghost" size="icon" onClick={() => navigate('/visage/blogs')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-heading font-bold">
                {isEditing ? 'Edit Blog' : 'New Blog Post'}
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
            <Button variant="outline" onClick={() => setPreviewOpen(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
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
            {/* Title Card */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Input
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter your blog title..."
                    className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">/blog/</span>
                  <Input
                    value={slug}
                    onChange={(e) => handleFieldChange(setSlug, generateSlug(e.target.value))}
                    placeholder="blog-url-slug"
                    className="max-w-xs h-8 text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Content/SEO */}
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  SEO Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4 mt-4">
                {/* Excerpt */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Excerpt</CardTitle>
                    <CardDescription>Brief summary shown in blog listings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={excerpt}
                      onChange={(e) => handleFieldChange(setExcerpt, e.target.value)}
                      placeholder="Write a compelling excerpt that summarizes your blog post..."
                      rows={3}
                    />
                  </CardContent>
                </Card>

                {/* Rich Text Editor */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Content</CardTitle>
                    <CardDescription>Write your blog content with rich formatting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdvancedRichTextEditor
                      content={content}
                      onChange={(val) => handleFieldChange(setContent, val)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      SEO Settings
                    </CardTitle>
                    <CardDescription>Optimize your blog for search engines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="focus-keyword">Focus Keyword</Label>
                      <Input
                        id="focus-keyword"
                        value={focusKeyword}
                        onChange={(e) => handleFieldChange(setFocusKeyword, e.target.value)}
                        placeholder="Enter your main keyword"
                      />
                      <p className="text-xs text-muted-foreground">
                        The main keyword you want this page to rank for
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta-title">
                        Meta Title
                        <span className={`ml-2 text-xs ${metaTitle.length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          ({metaTitle.length}/60)
                        </span>
                      </Label>
                      <Input
                        id="meta-title"
                        value={metaTitle}
                        onChange={(e) => handleFieldChange(setMetaTitle, e.target.value)}
                        placeholder="SEO title (50-60 characters recommended)"
                        maxLength={70}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta-description">
                        Meta Description
                        <span className={`ml-2 text-xs ${metaDescription.length > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          ({metaDescription.length}/160)
                        </span>
                      </Label>
                      <Textarea
                        id="meta-description"
                        value={metaDescription}
                        onChange={(e) => handleFieldChange(setMetaDescription, e.target.value)}
                        placeholder="SEO description (120-160 characters recommended)"
                        maxLength={170}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="canonical-url">
                        Canonical URL
                        <span className="ml-2 text-xs text-muted-foreground">(optional override)</span>
                      </Label>
                      <Input
                        id="canonical-url"
                        value={canonicalUrl}
                        onChange={(e) => handleFieldChange(setCanonicalUrl, e.target.value)}
                        placeholder="https://manhateck.com/blog/your-post-slug"
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty to auto-generate. Use only if this content exists at another URL.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Analyzer */}
                <SEOAnalyzer
                  title={title}
                  slug={slug}
                  metaTitle={metaTitle}
                  metaDescription={metaDescription}
                  content={content}
                  focusKeyword={focusKeyword}
                  onScoreChange={setSeoScore}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Post Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(val) => handleFieldChange(setStatus, val as BlogStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Draft
                        </span>
                      </SelectItem>
                      <SelectItem value="published">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Published
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={categoryId} onValueChange={(val) => handleFieldChange(setCategoryId, val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input
                    value={authorName}
                    onChange={(e) => handleFieldChange(setAuthorName, e.target.value)}
                    placeholder="Author name"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Featured Image</CardTitle>
                <CardDescription>Recommended: 1200×675px (16:9)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload
                  value={coverImage}
                  onChange={(val) => handleFieldChange(setCoverImage, val)}
                  folder="blog-covers"
                  aspectRatio="video"
                  recommendedSize="1200 x 675px (16:9)"
                />

                <div className="space-y-2">
                  <Label>Image Alt Text</Label>
                  <Input
                    value={coverImageAlt}
                    onChange={(e) => handleFieldChange(setCoverImageAlt, e.target.value)}
                    placeholder="Describe the image for SEO"
                  />
                  <p className="text-xs text-muted-foreground">
                    Helps with accessibility and SEO
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use your focus keyword in the title</li>
                  <li>• Add the keyword in the first paragraph</li>
                  <li>• Use headings (H2, H3) to structure content</li>
                  <li>• Include internal and external links</li>
                  <li>• Add alt text to all images</li>
                  <li>• Write at least 300 words</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <BlogPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        blog={{
          title,
          content,
          excerpt,
          coverImage,
          coverImageAlt,
          authorName,
          categoryName: selectedCategory?.name,
        }}
      />
    </div>
  );
}
