import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SEOSettings {
  discourage_search_engines: boolean;
  global_meta_title: string | null;
  global_meta_description: string | null;
  favicon_url: string | null;
  logo_url: string | null;
  site_title: string | null;
  google_verification_meta: string | null;
  bing_verification_meta: string | null;
  google_analytics_script: string | null;
}

export function useSEOSettings() {
  const [settings, setSettings] = useState<SEOSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('discourage_search_engines, global_meta_title, global_meta_description, favicon_url, logo_url, site_title, google_verification_meta, bing_verification_meta, google_analytics_script')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setSettings({
          discourage_search_engines: data.discourage_search_engines ?? false,
          global_meta_title: data.global_meta_title,
          global_meta_description: data.global_meta_description,
          favicon_url: data.favicon_url,
          logo_url: data.logo_url,
          site_title: data.site_title,
          google_verification_meta: data.google_verification_meta,
          bing_verification_meta: data.bing_verification_meta,
          google_analytics_script: data.google_analytics_script,
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}
