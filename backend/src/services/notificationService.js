const { pool } = require('../database/connection');
const { generateId } = require('../utils/helpers');

class NotificationService {
  async getUserNotifications(userId, limit = 50) {
    try {
      const [notifications] = await pool.execute(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
        [userId, limit]
      );

      return notifications;
    } catch (error) {
      throw error;
    }
  }

  async createNotification(notificationData) {
    try {
      const { user_id, title, message, type, order_id } = notificationData;
      
      if (!user_id || !title || !message || !type) {
        throw new Error('User ID, title, message, and type are required');
      }

      const notificationId = generateId();

      await pool.execute(
        `INSERT INTO notifications (id, user_id, title, message, type, order_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [notificationId, user_id, title, message, type, order_id || null]
      );

      return {
        message: 'Notification created successfully',
        id: notificationId
      };
    } catch (error) {
      throw error;
    }
  }

  async createOrderNotification(notificationData) {
    try {
      const { userId, orderId, type, title, message } = notificationData;
      
      // Check for duplicate notifications to prevent spam
      const [existing] = await pool.execute(
        `SELECT id FROM notifications 
         WHERE user_id = ? AND order_id = ? AND type = ? 
         AND DATE(created_at) = CURDATE()`,
        [userId, orderId, type]
      );

      if (existing.length > 0) {
        return { message: 'Notification already exists for today' };
      }

      return await this.createNotification({
        user_id: userId,
        title,
        message,
        type,
        order_id: orderId
      });
    } catch (error) {
      throw error;
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      // Verify notification belongs to current user
      const [notifications] = await pool.execute(
        'SELECT id FROM notifications WHERE id = ? AND user_id = ?',
        [notificationId, userId]
      );

      if (notifications.length === 0) {
        throw new Error('Notification not found');
      }

      await pool.execute(
        'UPDATE notifications SET is_read = TRUE WHERE id = ?',
        [notificationId]
      );

      return { message: 'Notification marked as read' };
    } catch (error) {
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      await pool.execute(
        'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
        [userId]
      );

      return { message: 'All notifications marked as read' };
    } catch (error) {
      throw error;
    }
  }

  async deleteNotification(notificationId, userId) {
    try {
      // Verify notification belongs to current user
      const [notifications] = await pool.execute(
        'SELECT id FROM notifications WHERE id = ? AND user_id = ?',
        [notificationId, userId]
      );

      if (notifications.length === 0) {
        throw new Error('Notification not found');
      }

      await pool.execute('DELETE FROM notifications WHERE id = ?', [notificationId]);

      return { message: 'Notification deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getUnreadCount(userId) {
    try {
      const [result] = await pool.execute(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
        [userId]
      );

      return result[0].count || 0;
    } catch (error) {
      throw error;
    }
  }

  async createETAReminders() {
    try {
      const { pool } = require('../database/connection');
      
      // Get orders with delivery date tomorrow
      const [orders] = await pool.execute(
        `SELECT o.*, c.email as customer_email 
         FROM orders o
         JOIN customers c ON o.customer_id = c.id
         WHERE o.estimated_delivery_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
         AND o.status NOT IN ('delivered', 'cancelled')`
      );

      for (const order of orders) {
        await this.createOrderNotification({
          userId: order.customer_id,
          orderId: order.id,
          type: 'eta_reminder',
          title: 'Order Delivery Tomorrow!',
          message: `Your order #${order.id.slice(-6)} is scheduled for delivery tomorrow. Make sure you're available!`
        });
      }

      return { message: `Created ${orders.length} ETA reminder notifications` };
    } catch (error) {
      throw error;
    }
  }

  async createPaymentReminders() {
    try {
      // Get orders with pending payments that are ready or delivered
      const [orders] = await pool.execute(
        `SELECT * FROM orders 
         WHERE remaining_amount > 0 
         AND status IN ('ready', 'delivered')
         ORDER BY estimated_delivery_date ASC`
      );

      for (const order of orders) {
        await this.createOrderNotification({
          userId: order.customer_id,
          orderId: order.id,
          type: 'payment_due',
          title: 'Payment Due',
          message: `Payment of ₹${parseFloat(order.remaining_amount).toLocaleString()} is due for order #${order.id.slice(-6)}.`
        });
      }

      return { message: `Created ${orders.length} payment reminder notifications` };
    } catch (error) {
      throw error;
    }
  }

  async createOverdueReminders(tailorId) {
    try {
      // Get overdue orders for this tailor
      const [orders] = await pool.execute(
        `SELECT * FROM orders 
         WHERE tailor_id = ?
         AND estimated_delivery_date < CURDATE() 
         AND status NOT IN ('delivered', 'cancelled')
         ORDER BY estimated_delivery_date ASC`,
        [tailorId]
      );

      for (const order of orders) {
        await this.createOrderNotification({
          userId: tailorId,
          orderId: order.id,
          type: 'order_updated',
          title: 'Order Overdue',
          message: `Order #${order.id.slice(-6)} for ${order.customer_name} is overdue. Expected delivery was ${new Date(order.estimated_delivery_date).toLocaleDateString()}.`
        });
      }

      return { message: `Created ${orders.length} overdue reminder notifications` };
    } catch (error) {
      throw error;
    }
  }

  async getNotificationStats(userId) {
    try {
      const [stats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_notifications,
          SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) as unread_count,
          SUM(CASE WHEN type = 'eta_reminder' THEN 1 ELSE 0 END) as eta_reminders,
          SUM(CASE WHEN type = 'order_ready' THEN 1 ELSE 0 END) as order_ready,
          SUM(CASE WHEN type = 'payment_due' THEN 1 ELSE 0 END) as payment_due
         FROM notifications WHERE user_id = ?`,
        [userId]
      );

      return {
        totalNotifications: stats[0].total_notifications || 0,
        unreadCount: stats[0].unread_count || 0,
        etaReminders: stats[0].eta_reminders || 0,
        orderReady: stats[0].order_ready || 0,
        paymentDue: stats[0].payment_due || 0
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new NotificationService();