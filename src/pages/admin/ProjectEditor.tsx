import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2, Upload, Trash2, FileIcon } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface ProjectFile {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
}

const statusOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<ProjectFile[]>([]);

  type ProjectStatus = 'lead' | 'proposal' | 'approved' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  
  const [formData, setFormData] = useState<{
    project_name: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    project_description: string;
    cover_image: string;
    status: ProjectStatus;
    creation_date: string;
    delivery_date: string;
    earning_amount: number;
    cost_amount: number;
    is_public: boolean;
  }>({
    project_name: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    project_description: '',
    cover_image: '',
    status: 'lead',
    creation_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    earning_amount: 0,
    cost_amount: 0,
    is_public: false,
  });

  useEffect(() => {
    if (isEditing) {
      fetchProject();
      fetchFiles();
    }
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      navigate('/admin/projects');
    } else if (data) {
      setFormData({
        project_name: data.project_name || '',
        client_name: data.client_name || '',
        client_email: data.client_email || '',
        client_phone: data.client_phone || '',
        project_description: data.project_description || '',
        cover_image: data.cover_image || '',
        status: (data.status as ProjectStatus) || 'lead',
        creation_date: data.creation_date || new Date().toISOString().split('T')[0],
        delivery_date: data.delivery_date || '',
        earning_amount: data.earning_amount || 0,
        cost_amount: data.cost_amount || 0,
        is_public: data.is_public || false,
      });
    }
    setLoading(false);
  };

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    if (data) {
      setFiles(data);
    }
  };

  const handleSave = async () => {
    if (!formData.project_name || !formData.client_name) {
      toast({ title: 'Error', description: 'Project name and client name are required.', variant: 'destructive' });
      return;
    }

    setSaving(true);

    let savedId = id;
    
    const projectData = {
      project_name: formData.project_name,
      client_name: formData.client_name,
      client_email: formData.client_email || null,
      client_phone: formData.client_phone || null,
      project_description: formData.project_description || null,
      cover_image: formData.cover_image || null,
      status: formData.status as 'lead' | 'proposal' | 'approved' | 'in_progress' | 'review' | 'completed' | 'cancelled',
      creation_date: formData.creation_date,
      delivery_date: formData.delivery_date || null,
      earning_amount: Number(formData.earning_amount),
      cost_amount: Number(formData.cost_amount),
      is_public: formData.is_public,
    };

    if (isEditing) {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        setSaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select('id')
        .single();

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        setSaving(false);
        return;
      }
      savedId = data.id;
    }

    setSaving(false);
    toast({ title: 'Saved', description: 'Project saved successfully.' });
    
    if (!isEditing && savedId) {
      navigate(`/admin/projects/${savedId}`);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!id || !event.target.files?.length) return;

    setUploading(true);
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: 'Error', description: uploadError.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-files')
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from('project_files')
      .insert({
        project_id: id,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
      });

    if (dbError) {
      toast({ title: 'Error', description: dbError.message, variant: 'destructive' });
    } else {
      toast({ title: 'Uploaded', description: 'File uploaded successfully.' });
      fetchFiles();
    }
    setUploading(false);
  };

  const handleDeleteFile = async (fileId: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    // Extract path from URL
    const urlParts = fileUrl.split('/project-files/');
    if (urlParts.length > 1) {
      await supabase.storage.from('project-files').remove([urlParts[1]]);
    }

    const { error } = await supabase
      .from('project_files')
      .delete()
      .eq('id', fileId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'File deleted successfully.' });
      fetchFiles();
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const profit = Number(formData.earning_amount) - Number(formData.cost_amount);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/projects')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold">
              {isEditing ? 'Edit Project' : 'New Project'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update project details' : 'Create a new project'}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Basic project information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name *</Label>
                <Input
                  id="project_name"
                  value={formData.project_name}
                  onChange={(e) => updateField('project_name', e.target.value)}
                  placeholder="Enter project name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_description">Description</Label>
                <Textarea
                  id="project_description"
                  value={formData.project_description}
                  onChange={(e) => updateField('project_description', e.target.value)}
                  placeholder="Project description..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <ImageUpload
                  value={formData.cover_image}
                  onChange={(url) => updateField('cover_image', url)}
                  folder="projects"
                  aspectRatio="video"
                  recommendedSize="1200 x 675px (16:9 ratio)"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Client contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Client Name *</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => updateField('client_name', e.target.value)}
                    placeholder="Client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_email">Client Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => updateField('client_email', e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_phone">Client Phone</Label>
                  <Input
                    id="client_phone"
                    value={formData.client_phone}
                    onChange={(e) => updateField('client_phone', e.target.value)}
                    placeholder="+44..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
              <CardDescription>Track project finances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="earning_amount">Earning Amount (£)</Label>
                  <Input
                    id="earning_amount"
                    type="number"
                    value={formData.earning_amount}
                    onChange={(e) => updateField('earning_amount', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost_amount">Cost Amount (£)</Label>
                  <Input
                    id="cost_amount"
                    type="number"
                    value={formData.cost_amount}
                    onChange={(e) => updateField('cost_amount', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profit (£)</Label>
                  <div className={`p-2 rounded-md border ${profit >= 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    <span className="font-bold">£{profit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files Section - Only show when editing */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Project Files</CardTitle>
                <CardDescription>Upload client documents (PDF, DOC, images)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="flex-1"
                  />
                  {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileIcon className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <a 
                              href={file.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-medium hover:underline"
                            >
                              {file.file_name}
                            </a>
                            {file.file_size && (
                              <p className="text-xs text-muted-foreground">
                                {(file.file_size / 1024).toFixed(1)} KB
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteFile(file.id, file.file_url)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creation_date">Creation Date</Label>
                <Input
                  id="creation_date"
                  type="date"
                  value={formData.creation_date}
                  onChange={(e) => updateField('creation_date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_date">Delivery Date</Label>
                <Input
                  id="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) => updateField('delivery_date', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show in Portfolio</Label>
                  <p className="text-sm text-muted-foreground">Display on public website</p>
                </div>
                <Switch
                  checked={formData.is_public}
                  onCheckedChange={(checked) => updateField('is_public', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
