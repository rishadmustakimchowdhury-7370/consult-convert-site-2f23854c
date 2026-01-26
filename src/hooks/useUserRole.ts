import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'super_admin' | 'admin' | 'manager' | 'seo_manager' | 'editor' | 'user';

// Define which menu items each role can access
export const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  super_admin: [
    '/visage',
    '/visage/services',
    '/visage/projects',
    '/visage/invoices',
    '/visage/blogs',
    '/visage/categories',
    '/visage/pages',
    '/visage/testimonials',
    '/visage/menu',
    '/visage/media',
    '/visage/seo',
    '/visage/seo-verification',
    '/visage/footer',
    '/visage/team',
    '/visage/settings',
  ],
  admin: [
    '/visage',
    '/visage/services',
    '/visage/projects',
    '/visage/invoices',
    '/visage/blogs',
    '/visage/categories',
    '/visage/pages',
    '/visage/testimonials',
    '/visage/menu',
    '/visage/media',
    '/visage/seo',
    '/visage/seo-verification',
    '/visage/footer',
    '/visage/settings',
  ],
  manager: [
    '/visage',
    '/visage/services',
    '/visage/projects',
    '/visage/invoices',
    '/visage/blogs',
    '/visage/categories',
    '/visage/pages',
    '/visage/testimonials',
    '/visage/media',
  ],
  seo_manager: [
    '/visage',
    '/visage/blogs',
    '/visage/categories',
    '/visage/pages',
    '/visage/seo',
    '/visage/seo-verification',
  ],
  editor: [
    '/visage',
    '/visage/blogs',
    '/visage/categories',
    '/visage/pages',
    '/visage/media',
  ],
  user: [
    '/visage',
  ],
};

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.id) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        } else if (data) {
          setRole(data.role as AppRole);
        } else {
          setRole('user'); // Default role if none assigned
        }
      } catch (err) {
        console.error('Error in useUserRole:', err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user?.id]);

  const allowedPaths = role ? ROLE_PERMISSIONS[role] : [];
  
  const canAccess = (path: string): boolean => {
    if (!role) return false;
    
    // Normalize the path by removing trailing slash
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
    
    // Check each allowed path
    return allowedPaths.some(allowedPath => {
      // Exact match
      if (normalizedPath === allowedPath) return true;
      
      // For dashboard (/visage), only allow exact match
      if (allowedPath === '/visage') {
        return normalizedPath === '/visage';
      }
      
      // For other paths, allow sub-routes (e.g., /visage/blogs allows /visage/blogs/123)
      return normalizedPath.startsWith(allowedPath + '/');
    });
  };

  return { role, loading, allowedPaths, canAccess };
}
