const { validationResult } = require('express-validator');
const AuthService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await AuthService.register(req.body);
      res.status(201).json(result);

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message === 'User with this email already exists') {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await AuthService.login(req.body);
      res.json(result);

    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async verifyToken(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const result = await AuthService.verifyToken(token);
      res.json(result);

    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}

module.exports = new AuthController();