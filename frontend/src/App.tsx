import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { SplashScreen } from './components/SplashScreen';
import { useAuthStore } from './store/auth';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { isAuthenticated, user } = useAuthStore();
  
  // Initialize notifications system
  useNotifications();

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'orders':
        return <Orders />;
      case 'designs':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Designs Page</h2>
            <p className="text-muted-foreground">Coming soon - Design catalog and management</p>
          </div>
        );
      case 'profile':
        return <Profile />;
      case 'new-order':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">New Order</h2>
            <p className="text-muted-foreground">Coming soon - Create new tailoring order</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  console.log('App render state:', { isInitialLoading, isAuthenticated, user: user?.email, currentPage });

  if (isInitialLoading) {
    console.log('Showing splash screen');
    return <SplashScreen onComplete={() => setIsInitialLoading(false)} />;
  }

  if (!isAuthenticated) {
    console.log('Showing auth page');
    return <Auth />;
  }

  console.log('Showing authenticated layout');
  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage} user={user}>
      {renderPage()}
    </Layout>
  );
}

export default App;