const { validationResult } = require('express-validator');
const NotificationService = require('../services/notificationService');

class NotificationController {
  async getUserNotifications(req, res) {
    try {
      const { limit = 50 } = req.query;
      const notifications = await NotificationService.getUserNotifications(
        req.user.id, 
        parseInt(limit)
      );
      res.json(notifications);

    } catch (error) {
      console.error('Notifications fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  async createNotification(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, message, type, user_id, order_id } = req.body;
      const targetUserId = user_id || req.user.id;

      const result = await NotificationService.createNotification({
        user_id: targetUserId,
        title,
        message,
        type,
        order_id
      });

      res.status(201).json(result);

    } catch (error) {
      console.error('Notification creation error:', error);
      
      if (error.message.includes('required')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to create notification' });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const result = await NotificationService.markAsRead(id, req.user.id);
      res.json(result);

    } catch (error) {
      console.error('Notification update error:', error);
      
      if (error.message === 'Notification not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to update notification' });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const result = await NotificationService.markAllAsRead(req.user.id);
      res.json(result);

    } catch (error) {
      console.error('Notifications update error:', error);
      res.status(500).json({ error: 'Failed to update notifications' });
    }
  }

  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const result = await NotificationService.deleteNotification(id, req.user.id);
      res.json(result);

    } catch (error) {
      console.error('Notification deletion error:', error);
      
      if (error.message === 'Notification not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const count = await NotificationService.getUnreadCount(req.user.id);
      res.json({ count });

    } catch (error) {
      console.error('Unread count error:', error);
      res.status(500).json({ error: 'Failed to get unread count' });
    }
  }

  async getNotificationStats(req, res) {
    try {
      const stats = await NotificationService.getNotificationStats(req.user.id);
      res.json(stats);

    } catch (error) {
      console.error('Notification stats error:', error);
      res.status(500).json({ error: 'Failed to fetch notification stats' });
    }
  }

  async createETAReminders(req, res) {
    try {
      const result = await NotificationService.createETAReminders();
      res.json(result);

    } catch (error) {
      console.error('ETA reminders error:', error);
      res.status(500).json({ error: 'Failed to create ETA reminders' });
    }
  }

  async createPaymentReminders(req, res) {
    try {
      const result = await NotificationService.createPaymentReminders();
      res.json(result);

    } catch (error) {
      console.error('Payment reminders error:', error);
      res.status(500).json({ error: 'Failed to create payment reminders' });
    }
  }
}

module.exports = new NotificationController();