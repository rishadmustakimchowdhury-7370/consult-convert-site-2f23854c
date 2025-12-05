import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  FilePlus, 
  Files, 
  Search, 
  Eye,
  Clock,
  Plus,
  FolderOpen,
  Quote,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

interface Stats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalPages: number;
  totalCategories: number;
  totalTestimonials: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalPages: 0,
    totalCategories: 0,
    totalTestimonials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [blogsResult, pagesResult, categoriesResult, testimonialsResult] = await Promise.all([
        supabase.from('blogs').select('status'),
        supabase.from('pages').select('id'),
        supabase.from('categories').select('id'),
        supabase.from('testimonials').select('id'),
      ]);

      const blogs = blogsResult.data || [];
      const pages = pagesResult.data || [];
      const categories = categoriesResult.data || [];
      const testimonials = testimonialsResult.data || [];

      setStats({
        totalBlogs: blogs.length,
        publishedBlogs: blogs.filter(b => b.status === 'published').length,
        draftBlogs: blogs.filter(b => b.status === 'draft').length,
        totalPages: pages.length,
        totalCategories: categories.length,
        totalTestimonials: testimonials.length,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      title: 'Total Blogs', 
      value: stats.totalBlogs, 
      icon: FileText, 
      color: 'from-primary to-primary/70',
      bgColor: 'bg-primary/10',
      link: '/admin/blogs'
    },
    { 
      title: 'Published', 
      value: stats.publishedBlogs, 
      icon: Eye, 
      color: 'from-green-500 to-green-400',
      bgColor: 'bg-green-500/10',
      link: '/admin/blogs'
    },
    { 
      title: 'Drafts', 
      value: stats.draftBlogs, 
      icon: Clock, 
      color: 'from-amber-500 to-amber-400',
      bgColor: 'bg-amber-500/10',
      link: '/admin/blogs'
    },
    { 
      title: 'Pages', 
      value: stats.totalPages, 
      icon: Files, 
      color: 'from-blue-500 to-blue-400',
      bgColor: 'bg-blue-500/10',
      link: '/admin/pages'
    },
    { 
      title: 'Categories', 
      value: stats.totalCategories, 
      icon: FolderOpen, 
      color: 'from-purple-500 to-purple-400',
      bgColor: 'bg-purple-500/10',
      link: '/admin/categories'
    },
    { 
      title: 'Testimonials', 
      value: stats.totalTestimonials, 
      icon: Quote, 
      color: 'from-pink-500 to-pink-400',
      bgColor: 'bg-pink-500/10',
      link: '/admin/testimonials'
    },
  ];

  const quickActions = [
    { title: 'New Blog Post', icon: FilePlus, path: '/admin/blogs/new', color: 'bg-primary hover:bg-primary/90' },
    { title: 'Add Category', icon: FolderOpen, path: '/admin/categories', color: 'bg-purple-500 hover:bg-purple-600' },
    { title: 'Add Testimonial', icon: Quote, path: '/admin/testimonials', color: 'bg-pink-500 hover:bg-pink-600' },
    { title: 'SEO Tools', icon: Search, path: '/admin/seo', color: 'bg-accent hover:bg-accent/90' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg">
          <Link to="/admin/blogs/new">
            <Plus className="w-5 h-5 mr-2" />
            Create New Blog
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-border/50 overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: `hsl(var(--primary))` }} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {loading ? '...' : stat.value}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button 
                  key={action.path} 
                  asChild 
                  className={`${action.color} text-primary-foreground h-auto py-4 flex-col gap-2`}
                >
                  <Link to={action.path}>
                    <action.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{action.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SEO Overview */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="w-5 h-5 text-primary" />
              SEO Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">
                Analyze and optimize your content for search engines
              </p>
              <Button variant="outline" asChild>
                <Link to="/admin/seo">Open SEO Tools</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Guide */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">🚀 Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-medium text-foreground">Create Categories</p>
                <p className="text-muted-foreground">Organize your blog posts</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-medium text-foreground">Write Blog Posts</p>
                <p className="text-muted-foreground">Create engaging content</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-medium text-foreground">Optimize SEO</p>
                <p className="text-muted-foreground">Improve search rankings</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <p className="font-medium text-foreground">Add Testimonials</p>
                <p className="text-muted-foreground">Build social proof</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}