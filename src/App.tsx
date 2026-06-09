import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { SplashScreen } from './components/SplashScreen';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'orders':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Orders Page</h2>
            <p className="text-muted-foreground">Coming soon - Order management functionality</p>
          </div>
        );
      case 'designs':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Designs Page</h2>
            <p className="text-muted-foreground">Coming soon - Design catalog and management</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Settings Page</h2>
            <p className="text-muted-foreground">Coming soon - Application settings and preferences</p>
          </div>
        );
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

  if (isLoading) {
    return <SplashScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;