const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, requireRole } = require('../middleware/auth');
const DesignController = require('../controllers/designController');

const router = express.Router();

// Get all active designs (public)
router.get('/', DesignController.getAllDesigns);

// Get design types
router.get('/types', DesignController.getDesignTypes);

// Get design statistics
router.get('/stats', [authenticateToken, requireRole(['tailor'])], DesignController.getDesignStats);

// Get popular designs
router.get('/popular', DesignController.getPopularDesigns);

// Get design by ID
router.get('/:id', DesignController.getDesignById);

// Add design (tailor only)
router.post('/', [
  authenticateToken,
  requireRole(['tailor']),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('type').trim().isLength({ min: 2 }).withMessage('Type is required'),
  body('base_price').isNumeric().withMessage('Base price must be a number'),
  body('description').optional().trim()
], DesignController.createDesign);

// Update design (tailor only)
router.put('/:id', [
  authenticateToken,
  requireRole(['tailor']),
  body('name').optional().trim().isLength({ min: 2 }),
  body('type').optional().trim().isLength({ min: 2 }),
  body('base_price').optional().isNumeric(),
  body('description').optional().trim(),
  body('is_active').optional().isBoolean()
], DesignController.updateDesign);

// Delete design (tailor only)
router.delete('/:id', [authenticateToken, requireRole(['tailor'])], DesignController.deleteDesign);

module.exports = router;