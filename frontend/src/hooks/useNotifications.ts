import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useAppStore } from '@/store';
import { NotificationType, OrderStatus } from '@/types';

export function useNotifications() {
  const { user } = useAuthStore();
  const { 
    addNotification, 
    getNotificationsByUser,
    getOrdersByTailor,
    getOrdersByCustomer 
  } = useAppStore();

  useEffect(() => {
    if (!user) return;

    const checkAndCreateNotifications = () => {
      const orders = user.role === 'tailor' 
        ? getOrdersByTailor(user.id)
        : getOrdersByCustomer(user.id);

      const existingNotifications = getNotificationsByUser(user.id);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      orders.forEach(order => {
        const eta = new Date(order.estimatedDeliveryDate);
        
        // Avoid duplicate notifications
        const hasNotification = (type: NotificationType) =>
          existingNotifications.some(n => 
            n.orderId === order.id && 
            n.type === type &&
            new Date(n.createdAt).toDateString() === today.toDateString()
          );

        // ETA reminder for customers (day before delivery)
        if (user.role === 'customer' && 
            eta.toDateString() === tomorrow.toDateString() &&
            order.status !== OrderStatus.DELIVERED &&
            order.status !== OrderStatus.CANCELLED &&
            !hasNotification(NotificationType.ETA_REMINDER)) {
          
          addNotification({
            userId: user.id,
            title: 'Order Delivery Tomorrow!',
            message: `Your order #${order.id.slice(-6)} is scheduled for delivery tomorrow. Make sure you're available!`,
            type: NotificationType.ETA_REMINDER,
            isRead: false,
            orderId: order.id,
          });
        }

        // Order ready notification
        if (order.status === OrderStatus.READY &&
            !hasNotification(NotificationType.ORDER_READY)) {
          
          const targetUserId = user.role === 'tailor' ? order.customerId : user.id;
          
          addNotification({
            userId: targetUserId,
            title: 'Order Ready for Pickup',
            message: `Order #${order.id.slice(-6)} is ready! Please visit the shop to collect your order.`,
            type: NotificationType.ORDER_READY,
            isRead: false,
            orderId: order.id,
          });
        }

        // Payment due notification
        if (order.remainingAmount > 0 && 
            (order.status === OrderStatus.READY || order.status === OrderStatus.DELIVERED) &&
            !hasNotification(NotificationType.PAYMENT_DUE)) {
          
          const targetUserId = user.role === 'tailor' ? order.customerId : user.id;
          
          addNotification({
            userId: targetUserId,
            title: 'Payment Due',
            message: `Payment of ₹${order.remainingAmount.toLocaleString()} is due for order #${order.id.slice(-6)}.`,
            type: NotificationType.PAYMENT_DUE,
            isRead: false,
            orderId: order.id,
          });
        }

        // Overdue order notification (for tailors)
        if (user.role === 'tailor' && 
            eta < today && 
            order.status !== OrderStatus.DELIVERED &&
            order.status !== OrderStatus.CANCELLED &&
            !hasNotification(NotificationType.ORDER_UPDATED)) {
          
          addNotification({
            userId: user.id,
            title: 'Order Overdue',
            message: `Order #${order.id.slice(-6)} for ${order.customerName} is overdue. Expected delivery was ${eta.toLocaleDateString()}.`,
            type: NotificationType.ORDER_UPDATED,
            isRead: false,
            orderId: order.id,
          });
        }
      });
    };

    // Check immediately
    checkAndCreateNotifications();

    // Check every 30 seconds for real-time updates
    const interval = setInterval(checkAndCreateNotifications, 30000);

    return () => clearInterval(interval);
  }, [user, addNotification, getNotificationsByUser, getOrdersByTailor, getOrdersByCustomer]);
}

// Hook to get unread notification count
export function useUnreadNotificationCount() {
  const { user } = useAuthStore();
  const { getNotificationsByUser } = useAppStore();

  if (!user) return 0;
  
  const notifications = getNotificationsByUser(user.id);
  return notifications.filter(n => !n.isRead).length;
}