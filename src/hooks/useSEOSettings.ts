import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SEOSettings {
  discourage_search_engines: boolean;
  global_meta_title: string | null;
  global_meta_description: string | null;
}

export function useSEOSettings() {
  const [settings, setSettings] = useState<SEOSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('discourage_search_engines, global_meta_title, global_meta_description')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setSettings({
          discourage_search_engines: data.discourage_search_engines ?? false,
          global_meta_title: data.global_meta_title,
          global_meta_description: data.global_meta_description,
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}
