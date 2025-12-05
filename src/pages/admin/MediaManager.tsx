import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
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
import { Upload, Copy, Trash2, Loader2, Image as ImageIcon, FileText } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string | null;
  size: number | null;
  created_at: string;
}

export default function MediaManager() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchMedia = async () => {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setMedia(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: 'Upload Error', description: uploadError.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(fileName);

    const { error: dbError } = await supabase.from('media').insert({
      name: file.name,
      url: publicUrl.publicUrl,
      type: file.type,
      size: file.size,
    });

    if (dbError) {
      toast({ title: 'Error', description: dbError.message, variant: 'destructive' });
    } else {
      toast({ title: 'Uploaded', description: 'File uploaded successfully.' });
      fetchMedia();
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (item: MediaFile) => {
    const fileName = item.url.split('/').pop();
    if (fileName) {
      await supabase.storage.from('media').remove([fileName]);
    }

    const { error } = await supabase.from('media').delete().eq('id', item.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'File deleted successfully.' });
      fetchMedia();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: 'Copied', description: 'URL copied to clipboard.' });
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const isImage = (type: string | null) => type?.startsWith('image/');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Media Manager</h1>
          <p className="text-muted-foreground">Upload and manage your media files</p>
        </div>
        <div className="relative">
          <Input
            type="file"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <Button asChild disabled={uploading}>
            <label htmlFor="file-upload" className="cursor-pointer">
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Upload File
            </label>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No media files yet.</p>
              <p className="text-sm">Upload your first file to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="group relative border rounded-lg overflow-hidden bg-secondary/30"
                >
                  {isImage(item.type) ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-secondary">
                      <FileText className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyUrl(item.url)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete File</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{item.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs font-medium truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(item.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
