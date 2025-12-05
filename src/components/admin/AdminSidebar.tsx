import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Files,
  Image,
  Settings,
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Quote,
  ExternalLink,
  Briefcase,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
  { icon: Briefcase, label: 'Services', path: '/admin/services' },
  { icon: FileText, label: 'Blog Posts', path: '/admin/blogs' },
  { icon: FolderOpen, label: 'Categories', path: '/admin/categories' },
  { icon: Files, label: 'Pages', path: '/admin/pages' },
  { icon: Quote, label: 'Testimonials', path: '/admin/testimonials' },
  { icon: Menu, label: 'Menu Manager', path: '/admin/menu' },
  { icon: Image, label: 'Media', path: '/admin/media' },
  { icon: Search, label: 'SEO Tools', path: '/admin/seo' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'bg-card border-r border-border h-screen sticky top-0 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">A</span>
            </div>
            <span className="font-heading font-bold text-lg">Admin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && 'mx-auto')}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/admin' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                'hover:bg-primary/10 hover:text-primary',
                isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border space-y-1">
        <Link
          to="/"
          target="_blank"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-muted-foreground',
            'hover:bg-muted hover:text-foreground',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'View Site' : undefined}
        >
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">View Site</span>}
        </Link>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10',
            collapsed && 'justify-center px-2'
          )}
          onClick={signOut}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
