const User = require('../models/User');

class UserService {
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return user.toJSON();
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(userId, updateData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await user.update(updateData);
      
      return {
        message: 'Profile updated successfully',
        user: updatedUser.toJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  async getUsersByRole(role) {
    try {
      // This method can be used for admin functionality if needed
      const { pool } = require('../database/connection');
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE role = ? ORDER BY created_at DESC',
        [role]
      );

      return users.map(userData => {
        const user = new User(userData);
        return user.toJSON();
      });
    } catch (error) {
      throw error;
    }
  }

  async validateUserAccess(userId, requiredRole) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.role !== requiredRole) {
        throw new Error('Insufficient permissions');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserStats(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const { pool } = require('../database/connection');
      let stats = {};

      if (user.role === 'tailor') {
        // Get tailor statistics
        const [customerCount] = await pool.execute(
          'SELECT COUNT(*) as count FROM customers WHERE tailor_id = ?',
          [userId]
        );

        const [orderStats] = await pool.execute(
          `SELECT 
            COUNT(*) as total_orders,
            SUM(CASE WHEN status IN ('pending', 'in_progress') THEN 1 ELSE 0 END) as active_orders,
            SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders,
            SUM(total_amount) as total_revenue,
            SUM(remaining_amount) as pending_payments
          FROM orders WHERE tailor_id = ?`,
          [userId]
        );

        stats = {
          totalCustomers: customerCount[0].count,
          totalOrders: orderStats[0].total_orders || 0,
          activeOrders: orderStats[0].active_orders || 0,
          completedOrders: orderStats[0].completed_orders || 0,
          totalRevenue: parseFloat(orderStats[0].total_revenue) || 0,
          pendingPayments: parseFloat(orderStats[0].pending_payments) || 0
        };
      } else {
        // Get customer statistics
        const [orderStats] = await pool.execute(
          `SELECT 
            COUNT(*) as total_orders,
            SUM(CASE WHEN status IN ('pending', 'in_progress') THEN 1 ELSE 0 END) as active_orders,
            SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders,
            SUM(remaining_amount) as pending_payments
          FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE email = ?)`,
          [user.email]
        );

        stats = {
          totalOrders: orderStats[0].total_orders || 0,
          activeOrders: orderStats[0].active_orders || 0,
          completedOrders: orderStats[0].completed_orders || 0,
          pendingPayments: parseFloat(orderStats[0].pending_payments) || 0
        };
      }

      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();