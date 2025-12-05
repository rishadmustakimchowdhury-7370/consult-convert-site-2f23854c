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
  TrendingUp,
  Eye,
  Clock,
  Plus
} from 'lucide-react';

interface Stats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalPages: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [blogsResult, pagesResult] = await Promise.all([
        supabase.from('blogs').select('status'),
        supabase.from('pages').select('id'),
      ]);

      const blogs = blogsResult.data || [];
      const pages = pagesResult.data || [];

      setStats({
        totalBlogs: blogs.length,
        publishedBlogs: blogs.filter(b => b.status === 'published').length,
        draftBlogs: blogs.filter(b => b.status === 'draft').length,
        totalPages: pages.length,
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
      color: 'bg-primary/10 text-primary',
      link: '/admin/blogs'
    },
    { 
      title: 'Published', 
      value: stats.publishedBlogs, 
      icon: Eye, 
      color: 'bg-green-100 text-green-600',
      link: '/admin/blogs'
    },
    { 
      title: 'Drafts', 
      value: stats.draftBlogs, 
      icon: Clock, 
      color: 'bg-amber-100 text-amber-600',
      link: '/admin/blogs'
    },
    { 
      title: 'Pages', 
      value: stats.totalPages, 
      icon: Files, 
      color: 'bg-blue-100 text-blue-600',
      link: '/admin/pages'
    },
  ];

  const quickLinks = [
    { title: 'Add New Blog', icon: FilePlus, path: '/admin/blogs/new', color: 'bg-primary hover:bg-primary/90' },
    { title: 'Edit Pages', icon: Files, path: '/admin/pages', color: 'bg-secondary hover:bg-secondary/80' },
    { title: 'SEO Tools', icon: Search, path: '/admin/seo', color: 'bg-accent hover:bg-accent/90' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your admin panel</p>
        </div>
        <Button asChild>
          <Link to="/admin/blogs/new">
            <Plus className="w-4 h-4 mr-2" />
            New Blog
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickLinks.map((link) => (
              <Button key={link.path} asChild className={link.color}>
                <Link to={link.path}>
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.title}
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            SEO Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>SEO analytics and insights will appear here.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/admin/seo">Open SEO Tools</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
