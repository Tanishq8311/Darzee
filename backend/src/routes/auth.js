const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('role').isIn(['tailor', 'customer']).withMessage('Role must be tailor or customer')
], AuthController.register);

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], AuthController.login);

// Verify token
router.get('/verify', AuthController.verifyToken);

module.exports = router;