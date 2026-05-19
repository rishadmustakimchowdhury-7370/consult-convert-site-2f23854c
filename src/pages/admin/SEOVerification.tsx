import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, Upload, Trash2, Globe, FileCode, Link as LinkIcon, CheckCircle2, XCircle, ExternalLink, RefreshCw } from 'lucide-react';

/**
 * Live status panel for an uploaded verification file.
 * Shows the public URL the file WILL be served at (domain root after
 * publish) and pings it to confirm it is actually reachable with 200.
 */
function VerificationFileStatus({
  storageUrl,
  onDelete,
  accent,
}: {
  storageUrl: string;
  onDelete: () => void;
  accent: string;
}) {
  const fileName = storageUrl.split('/').pop()?.split('?')[0] ?? '';
  const publicUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${fileName}`
      : `/${fileName}`;
  const [status, setStatus] = useState<'idle' | 'checking' | 'ok' | 'fail'>('idle');
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const check = async () => {
    setStatus('checking');
    try {
      const res = await fetch(publicUrl, { cache: 'no-store' });
      setStatusCode(res.status);
      setStatus(res.ok ? 'ok' : 'fail');
    } catch {
      setStatus('fail');
      setStatusCode(null);
    }
  };

  return (
    <div className="p-3 bg-muted rounded-lg mt-2 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <FileCode className={`w-5 h-5 shrink-0 ${accent}`} />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1 truncate"
            >
              <LinkIcon className="w-3 h-3 shrink-0" />
              <span className="truncate">{publicUrl}</span>
            </a>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" asChild>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" aria-label="Open file">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
            aria-label="Delete file"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={check} disabled={status === 'checking'}>
          {status === 'checking' ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3 mr-1" />
          )}
          Test HTTP accessibility
        </Button>
        {status === 'ok' && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> HTTP {statusCode} — file is live
          </span>
        )}
        {status === 'fail' && (
          <span className="text-xs text-destructive flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            {statusCode ? `HTTP ${statusCode}` : 'Unreachable'} — republish required
          </span>
        )}
      </div>
    </div>
  );
}

/** Extracts a verification code from a full meta tag string. */
function extractVerificationCode(raw: string): string {
  if (!raw) return '';
  const match = raw.match(/content\s*=\s*["']([^"']+)["']/i);
  return (match?.[1] ?? raw).trim();
}


interface VerificationSettings {
  id: string;
  google_verification_meta: string | null;
  bing_verification_meta: string | null;
  google_verification_file: string | null;
  bing_verification_file: string | null;
}

export default function SEOVerification() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'google' | 'bing' | null>(null);
  const [settings, setSettings] = useState<VerificationSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('id, google_verification_meta, bing_verification_meta, google_verification_file, bing_verification_file')
      .limit(1)
      .maybeSingle();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .update({
        google_verification_meta: settings.google_verification_meta,
        bing_verification_meta: settings.bing_verification_meta,
        google_verification_file: settings.google_verification_file,
        bing_verification_file: settings.bing_verification_file,
      })
      .eq('id', settings.id);

    setSaving(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved', description: 'Verification settings saved successfully.' });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'google' | 'bing') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['text/html', 'application/json', 'text/xml', 'application/xml'];
    const validExtensions = ['.html', '.json', '.xml', '.txt'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!validTypes.includes(file.type) && !hasValidExtension) {
      toast({ title: 'Invalid File', description: 'Please upload an HTML, JSON, or XML file.', variant: 'destructive' });
      return;
    }

    setUploading(type);

    const fileName = file.name;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('seo-verification')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({ title: 'Upload Error', description: uploadError.message, variant: 'destructive' });
      setUploading(null);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('seo-verification')
      .getPublicUrl(fileName);

    if (settings) {
      const field = type === 'google' ? 'google_verification_file' : 'bing_verification_file';
      setSettings({ ...settings, [field]: publicUrl });
    }

    toast({ title: 'Uploaded', description: `${file.name} uploaded successfully.` });
    setUploading(null);
  };

  const handleDeleteFile = async (type: 'google' | 'bing') => {
    if (!settings) return;

    const field = type === 'google' ? 'google_verification_file' : 'bing_verification_file';
    const fileUrl = settings[field];
    
    if (fileUrl) {
      const fileName = fileUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('seo-verification').remove([fileName]);
      }
    }

    setSettings({ ...settings, [field]: null });
    toast({ title: 'Deleted', description: 'Verification file removed.' });
  };

  const updateField = (field: keyof VerificationSettings, value: string | null) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  /** Auto-extracts the verification code from a pasted full meta tag. */
  const handleMetaPaste = (
    field: 'google_verification_meta' | 'bing_verification_meta',
    value: string,
  ) => {
    const cleaned = extractVerificationCode(value);
    updateField(field, cleaned);
  };

  /** Checks the live site to confirm the verification meta tag is rendered. */
  const testVerification = async (type: 'google' | 'bing') => {
    const code = extractVerificationCode(
      (type === 'google'
        ? settings?.google_verification_meta
        : settings?.bing_verification_meta) || '',
    );
    if (!code) {
      toast({ title: 'No code', description: 'Save a verification code first.', variant: 'destructive' });
      return;
    }
    const name = type === 'google' ? 'google-site-verification' : 'msvalidate.01';
    const found = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (found && found.content === code) {
      toast({ title: 'Verified ✓', description: `${name} renders correctly in <head>.` });
    } else {
      toast({
        title: 'Not detected',
        description: `Meta tag missing or mismatched. Reload the public site after saving.`,
        variant: 'destructive',
      });
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
          <h1 className="text-3xl font-heading font-bold">SEO Verification</h1>
          <p className="text-muted-foreground">
            Configure Google and Bing Search Console verification
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Google Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Google Search Console
            </CardTitle>
            <CardDescription>
              Verify your website with Google Search Console using meta tag or file upload
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="google-meta">Paste Google Meta Tag Here</Label>
              <Textarea
                id="google-meta"
                value={settings.google_verification_meta || ''}
                onChange={(e) => updateField('google_verification_meta', e.target.value)}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData('text');
                  if (/<meta\s/i.test(pasted)) {
                    e.preventDefault();
                    handleMetaPaste('google_verification_meta', pasted);
                  }
                }}
                placeholder='<meta name="google-site-verification" content="YOUR_CODE" /> or just the code'
                rows={2}
                className="font-mono text-sm"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Paste the full meta tag — we auto-extract the code.
                </p>
                <Button variant="outline" size="sm" onClick={() => testVerification('google')}>
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Test Verification
                </Button>
              </div>
            </div>


            <div className="space-y-2">
              <Label>File Verification</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".html,.json,.xml,.txt"
                  onChange={(e) => handleFileUpload(e, 'google')}
                  disabled={uploading === 'google'}
                  className="flex-1"
                />
                {uploading === 'google' && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              {settings.google_verification_file && (
                <VerificationFileStatus
                  storageUrl={settings.google_verification_file}
                  onDelete={() => handleDeleteFile('google')}
                  accent="text-blue-500"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Upload the HTML verification file from Google Search Console (e.g., google1234567890.html).
                <br />
                <strong>After uploading, click Publish</strong> — the file is written into the site root at build time.
              </p>
            </div>
          </CardContent>
        </Card>


        {/* Bing Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-500" />
              Bing Webmaster Tools
            </CardTitle>
            <CardDescription>
              Verify your website with Bing Webmaster Tools using meta tag or file upload
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bing-meta">Paste Bing Meta Tag Here</Label>
              <Textarea
                id="bing-meta"
                value={settings.bing_verification_meta || ''}
                onChange={(e) => updateField('bing_verification_meta', e.target.value)}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData('text');
                  if (/<meta\s/i.test(pasted)) {
                    e.preventDefault();
                    handleMetaPaste('bing_verification_meta', pasted);
                  }
                }}
                placeholder='<meta name="msvalidate.01" content="YOUR_CODE" /> or just the code'
                rows={2}
                className="font-mono text-sm"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Paste the full meta tag — we auto-extract the code.
                </p>
                <Button variant="outline" size="sm" onClick={() => testVerification('bing')}>
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Test Verification
                </Button>
              </div>
            </div>


            <div className="space-y-2">
              <Label>File Verification</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".html,.json,.xml,.txt"
                  onChange={(e) => handleFileUpload(e, 'bing')}
                  disabled={uploading === 'bing'}
                  className="flex-1"
                />
                {uploading === 'bing' && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              {settings.bing_verification_file && (
                <VerificationFileStatus
                  storageUrl={settings.bing_verification_file}
                  onDelete={() => handleDeleteFile('bing')}
                  accent="text-cyan-500"
                />
              )}
              <p className="text-xs text-muted-foreground">
                Upload the XML verification file from Bing Webmaster Tools.
                <br />
                <strong>After uploading, click Publish</strong> — the file is written into the site root at build time.
              </p>

            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Meta Tag Verification</h4>
              <p>
                Meta tags are automatically added to all pages' &lt;head&gt; section. After saving, 
                verify ownership in Google/Bing Search Console.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">File Verification</h4>
              <p>
                Uploaded files are publicly accessible. Copy the file URL and use it in Google/Bing 
                Search Console for verification.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
