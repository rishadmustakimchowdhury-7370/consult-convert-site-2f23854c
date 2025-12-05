import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Loader2 } from 'lucide-react';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  
  // Enable 10-minute inactivity timeout for admin users
  useInactivityTimeout(!!user && isAdmin);

  if (loading) {
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

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
