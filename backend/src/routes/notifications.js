const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const NotificationController = require('../controllers/notificationController');

const router = express.Router();

// Get notifications for current user
router.get('/', authenticateToken, NotificationController.getUserNotifications);

// Get unread notification count
router.get('/unread-count', authenticateToken, NotificationController.getUnreadCount);

// Get notification statistics
router.get('/stats', authenticateToken, NotificationController.getNotificationStats);

// Create ETA reminders (system/admin use)
router.post('/eta-reminders', [authenticateToken, requireRole(['tailor'])], NotificationController.createETAReminders);

// Create payment reminders (system/admin use)
router.post('/payment-reminders', [authenticateToken, requireRole(['tailor'])], NotificationController.createPaymentReminders);

// Create notification
router.post('/', [
  authenticateToken,
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required'),
  body('type').isIn(['order_ready', 'eta_reminder', 'payment_due', 'order_created', 'order_updated']).withMessage('Valid type is required'),
  body('user_id').optional().isUUID(),
  body('order_id').optional().isUUID()
], NotificationController.createNotification);

// Mark notification as read
router.put('/:id/read', authenticateToken, NotificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', authenticateToken, NotificationController.markAllAsRead);

// Delete notification
router.delete('/:id', authenticateToken, NotificationController.deleteNotification);

module.exports = router;