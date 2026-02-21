import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSEOSettings } from '@/hooks/useSEOSettings';

interface SEOHeadProps {
  title?: string;
  description?: string;
}

export function SEOHead({ title, description }: SEOHeadProps) {
  const { settings, loading } = useSEOSettings();

  // Dynamically update favicon via DOM for reliability
  useEffect(() => {
    if (!settings?.favicon_url) return;

    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = settings.favicon_url;
  }, [settings?.favicon_url]);

  if (loading) return null;

  const discourageIndexing = settings?.discourage_search_engines ?? false;

  return (
    <Helmet>
      {discourageIndexing && (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </>
      )}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}
