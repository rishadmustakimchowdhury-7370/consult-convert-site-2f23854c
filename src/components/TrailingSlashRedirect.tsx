import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Enforces trailing slashes on all URLs.
 * Redirects /path to /path/ (except root "/" which already has one).
 */
export const TrailingSlashRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname, search, hash } = location;

    // Skip root path – it already ends with /
    if (pathname === '/') return;

    // If pathname doesn't end with /, redirect
    if (!pathname.endsWith('/')) {
      navigate(`${pathname}/${search}${hash}`, { replace: true });
    }
  }, [location, navigate]);

  return null;
};
