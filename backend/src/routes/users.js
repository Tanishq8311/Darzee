const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const UserController = require('../controllers/userController');

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, UserController.getProfile);

// Update user profile
router.put('/profile', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('address').optional().trim(),
  body('shopName').optional().trim(),
  body('experience').optional().isInt({ min: 0 }),
  body('specialization').optional().isArray()
], UserController.updateProfile);

// Get user statistics
router.get('/stats', authenticateToken, UserController.getUserStats);

// Get users by role (admin functionality)
router.get('/role/:role', [authenticateToken, requireRole(['tailor'])], UserController.getUsersByRole);

module.exports = router;