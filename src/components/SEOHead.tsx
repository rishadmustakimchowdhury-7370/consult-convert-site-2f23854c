import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSEOSettings } from '@/hooks/useSEOSettings';
import { useCanonicalUrl } from '@/hooks/useCanonicalUrl';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalOverride?: string | null;
  ogImage?: string | null;
  ogType?: string;
}

export function SEOHead({ title, description, canonicalOverride, ogImage, ogType = 'website' }: SEOHeadProps) {
  const canonicalUrl = useCanonicalUrl(canonicalOverride);
  const { settings, loading } = useSEOSettings();

  // Dynamically update favicon via DOM for reliability
  useEffect(() => {
    if (!settings?.favicon_url) return;

    const faviconUrl = `${settings.favicon_url}${settings.favicon_url.includes('?') ? '&' : '?'}v=${Date.now()}`;

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
    updateLink('shortcut icon', 'image/png');
  }, [settings?.favicon_url]);

  if (loading) return null;

  const discourageIndexing = settings?.discourage_search_engines ?? false;

  const finalTitle = title || settings?.global_meta_title || 'Manha Teck';
  const finalDescription = description || settings?.global_meta_description || '';
  const finalImage = ogImage || settings?.logo_url || '';
  const siteName = settings?.site_title || 'Manha Teck';

  return (
    <Helmet>
      {/* Robots */}
      {discourageIndexing ? (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
        </>
      ) : (
        <>
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
        </>
      )}

      {/* Title & Description */}
      <title>{finalTitle}</title>
      {finalDescription && <meta name="description" content={finalDescription} />}

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      {finalDescription && <meta property="og:description" content={finalDescription} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      {finalImage && <meta property="og:image" content={finalImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={finalImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={finalTitle} />
      {finalDescription && <meta name="twitter:description" content={finalDescription} />}
      {finalImage && <meta name="twitter:image" content={finalImage} />}
    </Helmet>
  );
}
