import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Loader2, Facebook, Linkedin, Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

interface FooterSettings {
  site_title: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  contact_phone_secondary: string;
  contact_address: string;
  whatsapp_url: string;
  facebook_url: string;
  linkedin_url: string;
  instagram_url: string;
  pinterest_url: string;
}

export default function FooterSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [settings, setSettings] = useState<FooterSettings>({
    site_title: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    contact_phone_secondary: '',
    contact_address: '',
    whatsapp_url: '',
    facebook_url: '',
    linkedin_url: '',
    instagram_url: '',
    pinterest_url: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (data) {
      setSettings({
        site_title: data.site_title || '',
        site_description: data.site_description || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        contact_phone_secondary: data.contact_phone_secondary || '',
        contact_address: data.contact_address || '',
        whatsapp_url: data.whatsapp_url || '',
        facebook_url: data.facebook_url || '',
        linkedin_url: data.linkedin_url || '',
        instagram_url: data.instagram_url || '',
        pinterest_url: data.pinterest_url || '',
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    let error;
    if (existing) {
      const { error: updateError } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', existing.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert(settings);
      error = insertError;
    }

    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Footer settings saved successfully!' });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Footer Settings</h1>
          <p className="text-muted-foreground">Manage your website footer content</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Brand Section */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_title">Site Title / Brand Name</Label>
              <Input
                id="site_title"
                value={settings.site_title}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                placeholder="Manhateck"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_description">Footer Description</Label>
              <Textarea
                id="site_description"
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                placeholder="Delivering premium digital solutions that transform your business..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email Address</Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  placeholder="info@manhateck.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Primary Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="contact_phone"
                  value={settings.contact_phone}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  placeholder="+447426468550"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone_secondary">Secondary Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="contact_phone_secondary"
                  value={settings.contact_phone_secondary}
                  onChange={(e) => setSettings({ ...settings, contact_phone_secondary: e.target.value })}
                  placeholder="+8801839697370"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_address">Address</Label>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-3" />
                <Textarea
                  id="contact_address"
                  value={settings.contact_address}
                  onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                  placeholder="Suite A, 82 James Carter Road, Mildenhall..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_url">WhatsApp URL</Label>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <Input
                    id="whatsapp_url"
                    value={settings.whatsapp_url}
                    onChange={(e) => setSettings({ ...settings, whatsapp_url: e.target.value })}
                    placeholder="https://wa.me/447426468550"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <Input
                    id="facebook_url"
                    value={settings.facebook_url}
                    onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-700" />
                  <Input
                    id="linkedin_url"
                    value={settings.linkedin_url}
                    onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <Input
                    id="instagram_url"
                    value={settings.instagram_url}
                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinterest_url">Pinterest URL</Label>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-red-500 font-bold text-sm">P</span>
                  <Input
                    id="pinterest_url"
                    value={settings.pinterest_url}
                    onChange={(e) => setSettings({ ...settings, pinterest_url: e.target.value })}
                    placeholder="https://pinterest.com/yourprofile"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
