const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const OrderController = require('../controllers/orderController');

const router = express.Router();

// Get orders (tailor gets their orders, customer gets their orders)
router.get('/', authenticateToken, OrderController.getOrders);

// Get order statistics
router.get('/stats', authenticateToken, OrderController.getOrderStats);

// Get overdue orders (tailor only)
router.get('/overdue', [authenticateToken, requireRole(['tailor'])], OrderController.getOverdueOrders);

// Get order by ID
router.get('/:id', authenticateToken, OrderController.getOrderById);

// Create order (tailor only)
router.post('/', [
  authenticateToken,
  requireRole(['tailor']),
  body('customer_id').notEmpty().withMessage('Customer ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('estimated_delivery_date').isISO8601().withMessage('Valid delivery date is required'),
  body('advance_amount').optional().isNumeric()
], OrderController.createOrder);

// Update order (tailor only)
router.put('/:id', [
  authenticateToken,
  requireRole(['tailor']),
  body('status').optional().isIn(['pending', 'in_progress', 'ready', 'delivered', 'cancelled']),
  body('estimated_delivery_date').optional().isISO8601(),
  body('advance_amount').optional().isNumeric()
], OrderController.updateOrder);

// Delete order (tailor only)
router.delete('/:id', [authenticateToken, requireRole(['tailor'])], OrderController.deleteOrder);

module.exports = router;