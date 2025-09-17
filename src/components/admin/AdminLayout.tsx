import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Settings, 
  Upload,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Produtos', href: '/admin/products', icon: Package },
    { name: 'Categorias', href: '/admin/categories', icon: Tag },
    { name: 'Upload de Arquivos', href: '/admin/uploads', icon: Upload },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-card border-r p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Admin</h2>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-6 left-6 right-6">
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-card lg:border-r">
        <div className="flex flex-col h-full p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
          <Button onClick={handleLogout} variant="outline" className="w-full mt-auto">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 bg-background border-b px-4 py-3 lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        <main className="p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}