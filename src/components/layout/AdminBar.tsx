import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Shield, 
  Package, 
  Boxes, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  LayoutDashboard 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Productos', href: '/products', icon: Package },
  { name: 'Inventario', href: '/inventory', icon: Boxes },
  { name: 'Facturación', href: '/invoices', icon: FileText },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'Ajustes', href: '/settings', icon: Settings },
];

export function AdminBar() {
  const { hasRole } = useAuth();
  const location = useLocation();

  // Only show for admin users
  if (!hasRole('admin')) return null;

  return (
    <div className="sticky top-0 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-border pl-64">
      <div className="flex items-center h-12 px-4 overflow-x-auto">
        <div className="flex items-center gap-2 mr-4 pr-4 border-r border-sidebar-border flex-shrink-0">
          <Shield className="h-4 w-4 text-warning" />
          <span className="text-xs font-semibold uppercase tracking-wider text-warning">Admin</span>
        </div>
        <nav className="flex items-center gap-1">
          {adminLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex-shrink-0',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <link.icon className="h-3.5 w-3.5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
