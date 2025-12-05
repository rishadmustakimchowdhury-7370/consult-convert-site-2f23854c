import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, Globe, Share2, Code } from 'lucide-react';

interface SiteSettings {
  id: string;
  logo_url: string | null;
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
      .update({
        logo_url: settings.logo_url,
        site_title: settings.site_title,
        site_description: settings.site_description,
        global_meta_title: settings.global_meta_title,
        global_meta_description: settings.global_meta_description,
        google_analytics_script: settings.google_analytics_script,
        facebook_url: settings.facebook_url,
        linkedin_url: settings.linkedin_url,
        pinterest_url: settings.pinterest_url,
        instagram_url: settings.instagram_url,
        whatsapp_url: settings.whatsapp_url,
      })
      .eq('id', settings.id);

    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved', description: 'Settings saved successfully.' });
    }
  };

  const updateField = (field: keyof SiteSettings, value: string) => {
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
          <TabsTrigger value="seo" className="gap-2">
            <Code className="w-4 h-4" />
            SEO & Analytics
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
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={settings.logo_url || ''}
                  onChange={(e) => updateField('logo_url', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                {settings.logo_url && (
                  <img
                    src={settings.logo_url}
                    alt="Logo preview"
                    className="h-16 object-contain mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input
                  id="site-title"
                  value={settings.site_title || ''}
                  onChange={(e) => updateField('site_title', e.target.value)}
                  placeholder="My Awesome Website"
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

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Analytics</CardTitle>
              <CardDescription>Global SEO settings and tracking scripts</CardDescription>
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
                <p className="text-xs text-muted-foreground">
                  Paste your complete Google Analytics tracking script here
                </p>
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
                    placeholder="+1234567890"
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
