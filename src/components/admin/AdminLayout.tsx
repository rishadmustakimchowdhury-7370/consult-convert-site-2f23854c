import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import AdminSidebar from './AdminSidebar';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const { role, loading: roleLoading, canAccess } = useUserRole();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Enable 10-minute inactivity timeout for admin users
  useInactivityTimeout(!!user && isAdmin);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/visage/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You don't have admin privileges. Please contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  // Check if user can access the current route
  const currentPath = location.pathname;
  const hasAccess = canAccess(currentPath);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {hasAccess ? (
          <Outlet />
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h1>
              <p className="text-muted-foreground mb-6">
                Your role <span className="font-medium text-foreground">({role?.replace('_', ' ')})</span> doesn't have permission to access this section.
              </p>
              <Button onClick={() => navigate('/visage')}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}