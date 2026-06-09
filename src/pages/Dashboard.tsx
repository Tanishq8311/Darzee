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
  Crown,
  Star,
  Sparkles,
  User,
  ShirtIcon as Shirt,
  PlusCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StitchingLoader } from '@/components/animations/StitchingLoader';
import { MeasuringTape } from '@/components/animations/MeasuringTape';
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
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ready_for_trial':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'alterations':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <StitchingLoader size="lg" text="Loading Dashboard" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Type Switcher */}
      <div className="flex justify-center">
        <div className="luxury-card p-2 rounded-2xl border border-gold/30">
          <div className="flex space-x-2">
            <Button
              variant={userType === 'tailor' ? 'golden' : 'ghost'}
              size="lg"
              onClick={() => handleUserTypeSwitch('tailor')}
              className="relative"
            >
              <Scissors className="w-5 h-5 mr-2" />
              Tailor Dashboard
              {userType === 'tailor' && (
                <Crown className="w-4 h-4 ml-2 animate-float" />
              )}
            </Button>
            <Button
              variant={userType === 'customer' ? 'golden' : 'ghost'}
              size="lg"
              onClick={() => handleUserTypeSwitch('customer')}
              className="relative"
            >
              <User className="w-5 h-5 mr-2" />
              Customer Portal
              {userType === 'customer' && (
                <Star className="w-4 h-4 ml-2 animate-float" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {userType === 'tailor' ? (
        // Tailor Dashboard
        <>
          {/* Welcome Section */}
          <div className="relative luxury-card rounded-2xl p-8 overflow-hidden fabric-texture">
            <div className="absolute top-0 right-0 opacity-10">
              <Scissors className="w-32 h-32 text-gold rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center animate-float">
                  <Crown className="w-8 h-8 text-navy" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-gold mb-2">
                    Master Tailor's Atelier
                  </h2>
                  <p className="text-silver">
                    Crafting excellence, stitch by stitch
                  </p>
                </div>
              </div>
              <MeasuringTape length={75} showMeasurement measurement="Excellence Level: 98%" />
            </div>
            
            {/* Decorative stitching */}
            <svg className="absolute bottom-0 left-0 right-0" height="6">
              <line 
                x1="0" 
                y1="3" 
                x2="100%" 
                y2="3" 
                className="stitching-line"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tailorStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index} 
                  className="group cursor-pointer"
                  style={{ animationDelay: stat.delay }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-silver/80 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-display font-bold text-gold">
                          {stat.value}
                        </p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-3 h-3 text-emerald-400 mr-1" />
                          <span className="text-xs text-emerald-400">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-luxury group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-navy-light rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full animate-measure-tape`}
                        style={{ width: '70%' }}
                      ></div>
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
          <div className="luxury-card rounded-2xl p-8 text-center">
            <Shirt className="w-16 h-16 text-gold mx-auto mb-4 animate-float" />
            <h2 className="text-3xl font-display font-bold text-gold mb-2">
              Welcome to Your Style Journey
            </h2>
            <p className="text-silver mb-6">
              Track your orders, browse designs, and experience luxury tailoring
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="golden" size="lg">
                <Package className="w-5 h-5 mr-2" />
                My Orders
              </Button>
              <Button variant="outline" size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Browse Designs
              </Button>
            </div>
          </div>

          {/* Customer Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="w-12 h-12 text-gold mx-auto mb-3 animate-float" />
                <h3 className="font-display font-semibold text-gold mb-1">Active Orders</h3>
                <p className="text-2xl font-bold text-silver">3</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-float" />
                <h3 className="font-display font-semibold text-gold mb-1">Completed</h3>
                <p className="text-2xl font-bold text-silver">12</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-gold mx-auto mb-3 animate-float" />
                <h3 className="font-display font-semibold text-gold mb-1">Satisfaction</h3>
                <p className="text-2xl font-bold text-silver">5.0★</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-3 animate-pulse" />
              Recent Orders
              <div className="ml-auto">
                <div className="w-3 h-3 bg-gold rounded-full animate-pulse"></div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative">
                    <AlertCircle className="w-16 h-16 text-gold/30 mx-auto mb-4 animate-float" />
                    <Sparkles className="absolute top-0 right-1/2 transform translate-x-1/2 w-4 h-4 text-gold animate-pulse" />
                  </div>
                  <p className="text-silver">No orders yet. Start your tailoring journey!</p>
                  <Button variant="luxury" className="mt-4" size="sm">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create First Order
                  </Button>
                </div>
              ) : (
                recentOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className="luxury-card p-4 rounded-xl hover:scale-[1.02] transition-all duration-300 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="font-display font-semibold text-gold">{order.customerName}</p>
                          <Star className="w-4 h-4 text-gold animate-pulse" />
                        </div>
                        <p className="text-sm text-silver flex items-center">
                          <Scissors className="w-3 h-3 mr-1" />
                          {order.items.length} item(s) • ₹{order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            order.status
                          )} animate-pulse`}
                        >
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <div className="mt-2">
                          <MeasuringTape length={60} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Master Actions */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="w-5 h-5 mr-3 text-gold animate-float" />
              Master Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="luxury"
                className="w-full justify-start p-6 h-auto group"
              >
                <div className="flex items-center w-full">
                  <div className="p-3 rounded-xl bg-gold/20 mr-4 group-hover:bg-gold/30 transition-colors">
                    <Package className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-display font-semibold text-gold">Create New Order</p>
                    <p className="text-sm text-silver/80">
                      Start crafting a new masterpiece
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-gold animate-pulse" />
                </div>
              </Button>
              
              <Button
                variant="luxury"
                className="w-full justify-start p-6 h-auto group"
              >
                <div className="flex items-center w-full">
                  <div className="p-3 rounded-xl bg-emerald-500/20 mr-4 group-hover:bg-emerald-500/30 transition-colors">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-display font-semibold text-gold">Add Customer</p>
                    <p className="text-sm text-silver/80">
                      Welcome a new client to your atelier
                    </p>
                  </div>
                  <Crown className="w-5 h-5 text-emerald-400 animate-float" />
                </div>
              </Button>
              
              <Button
                variant="luxury"
                className="w-full justify-start p-6 h-auto group"
              >
                <div className="flex items-center w-full">
                  <div className="p-3 rounded-xl bg-purple-500/20 mr-4 group-hover:bg-purple-500/30 transition-colors">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-display font-semibold text-gold">Business Analytics</p>
                    <p className="text-sm text-silver/80">
                      Master your craft with insights
                    </p>
                  </div>
                  <Star className="w-5 h-5 text-purple-400 animate-pulse" />
                </div>
              </Button>

              {/* Premium Feature Teaser */}
              <div className="luxury-card p-4 rounded-xl border-2 border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10">
                <div className="text-center">
                  <Crown className="w-8 h-8 text-gold mx-auto mb-2 animate-float" />
                  <h3 className="font-display font-bold text-gold mb-1">Premium Studio</h3>
                  <p className="text-xs text-silver/80 mb-3">
                    Unlock advanced pattern creation & AI styling
                  </p>
                  <Button variant="golden" size="sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}