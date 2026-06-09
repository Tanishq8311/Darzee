const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const CustomerController = require('../controllers/customerController');

const router = express.Router();

// Get customers for a tailor
router.get('/', [authenticateToken, requireRole(['tailor'])], CustomerController.getCustomers);

// Get customer statistics
router.get('/stats', [authenticateToken, requireRole(['tailor'])], CustomerController.getCustomerStats);

// Get customer by ID
router.get('/:id', [authenticateToken, requireRole(['tailor'])], CustomerController.getCustomerById);

// Add customer
router.post('/', [
  authenticateToken,
  requireRole(['tailor']),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('address').optional().trim(),
  body('measurements').optional().isObject()
], CustomerController.addCustomer);

// Update customer
router.put('/:id', [
  authenticateToken,
  requireRole(['tailor']),
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('phone').optional().isMobilePhone(),
  body('address').optional().trim(),
  body('measurements').optional().isObject()
], CustomerController.updateCustomer);

// Delete customer
router.delete('/:id', [authenticateToken, requireRole(['tailor'])], CustomerController.deleteCustomer);

module.exports = router;