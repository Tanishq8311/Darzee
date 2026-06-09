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
  Sparkles,
  Crown
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/utils/cn';
import { ScissorsTransition } from './animations/ScissorsTransition';
import { usePageTransition } from '@/hooks/usePageTransition';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Business overview' },
  { id: 'customers', label: 'Customers', icon: Users, description: 'Client management' },
  { id: 'orders', label: 'Orders', icon: Package, description: 'Active projects' },
  { id: 'designs', label: 'Designs', icon: Scissors, description: 'Pattern catalog' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Preferences' },
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
    <div className="flex h-screen bg-background">
      {/* Scissors Transition */}
      <ScissorsTransition 
        isActive={isTransitioning} 
        onComplete={() => {}} 
      />

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 luxury-card shadow-luxury transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
        <div className="relative h-20 px-6 border-b border-border/50 fabric-texture">
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Scissors className="w-10 h-10 text-gold animate-float" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gold">Darzee</h1>
                <p className="text-xs text-silver">Luxury Tailoring</p>
              </div>
            </div>
          </div>
          
          {/* Decorative stitching */}
          <svg className="absolute bottom-0 left-0 right-0" height="4">
            <line 
              x1="0" 
              y1="2" 
              x2="100%" 
              y2="2" 
              className="stitching-line"
              strokeWidth="1"
            />
          </svg>
        </div>
        
        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-3">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slide-down">
                  <button
                    onClick={() => handlePageChange(item.id)}
                    disabled={isTransitioning}
                    className={cn(
                      "group w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-gold to-gold-dark text-navy shadow-golden"
                        : "text-silver hover:text-gold hover:bg-navy-light/50"
                    )}
                  >
                    {/* Shimmer effect for active item */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gold-shimmer opacity-20 animate-shimmer"></div>
                    )}
                    
                    <div className="relative flex items-center w-full">
                      <Icon className={cn(
                        "w-5 h-5 mr-4 transition-transform duration-300",
                        isActive ? "scale-110" : "group-hover:scale-110"
                      )} />
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="w-2 h-8 bg-navy rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    {/* Hover thread */}
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Premium CTA */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="luxury-card p-4 border border-gold/20">
            <div className="text-center space-y-2">
              <Crown className="w-8 h-8 text-gold mx-auto animate-float" />
              <h3 className="font-display font-semibold text-gold">Premium Features</h3>
              <p className="text-xs text-silver">Upgrade for advanced tools</p>
            </div>
          </div>
          
          <Button
            className="w-full mt-4 shimmer-button"
            onClick={() => handlePageChange('new-order')}
            disabled={isTransitioning}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="luxury-card border-b border-border/50 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-navy-light"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-display font-bold text-gold capitalize">
                  {currentPage === 'new-order' ? 'New Order' : currentPage}
                </h1>
                <div className="h-0.5 w-16 bg-gold mt-1 animate-measure-tape"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative hover:bg-navy-light group"
              >
                <Bell className="w-5 h-5 group-hover:animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full animate-pulse">
                  <div className="w-full h-full bg-gold rounded-full animate-ping"></div>
                </div>
              </Button>
              
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center shadow-golden">
                  <span className="text-sm font-bold text-navy">A</span>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-card animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Header decoration */}
          <svg className="w-full" height="2">
            <line 
              x1="0" 
              y1="1" 
              x2="100%" 
              y2="1" 
              className="stitching-line"
              strokeWidth="0.5"
            />
          </svg>
        </header>

        {/* Page content with transition */}
        <main className={cn(
          "flex-1 overflow-y-auto p-6 transition-all duration-500",
          isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"
        )}>
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}