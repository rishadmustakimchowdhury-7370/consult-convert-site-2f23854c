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

/**
 * Extracts the content attribute value from a meta tag string.
 * e.g. '<meta name="google-site-verification" content="abc123" />' → 'abc123'
 */
function extractMetaContent(tag: string | null): string | null {
  if (!tag) return null;
  const match = tag.match(/content\s*=\s*["']([^"']+)["']/i);
  return match?.[1] || null;
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

  // Inject Google Analytics script
  useEffect(() => {
    if (!settings?.google_analytics_script) return;
    
    const existingScript = document.getElementById('ga-script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'ga-script';
    script.innerHTML = settings.google_analytics_script;
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('ga-script');
      if (el) el.remove();
    };
  }, [settings?.google_analytics_script]);

  if (loading) return null;

  const discourageIndexing = settings?.discourage_search_engines ?? false;

  const finalTitle = title || settings?.global_meta_title || 'Manha Teck';
  const finalDescription = description || settings?.global_meta_description || '';
  const finalImage = ogImage || settings?.logo_url || '';
  const siteName = settings?.site_title || 'Manha Teck';

  // Extract verification codes
  const googleVerification = extractMetaContent(settings?.google_verification_meta ?? null);
  const bingVerification = extractMetaContent(settings?.bing_verification_meta ?? null);

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

      {/* Search Engine Verification */}
      {googleVerification && (
        <meta name="google-site-verification" content={googleVerification} />
      )}
      {bingVerification && (
        <meta name="msvalidate.01" content={bingVerification} />
      )}
    </Helmet>
  );
}
