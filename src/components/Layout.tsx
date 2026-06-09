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
  X
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/utils/cn';
import { ScissorsTransition } from './animations/ScissorsTransition';
import { SimpleLoader } from './animations/SimpleLoader';
import { usePageTransition } from '@/hooks/usePageTransition';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'designs', label: 'Designs', icon: Scissors },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { isTransitioning, transitionToPage } = usePageTransition();

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
              <Scissors className="w-6 h-6 text-gold" />
              <h1 className="text-lg font-display font-bold text-gold">Darzee</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="w-9 h-9 relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"></div>
            </Button>
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-navy">T</span>
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
            <Scissors className="w-8 h-8 text-gold" />
            <div>
              <h1 className="text-xl font-display font-bold text-gold">Darzee</h1>
              <p className="text-xs text-muted-foreground">Luxury Tailoring</p>
            </div>
          </div>
        </div>

        {/* Mobile Header in Sidebar */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Scissors className="w-8 h-8 text-gold" />
            <div>
              <h1 className="text-xl font-display font-bold text-gold">Darzee</h1>
              <p className="text-xs text-muted-foreground">Luxury Tailoring</p>
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
        
        {/* Add Order Button */}
        <div className="absolute bottom-6 left-4 right-4">
          <Button
            className="w-full"
            onClick={() => handlePageChange('new-order')}
            disabled={isTransitioning}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Order
          </Button>
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
              <h1 className="text-2xl font-display font-bold text-gold capitalize">
                {currentPage === 'new-order' ? 'New Order' : currentPage}
              </h1>
              {isTransitioning && (
                <div className="mt-2">
                  <SimpleLoader size="sm" text="Loading..." />
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"></div>
              </Button>
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-navy">T</span>
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