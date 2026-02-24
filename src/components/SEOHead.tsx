import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSEOSettings } from '@/hooks/useSEOSettings';
import { useCanonicalUrl } from '@/hooks/useCanonicalUrl';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalOverride?: string | null;
}

export function SEOHead({ title, description, canonicalOverride }: SEOHeadProps) {
  const canonicalUrl = useCanonicalUrl(canonicalOverride);
  const { settings, loading } = useSEOSettings();

  // Dynamically update favicon via DOM for reliability
  useEffect(() => {
    if (!settings?.favicon_url) return;

    const faviconUrl = `${settings.favicon_url}${settings.favicon_url.includes('?') ? '&' : '?'}v=${Date.now()}`;

    // Update or create standard favicon
    const updateLink = (rel: string, type?: string) => {
      let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      if (type) link.type = type;
      link.href = faviconUrl;
    };

    updateLink('icon', 'image/png');
    updateLink('apple-touch-icon');

    // Also update shortcut icon for legacy browsers
    updateLink('shortcut icon', 'image/png');
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
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
