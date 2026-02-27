import { useLocation } from 'react-router-dom';

// Params to strip from canonical URLs
const IGNORED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref', 'mc_cid', 'mc_eid'];

function stripIgnoredParams(search: string): string {
  if (!search) return '';
  const params = new URLSearchParams(search);
  IGNORED_PARAMS.forEach(p => params.delete(p));
  const remaining = params.toString();
  return remaining ? `?${remaining}` : '';
}

/**
 * Returns the canonical URL for the current page.
 * Always uses https://manhateck.com as the production domain.
 * Trailing slash is always enforced.
 */
export function useCanonicalUrl(): string {
  const location = useLocation();

  const origin = 'https://manhateck.com';
  const cleanSearch = stripIgnoredParams(location.search);
  // Normalize: always include trailing slash
  let path = location.pathname.replace(/\/+$/, '') || '';
  path = path === '' ? '/' : `${path}/`;
  
  return `${origin}${path}${cleanSearch}`;
}
