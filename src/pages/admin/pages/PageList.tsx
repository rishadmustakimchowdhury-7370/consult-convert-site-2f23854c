import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
import { Plus, Edit, Trash2, Eye, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  updated_at: string;
}

export default function PageList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from('pages')
      .select('id, title, slug, status, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setPages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('pages').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Page deleted successfully.' });
      fetchPages();
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const { error } = await supabase
      .from('pages')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Updated', description: `Page ${newStatus}.` });
      fetchPages();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Pages</h1>
          <p className="text-muted-foreground">Manage your website pages</p>
        </div>
        <Button asChild>
          <Link to="/admin/pages/new">
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No pages yet.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/admin/pages/new">Create your first page</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{page.title}</p>
                        <p className="text-sm text-muted-foreground">/{page.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={page.status === 'published' ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => toggleStatus(page.id, page.status)}
                      >
                        {page.status === 'published' ? (
                          <><Eye className="w-3 h-3 mr-1" /> Published</>
                        ) : (
                          <><Clock className="w-3 h-3 mr-1" /> Draft</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(page.updated_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/pages/${page.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Page</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{page.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(page.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
