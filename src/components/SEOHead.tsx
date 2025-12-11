import { Helmet } from 'react-helmet-async';
import { useSEOSettings } from '@/hooks/useSEOSettings';

interface SEOHeadProps {
  title?: string;
  description?: string;
}

export function SEOHead({ title, description }: SEOHeadProps) {
  const { settings, loading } = useSEOSettings();

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
