import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Scissors,
  Star,
  User,
  PlusCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SimpleLoader } from '@/components/animations/SimpleLoader';
import { useAppStore } from '@/store';

export function Dashboard() {
  const [userType, setUserType] = useState<'tailor' | 'customer'>('tailor');
  const [isLoading, setIsLoading] = useState(false);
  const getDashboardStats = useAppStore((state) => state.getDashboardStats);
  const orders = useAppStore((state) => state.orders);
  
  const stats = getDashboardStats();
  
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const tailorStats = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: Package,
      gradient: 'from-blue-500 to-blue-700',
      change: '+12%',
      delay: '0s',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      gradient: 'from-orange-500 to-orange-700',
      change: '+8%',
      delay: '0.1s',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-emerald-700',
      change: '+15%',
      delay: '0.2s',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      gradient: 'from-purple-500 to-purple-700',
      change: '+5%',
      delay: '0.3s',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-gold to-gold-dark',
      change: '+23%',
      delay: '0.4s',
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      gradient: 'from-indigo-500 to-indigo-700',
      change: '+18%',
      delay: '0.5s',
    },
  ];

  const handleUserTypeSwitch = (type: 'tailor' | 'customer') => {
    if (type !== userType) {
      setIsLoading(true);
      setTimeout(() => {
        setUserType(type);
        setIsLoading(false);
      }, 800);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400';
      case 'ready_for_trial':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400';
      case 'alterations':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <SimpleLoader size="lg" text="Loading Dashboard" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Type Switcher */}
      <div className="flex justify-center">
        <div className="bg-card rounded-lg p-1 border border-border inline-flex">
          <Button
            variant={userType === 'tailor' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleUserTypeSwitch('tailor')}
            className="flex-1"
          >
            <Scissors className="w-4 h-4 mr-2" />
            Tailor
          </Button>
          <Button
            variant={userType === 'customer' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleUserTypeSwitch('customer')}
            className="flex-1"
          >
            <User className="w-4 h-4 mr-2" />
            Customer
          </Button>
        </div>
      </div>

      {userType === 'tailor' ? (
        // Tailor Dashboard
        <>
          {/* Welcome Section */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-8 h-8 text-navy" />
              </div>
              <CardTitle className="text-2xl">Master Tailor's Dashboard</CardTitle>
              <p className="text-muted-foreground">
                Manage your tailoring business with precision
              </p>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tailorStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <div className="flex items-center mt-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-green-500">{stat.change}</span>
                          <span className="text-muted-foreground ml-1">vs last month</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gold/10 rounded-lg">
                        <Icon className="w-6 h-6 text-gold" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        // Customer Portal
        <div className="space-y-6">
          {/* Customer Welcome */}
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome to Your Style Journey</CardTitle>
              <p className="text-muted-foreground">
                Track your orders and browse our exclusive designs
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>
                  <Package className="w-4 h-4 mr-2" />
                  My Orders
                </Button>
                <Button variant="outline">
                  <Star className="w-4 h-4 mr-2" />
                  Browse Designs
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg mb-1">Active Orders</CardTitle>
                <p className="text-2xl font-bold">3</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <CardTitle className="text-lg mb-1">Completed</CardTitle>
                <p className="text-2xl font-bold">12</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <CardTitle className="text-lg mb-1">Satisfaction</CardTitle>
                <p className="text-2xl font-bold">5.0★</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">No orders yet. Create your first order!</p>
                  <Button size="sm">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create First Order
                  </Button>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item(s) • ₹{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Package className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Create New Order</div>
                  <div className="text-xs text-muted-foreground">Add a new tailoring order</div>
                </div>
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Add Customer</div>
                  <div className="text-xs text-muted-foreground">Register a new customer</div>
                </div>
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">View Reports</div>
                  <div className="text-xs text-muted-foreground">Business analytics</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}