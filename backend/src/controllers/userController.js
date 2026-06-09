const { validationResult } = require('express-validator');
const UserService = require('../services/userService');

class UserController {
  async getProfile(req, res) {
    try {
      const user = await UserService.getUserProfile(req.user.id);
      res.json(user);

    } catch (error) {
      console.error('Profile fetch error:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await UserService.updateUserProfile(req.user.id, req.body);
      res.json(result);

    } catch (error) {
      console.error('Profile update error:', error);
      
      if (error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  async getUserStats(req, res) {
    try {
      const stats = await UserService.getUserStats(req.user.id);
      res.json(stats);

    } catch (error) {
      console.error('User stats error:', error);
      res.status(500).json({ error: 'Failed to fetch user stats' });
    }
  }

  async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      
      if (!['tailor', 'customer'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const users = await UserService.getUsersByRole(role);
      res.json(users);

    } catch (error) {
      console.error('Users fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
}

module.exports = new UserController();