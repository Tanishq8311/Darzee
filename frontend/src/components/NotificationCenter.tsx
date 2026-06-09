import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  Clock, 
  Package, 
  AlertTriangle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { useAppStore } from '@/store';
import { useAuthStore } from '@/store/auth';
import { Notification, NotificationType, OrderStatus } from '@/types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { user } = useAuthStore();
  const { 
    addNotification, 
    markAsRead, 
    getNotificationsByUser,
    getOrdersByTailor,
    getOrdersByCustomer 
  } = useAppStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      generateNotifications();
      const userNotifications = getNotificationsByUser(user.id);
      setNotifications(userNotifications);
    }
  }, [user]);

  // Generate automatic notifications based on orders and ETAs
  const generateNotifications = () => {
    if (!user) return;

    const orders = user.role === 'tailor' 
      ? getOrdersByTailor(user.id)
      : getOrdersByCustomer(user.id);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    orders.forEach(order => {
      const eta = new Date(order.estimatedDeliveryDate);
      const existingNotifications = getNotificationsByUser(user.id);
      
      // Check if notification already exists for this order
      const hasNotificationForOrder = existingNotifications.some(n => n.orderId === order.id);
      
      if (!hasNotificationForOrder) {
        // Order ready notification
        if (order.status === OrderStatus.READY) {
          addNotification({
            userId: user.role === 'tailor' ? order.customerId : user.id,
            title: 'Order Ready for Pickup',
            message: `Order #${order.id.slice(-6)} is ready for pickup.`,
            type: NotificationType.ORDER_READY,
            isRead: false,
            orderId: order.id,
          });
        }

        // ETA reminder notifications (for customers)
        if (user.role === 'customer') {
          if (eta <= tomorrow && eta > today && order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.READY) {
            addNotification({
              userId: user.id,
              title: 'Order Delivery Tomorrow',
              message: `Your order #${order.id.slice(-6)} is scheduled for delivery tomorrow.`,
              type: NotificationType.ETA_REMINDER,
              isRead: false,
              orderId: order.id,
            });
          }

          if (eta <= threeDaysFromNow && eta > tomorrow && order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.READY) {
            addNotification({
              userId: user.id,
              title: 'Order Delivery Soon',
              message: `Your order #${order.id.slice(-6)} is scheduled for delivery on ${eta.toLocaleDateString()}.`,
              type: NotificationType.ETA_REMINDER,
              isRead: false,
              orderId: order.id,
            });
          }
        }

        // Payment due notifications
        if (order.remainingAmount > 0 && (order.status === OrderStatus.READY || order.status === OrderStatus.DELIVERED)) {
          addNotification({
            userId: user.role === 'tailor' ? order.customerId : user.id,
            title: 'Payment Due',
            message: `Payment of ₹${order.remainingAmount.toLocaleString()} is due for order #${order.id.slice(-6)}.`,
            type: NotificationType.PAYMENT_DUE,
            isRead: false,
            orderId: order.id,
          });
        }
      }
    });
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER_READY:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case NotificationType.ETA_REMINDER:
        return <Clock className="w-5 h-5 text-blue-500" />;
      case NotificationType.PAYMENT_DUE:
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      case NotificationType.ORDER_CREATED:
        return <Package className="w-5 h-5 text-primary" />;
      case NotificationType.ORDER_UPDATED:
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-16 px-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 overflow-y-auto max-h-96">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-medium mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>

        {unreadCount > 0 && (
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                notifications.forEach(n => {
                  if (!n.isRead) handleMarkAsRead(n.id);
                });
              }}
              className="w-full"
            >
              Mark all as read
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const { getNotificationsByUser } = useAppStore();

  const notifications = user ? getNotificationsByUser(user.id) : [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </Button>
      
      <NotificationCenter 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}