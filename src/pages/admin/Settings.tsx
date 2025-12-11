import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, Globe, Share2, Code, Mail, Image, AlertTriangle, CheckCircle } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SiteSettings {
  id: string;
  logo_url: string | null;
  favicon_url: string | null;
  logo_width: number | null;
  logo_height: number | null;
  site_title: string | null;
  site_description: string | null;
  global_meta_title: string | null;
  global_meta_description: string | null;
  google_analytics_script: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  pinterest_url: string | null;
  instagram_url: string | null;
  whatsapp_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_phone_secondary: string | null;
  contact_address: string | null;
  admin_email: string | null;
  discourage_search_engines: boolean | null;
}

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        setSettings(data);
      }
      setLoading(false);
    };

    fetchSettings();
  }, [toast]);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', settings.id);

    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved', description: 'Settings saved successfully.' });
    }
  };

  const updateField = (field: keyof SiteSettings, value: string | number | boolean | null) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">No settings found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your website settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Image className="w-4 h-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Code className="w-4 h-4" />
            SEO & Analytics
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Mail className="w-4 h-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="w-4 h-4" />
            Social Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic website information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input
                  id="site-title"
                  value={settings.site_title || ''}
                  onChange={(e) => updateField('site_title', e.target.value)}
                  placeholder="Manhateck"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={settings.site_description || ''}
                  onChange={(e) => updateField('site_description', e.target.value)}
                  placeholder="A brief description of your website"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Logo and favicon settings. Recommended logo size: 180x60px for optimal display.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Logo</Label>
                <ImageUpload
                  value={settings.logo_url || ''}
                  onChange={(url) => updateField('logo_url', url)}
                  folder="branding"
                  aspectRatio="auto"
                  recommendedSize="180 x 60px (3:1 ratio)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo-width">Logo Width (px)</Label>
                  <Input
                    id="logo-width"
                    type="number"
                    value={settings.logo_width || 180}
                    onChange={(e) => updateField('logo_width', parseInt(e.target.value) || 180)}
                    placeholder="180"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo-height">Logo Height (px)</Label>
                  <Input
                    id="logo-height"
                    type="number"
                    value={settings.logo_height || 60}
                    onChange={(e) => updateField('logo_height', parseInt(e.target.value) || 60)}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Favicon</Label>
                <p className="text-sm text-muted-foreground mb-2">Recommended size: 32x32px or 64x64px (square)</p>
                <ImageUpload
                  value={settings.favicon_url || ''}
                  onChange={(url) => updateField('favicon_url', url)}
                  folder="branding"
                  aspectRatio="square"
                  recommendedSize="32 x 32px or 64 x 64px (1:1 ratio)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <div className="space-y-6">
            {/* Search Engine Visibility Card */}
            <Card className={settings.discourage_search_engines ? 'border-destructive' : 'border-green-500'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {settings.discourage_search_engines ? (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  Search Engine Visibility
                </CardTitle>
                <CardDescription>Control whether search engines can index your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant={settings.discourage_search_engines ? 'destructive' : 'default'} className={!settings.discourage_search_engines ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}>
                  <AlertTitle className="flex items-center gap-2">
                    Status: {settings.discourage_search_engines ? 'NOT VISIBLE' : 'VISIBLE'} to Google
                  </AlertTitle>
                  <AlertDescription>
                    {settings.discourage_search_engines 
                      ? 'Your website is currently hidden from search engines. Pages have noindex/nofollow meta tags and robots.txt blocks crawlers.'
                      : 'Your website is visible to search engines. Google and other crawlers can index your content.'}
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="discourage-search-engines" className="text-base font-medium">
                      Discourage Search Engines from Crawling This Website
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, adds noindex/nofollow meta tags and updates robots.txt to block crawlers.
                    </p>
                  </div>
                  <Switch
                    id="discourage-search-engines"
                    checked={settings.discourage_search_engines || false}
                    onCheckedChange={(checked) => updateField('discourage_search_engines', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Meta Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Global Meta Settings</CardTitle>
                <CardDescription>Default SEO settings applied across all pages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="global-meta-title">
                    Global Meta Title <span className="text-muted-foreground">({(settings.global_meta_title || '').length}/60)</span>
                  </Label>
                  <Input
                    id="global-meta-title"
                    value={settings.global_meta_title || ''}
                    onChange={(e) => updateField('global_meta_title', e.target.value)}
                    placeholder="Default page title for SEO"
                    maxLength={70}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="global-meta-description">
                    Global Meta Description <span className="text-muted-foreground">({(settings.global_meta_description || '').length}/160)</span>
                  </Label>
                  <Textarea
                    id="global-meta-description"
                    value={settings.global_meta_description || ''}
                    onChange={(e) => updateField('global_meta_description', e.target.value)}
                    placeholder="Default meta description for SEO"
                    maxLength={170}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ga-script">Google Analytics Script</Label>
                  <Textarea
                    id="ga-script"
                    value={settings.google_analytics_script || ''}
                    onChange={(e) => updateField('google_analytics_script', e.target.value)}
                    placeholder="<!-- Paste your Google Analytics script here -->"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your business contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => updateField('contact_email', e.target.value)}
                    placeholder="info@manhateck.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email (for notifications)</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={settings.admin_email || ''}
                    onChange={(e) => updateField('admin_email', e.target.value)}
                    placeholder="admin@manhateck.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Primary Phone</Label>
                  <Input
                    id="contact-phone"
                    value={settings.contact_phone || ''}
                    onChange={(e) => updateField('contact_phone', e.target.value)}
                    placeholder="+447426468550"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone-secondary">Secondary Phone</Label>
                  <Input
                    id="contact-phone-secondary"
                    value={settings.contact_phone_secondary || ''}
                    onChange={(e) => updateField('contact_phone_secondary', e.target.value)}
                    placeholder="+8801839697370"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-address">Address</Label>
                <Textarea
                  id="contact-address"
                  value={settings.contact_address || ''}
                  onChange={(e) => updateField('contact_address', e.target.value)}
                  placeholder="Suite A, 82 James Carter Road, Mildenhall..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    value={settings.facebook_url || ''}
                    onChange={(e) => updateField('facebook_url', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={settings.linkedin_url || ''}
                    onChange={(e) => updateField('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={settings.instagram_url || ''}
                    onChange={(e) => updateField('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pinterest">Pinterest URL</Label>
                  <Input
                    id="pinterest"
                    value={settings.pinterest_url || ''}
                    onChange={(e) => updateField('pinterest_url', e.target.value)}
                    placeholder="https://pinterest.com/yourprofile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={settings.whatsapp_url || ''}
                    onChange={(e) => updateField('whatsapp_url', e.target.value)}
                    placeholder="+447426468550"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
