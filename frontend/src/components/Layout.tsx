import React from 'react';
import { 
  Home, 
  Users, 
  Package, 
  Scissors, 
  Settings, 
  PlusCircle,
  Menu,
  Bell,
  X,
  User,
  LogOut
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/utils/cn';
import { ScissorsTransition } from './animations/ScissorsTransition';
import { MiniTailoringLoader } from './animations/TailoringLoader';
import { usePageTransition } from '@/hooks/usePageTransition';
import { useAuthStore } from '@/store/auth';
import { User as UserType, UserRole } from '@/types';
import { NotificationBell } from './NotificationCenter';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  user: UserType | null;
}

const tailorSidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'designs', label: 'Designs', icon: Scissors },
  { id: 'profile', label: 'Profile', icon: User },
];

const customerSidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'designs', label: 'Browse Designs', icon: Scissors },
  { id: 'profile', label: 'Profile', icon: User },
];

export function Layout({ children, currentPage, onPageChange, user }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { isTransitioning, transitionToPage } = usePageTransition();
  const { logout } = useAuthStore();
  
  const sidebarItems = user?.role === UserRole.TAILOR ? tailorSidebarItems : customerSidebarItems;

  const handlePageChange = (pageId: string) => {
    if (pageId !== currentPage) {
      transitionToPage(pageId, onPageChange);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Scissors Transition */}
      <ScissorsTransition 
        isActive={isTransitioning} 
        onComplete={() => {}} 
      />

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Scissors className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-bold text-foreground">Darzee</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <NotificationBell />
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              <span className="text-xs font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Desktop Brand Header */}
        <div className="hidden lg:flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Scissors className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Darzee</h1>
              <p className="text-xs text-muted-foreground">
                {user?.role === UserRole.TAILOR ? user.shopName || 'Tailor Dashboard' : 'Customer Portal'}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Header in Sidebar */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Scissors className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Darzee</h1>
              <p className="text-xs text-muted-foreground">
                {user?.role === UserRole.TAILOR ? user.shopName || 'Tailor' : 'Customer'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="w-9 h-9"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="p-4">
          {isTransitioning && (
            <div className="flex justify-center py-4 mb-4">
              <SimpleLoader size="md" text="Loading..." />
            </div>
          )}
          
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handlePageChange(item.id)}
                    disabled={isTransitioning}
                    className={cn(
                      "w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gold text-navy shadow-sm"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-navy rounded-full ml-auto flex-shrink-0"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* User Actions */}
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          {user?.role === UserRole.TAILOR && (
            <Button
              className="w-full"
              onClick={() => handlePageChange('new-order')}
              disabled={isTransitioning}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Order
            </Button>
          )}
          
          {/* User Info & Logout */}
          <div className="bg-accent rounded-lg p-3">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-72">
        {/* Desktop Header */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between w-full px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground capitalize">
                {currentPage === 'new-order' ? 'New Order' : currentPage}
              </h1>
              {isTransitioning && (
                <div className="mt-2 flex items-center space-x-2">
                  <MiniTailoringLoader className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                  <span className="text-sm font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className={cn(
          "p-4 lg:p-6 transition-opacity duration-300",
          isTransitioning ? "opacity-50" : "opacity-100"
        )}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}