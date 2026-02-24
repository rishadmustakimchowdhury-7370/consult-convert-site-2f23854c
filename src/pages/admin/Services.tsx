import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Pencil, Trash2, Eye, Code, X, FileText, Sparkles, ListOrdered, HelpCircle, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  content: string | null;
  cover_image: string | null;
  icon_name: string | null;
  features: Feature[];
  process_steps: ProcessStep[];
  faqs: FAQ[];
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

const iconOptions = [
  'Code', 'ShoppingCart', 'Palette', 'Globe', 'Search', 'Youtube', 
  'Megaphone', 'Video', 'Gauge', 'ShieldCheck', 'Pin', 'Mail', 'Bot', 'MessageCircle',
  'Smartphone', 'Zap', 'Award', 'Star', 'TrendingUp', 'Users', 'Clock', 'Shield'
];

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    content: '',
    cover_image: '',
    icon_name: 'Code',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    is_active: true,
    is_featured: false,
  });
  const [features, setFeatures] = useState<Feature[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching services', variant: 'destructive' });
    } else {
      const mappedServices = (data || []).map(s => ({
        ...s,
        features: Array.isArray(s.features) ? (s.features as unknown as Feature[]) : [],
        process_steps: Array.isArray(s.process_steps) ? (s.process_steps as unknown as ProcessStep[]) : [],
        faqs: Array.isArray(s.faqs) ? (s.faqs as unknown as FAQ[]) : [],
      }));
      setServices(mappedServices);
    }
    setIsLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviceData = {
      title: formData.title,
      slug: formData.slug,
      short_description: formData.short_description || null,
      content: formData.content || null,
      cover_image: formData.cover_image || null,
      icon_name: formData.icon_name,
      features: JSON.parse(JSON.stringify(features)),
      process_steps: JSON.parse(JSON.stringify(processSteps)),
      faqs: JSON.parse(JSON.stringify(faqs)),
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      canonical_url: formData.canonical_url || null,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      sort_order: editingService ? editingService.sort_order : services.length,
    };

    if (editingService) {
      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', editingService.id);

      if (error) {
        toast({ title: 'Error updating service', variant: 'destructive' });
      } else {
        toast({ title: 'Service updated successfully' });
      }
    } else {
      const { error } = await supabase
        .from('services')
        .insert(serviceData);

      if (error) {
        toast({ title: 'Error creating service', variant: 'destructive' });
      } else {
        toast({ title: 'Service created successfully' });
      }
    }

    resetForm();
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting service', variant: 'destructive' });
    } else {
      toast({ title: 'Service deleted successfully' });
      fetchServices();
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      short_description: service.short_description || '',
      content: service.content || '',
      cover_image: service.cover_image || '',
      icon_name: service.icon_name || 'Code',
      meta_title: service.meta_title || '',
      meta_description: service.meta_description || '',
      canonical_url: (service as any).canonical_url || '',
      is_active: service.is_active,
      is_featured: service.is_featured,
    });
    setFeatures(service.features || []);
    setProcessSteps(service.process_steps || []);
    setFaqs(service.faqs || []);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      short_description: '',
      content: '',
      cover_image: '',
      icon_name: 'Code',
      meta_title: '',
      meta_description: '',
      canonical_url: '',
      is_active: true,
      is_featured: false,
    });
    setFeatures([]);
    setProcessSteps([]);
    setFaqs([]);
    setIsDialogOpen(false);
  };

  const addFeature = () => {
    setFeatures([...features, { icon: 'Code', title: '', description: '' }]);
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addProcessStep = () => {
    setProcessSteps([...processSteps, { step: String(processSteps.length + 1), title: '', description: '' }]);
  };

  const updateProcessStep = (index: number, field: keyof ProcessStep, value: string) => {
    const updated = [...processSteps];
    updated[index] = { ...updated[index], [field]: value };
    setProcessSteps(updated);
  };

  const removeProcessStep = (index: number) => {
    setProcessSteps(processSteps.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const updateFaq = (index: number, field: keyof FAQ, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-1">Manage your service offerings</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">/services/{service.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    {service.is_featured && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Featured</span>
                    )}
                    {!service.is_active && (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">Inactive</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`/services/${service.slug}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {services.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No services yet. Click "Add Service" to create your first service.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Accordion type="multiple" defaultValue={['basic']} className="w-full">
              {/* Basic Information */}
              <AccordionItem value="basic">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Basic Information
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Service Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g., WordPress Web Design"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="wordpress-web-design"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <select
                      id="icon"
                      value={formData.icon_name}
                      onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      placeholder="Brief description shown on homepage..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Full Content (SEO Optimized)</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Use H2/H3 headings, add internal/external links, and include images with alt text for SEO
                    </p>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <ImageUpload
                      value={formData.cover_image}
                      onChange={(url) => setFormData({ ...formData, cover_image: url })}
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                      />
                      <Label htmlFor="is_featured">Featured on Homepage</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Features */}
              <AccordionItem value="features">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Features ({features.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="w-4 h-4 mr-1" /> Add Feature
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Feature {index + 1}</span>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <select
                              value={feature.icon}
                              onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                              className="px-3 py-2 border border-input rounded-md bg-background"
                            >
                              {iconOptions.map((icon) => (
                                <option key={icon} value={icon}>{icon}</option>
                              ))}
                            </select>
                            <Input
                              value={feature.title}
                              onChange={(e) => updateFeature(index, 'title', e.target.value)}
                              placeholder="Feature title"
                            />
                          </div>
                          <Textarea
                            value={feature.description}
                            onChange={(e) => updateFeature(index, 'description', e.target.value)}
                            placeholder="Feature description"
                            rows={2}
                          />
                        </CardContent>
                      </Card>
                    ))}
                    {features.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No features added yet</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Process Steps */}
              <AccordionItem value="process">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="w-5 h-5 text-primary" />
                    Process Steps ({processSteps.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={addProcessStep}>
                      <Plus className="w-4 h-4 mr-1" /> Add Step
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {processSteps.map((step, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Step {index + 1}</span>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeProcessStep(index)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <Input
                            value={step.title}
                            onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                            placeholder="Step title"
                          />
                          <Textarea
                            value={step.description}
                            onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                            placeholder="Step description"
                            rows={2}
                          />
                        </CardContent>
                      </Card>
                    ))}
                    {processSteps.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No process steps added yet</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* FAQs */}
              <AccordionItem value="faqs">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    FAQs ({faqs.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={addFaq}>
                      <Plus className="w-4 h-4 mr-1" /> Add FAQ
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">FAQ {index + 1}</span>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeFaq(index)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <Input
                            value={faq.question}
                            onChange={(e) => updateFaq(index, 'question', e.target.value)}
                            placeholder="Question"
                          />
                          <Textarea
                            value={faq.answer}
                            onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                            placeholder="Answer"
                            rows={3}
                          />
                        </CardContent>
                      </Card>
                    ))}
                    {faqs.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">No FAQs added yet</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* SEO Settings */}
              <AccordionItem value="seo">
                <AccordionTrigger className="text-base font-semibold">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    SEO Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      placeholder="SEO title (50-60 characters)"
                    />
                    <p className="text-xs text-muted-foreground">{formData.meta_title.length}/60 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      placeholder="SEO description (120-160 characters)"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">{formData.meta_description.length}/160 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="canonical_url">Canonical URL <span className="text-xs text-muted-foreground">(optional override)</span></Label>
                    <Input
                      id="canonical_url"
                      value={formData.canonical_url}
                      onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                      placeholder="https://manhateck.com/services/your-service-slug"
                    />
                    <p className="text-xs text-muted-foreground">Leave empty to auto-generate based on page URL.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
