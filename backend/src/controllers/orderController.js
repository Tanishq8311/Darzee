const { validationResult } = require('express-validator');
const OrderService = require('../services/orderService');

class OrderController {
  async getOrders(req, res) {
    try {
      const { status, search } = req.query;
      
      let orders = await OrderService.getOrdersByUser(
        req.user.id, 
        req.user.role, 
        req.user.email
      );

      // Apply filters
      if (status && status !== 'all') {
        orders = orders.filter(order => order.status === status);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        orders = orders.filter(order => 
          order.customerName.toLowerCase().includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower)
        );
      }

      res.json(orders);

    } catch (error) {
      console.error('Orders fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async createOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Additional validation using service
      const validationErrors = OrderService.validateOrderData(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          errors: validationErrors.map(error => ({ message: error }))
        });
      }

      const result = await OrderService.createOrder(req.body, req.user.id);
      res.status(201).json(result);

    } catch (error) {
      console.error('Order creation error:', error);
      
      if (error.message.includes('required') || 
          error.message.includes('not found') ||
          error.message.includes('cannot be greater than')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  async updateOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const result = await OrderService.updateOrder(id, req.body, req.user.id);
      res.json(result);

    } catch (error) {
      console.error('Order update error:', error);
      
      if (error.message === 'Order not found' ||
          error.message.includes('cannot be greater than')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to update order' });
    }
  }

  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const result = await OrderService.deleteOrder(id, req.user.id);
      res.json(result);

    } catch (error) {
      console.error('Order deletion error:', error);
      
      if (error.message === 'Order not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to delete order' });
    }
  }

  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id, req.user.id, req.user.role);
      res.json(order);

    } catch (error) {
      console.error('Order fetch error:', error);
      
      if (error.message === 'Order not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  async getOrderStats(req, res) {
    try {
      const stats = await OrderService.getOrderStats(
        req.user.id, 
        req.user.role, 
        req.user.email
      );
      res.json(stats);

    } catch (error) {
      console.error('Order stats error:', error);
      res.status(500).json({ error: 'Failed to fetch order stats' });
    }
  }

  async getOverdueOrders(req, res) {
    try {
      if (req.user.role !== 'tailor') {
        return res.status(403).json({ error: 'Only tailors can view overdue orders' });
      }

      const orders = await OrderService.getOverdueOrders(req.user.id);
      res.json(orders);

    } catch (error) {
      console.error('Overdue orders error:', error);
      res.status(500).json({ error: 'Failed to fetch overdue orders' });
    }
  }
}

module.exports = new OrderController();