import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://manhateck.com';

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
 * If a manual override is provided, it takes precedence.
 */
export function useCanonicalUrl(manualOverride?: string | null): string {
  const location = useLocation();

  if (manualOverride?.trim()) {
    return manualOverride.trim();
  }

  const cleanSearch = stripIgnoredParams(location.search);
  // Normalize: no trailing slash except for root
  let path = location.pathname.replace(/\/+$/, '') || '/';
  
  return `${BASE_URL}${path}${cleanSearch}`;
}
