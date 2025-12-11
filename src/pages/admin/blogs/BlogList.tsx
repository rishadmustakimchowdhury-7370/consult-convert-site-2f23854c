import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  Loader2,
  MoreHorizontal,
  ExternalLink,
  CheckCircle,
  FileText,
  Search,
} from 'lucide-react';
import { format } from 'date-fns';

interface Blog {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  author_name: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  categories?: { name: string } | null;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug, status, author_name, created_at, updated_at, published_at, categories(name)')
      .order('updated_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setBlogs((data as Blog[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Blog post deleted successfully.' });
      fetchBlogs();
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('blogs')
      .update({
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Updated', description: `Blog ${newStatus}.` });
      fetchBlogs();
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = blogs.filter((b) => b.status === 'published').length;
  const draftCount = blogs.filter((b) => b.status === 'draft').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage and create blog content</p>
        </div>
        <Button asChild size="lg">
          <Link to="/visage/blogs/new">
            <Plus className="w-5 h-5 mr-2" />
            New Blog Post
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{blogs.length}</p>
                <p className="text-sm text-muted-foreground">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{publishedCount}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-500/10">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{draftCount}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Blog Posts</CardTitle>
              <CardDescription>View, edit, and manage your blog content</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No blogs found' : 'No blog posts yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Get started by creating your first blog post'}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link to="/visage/blogs/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first blog
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[250px]">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-1">{blog.title}</p>
                          <p className="text-sm text-muted-foreground">/blog/{blog.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={blog.status === 'published' ? 'default' : 'secondary'}
                          className="cursor-pointer whitespace-nowrap"
                          onClick={() => toggleStatus(blog.id, blog.status)}
                        >
                          {blog.status === 'published' ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" /> Published
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" /> Draft
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {blog.author_name || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {blog.published_at
                          ? format(new Date(blog.published_at), 'MMM d, yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(blog.updated_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/visage/blogs/${blog.id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            {blog.status === 'published' && (
                              <DropdownMenuItem asChild>
                                <a
                                  href={`/blog/${blog.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Live
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => toggleStatus(blog.id, blog.status)}>
                              {blog.status === 'published' ? (
                                <>
                                  <Clock className="w-4 h-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{blog.title}"? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(blog.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
