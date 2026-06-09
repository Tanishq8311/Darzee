const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { generateId } = require('../utils/helpers');
const NotificationService = require('./notificationService');

class OrderService {
  async getOrdersByUser(userId, userRole, userEmail) {
    try {
      let orders;
      
      if (userRole === 'tailor') {
        orders = await Order.findByTailorId(userId);
      } else {
        orders = await Order.findByCustomerEmail(userEmail);
      }

      return orders;
    } catch (error) {
      throw error;
    }
  }

  async createOrder(orderData, tailorId) {
    try {
      const { customer_id, items, estimated_delivery_date, advance_amount = 0, notes } = orderData;
      
      // Validate required fields
      if (!customer_id || !items || items.length === 0 || !estimated_delivery_date) {
        throw new Error('Customer, items, and delivery date are required');
      }

      // Verify customer belongs to this tailor
      const isOwner = await Customer.verifyOwnership(customer_id, tailorId);
      if (!isOwner) {
        throw new Error('Customer not found');
      }

      // Get customer details
      const customer = await Customer.findById(customer_id);
      
      // Generate order ID and item IDs
      const orderId = generateId();
      const processedItems = items.map(item => ({
        ...item,
        id: generateId()
      }));

      // Calculate totals
      const totalAmount = processedItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      
      if (advance_amount > totalAmount) {
        throw new Error('Advance amount cannot be greater than total amount');
      }

      const order = await Order.create({
        id: orderId,
        customerId: customer_id,
        customerName: customer.name,
        tailorId,
        items: processedItems,
        estimatedDeliveryDate: estimated_delivery_date,
        advanceAmount: advance_amount,
        notes
      });

      // Create notification for order creation
      await NotificationService.createOrderNotification({
        userId: customer_id,
        orderId: orderId,
        type: 'order_created',
        title: 'New Order Created',
        message: `Your order #${orderId.slice(-6)} has been created and will be ready by ${new Date(estimated_delivery_date).toLocaleDateString()}.`
      });

      return {
        message: 'Order created successfully',
        order
      };
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(orderId, updateData, tailorId) {
    try {
      // Verify order belongs to this tailor
      const isOwner = await Order.verifyOwnership(orderId, tailorId);
      if (!isOwner) {
        throw new Error('Order not found');
      }

      const order = await Order.findById(orderId);
      
      // Validate advance amount if provided
      if (updateData.advanceAmount !== undefined && updateData.advanceAmount > order.totalAmount) {
        throw new Error('Advance amount cannot be greater than total amount');
      }

      const updatedOrder = await order.update(updateData);

      // Create notification for status updates
      if (updateData.status) {
        let notificationData = {
          userId: order.customerId,
          orderId: orderId,
          type: 'order_updated'
        };

        switch (updateData.status) {
          case 'in_progress':
            notificationData.title = 'Order In Progress';
            notificationData.message = `Your order #${orderId.slice(-6)} is now in progress.`;
            break;
          case 'ready':
            notificationData.title = 'Order Ready for Pickup';
            notificationData.message = `Your order #${orderId.slice(-6)} is ready! Please visit the shop to collect it.`;
            notificationData.type = 'order_ready';
            break;
          case 'delivered':
            notificationData.title = 'Order Delivered';
            notificationData.message = `Your order #${orderId.slice(-6)} has been delivered. Thank you for your business!`;
            break;
        }

        await NotificationService.createOrderNotification(notificationData);
      }

      return {
        message: 'Order updated successfully',
        order: updatedOrder
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteOrder(orderId, tailorId) {
    try {
      // Verify order belongs to this tailor
      const isOwner = await Order.verifyOwnership(orderId, tailorId);
      if (!isOwner) {
        throw new Error('Order not found');
      }

      const order = await Order.findById(orderId);
      await order.delete();

      return { message: 'Order deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(orderId, userId, userRole) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Verify access based on user role
      if (userRole === 'tailor' && order.tailorId !== userId) {
        throw new Error('Order not found');
      }

      if (userRole === 'customer') {
        // For customers, verify through customer relationship
        const isOwner = await Customer.verifyOwnership(order.customerId, userId);
        if (!isOwner) {
          throw new Error('Order not found');
        }
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  async getOrderStats(userId, userRole, userEmail) {
    try {
      const { pool } = require('../database/connection');
      let query, params;

      if (userRole === 'tailor') {
        query = `
          SELECT 
            COUNT(*) as total_orders,
            SUM(CASE WHEN status IN ('pending', 'in_progress') THEN 1 ELSE 0 END) as active_orders,
            SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders,
            SUM(total_amount) as total_revenue,
            SUM(remaining_amount) as pending_payments,
            SUM(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE) AND YEAR(created_at) = YEAR(CURRENT_DATE) THEN 1 ELSE 0 END) as monthly_orders
          FROM orders WHERE tailor_id = ?
        `;
        params = [userId];
      } else {
        query = `
          SELECT 
            COUNT(*) as total_orders,
            SUM(CASE WHEN status IN ('pending', 'in_progress') THEN 1 ELSE 0 END) as active_orders,
            SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders,
            SUM(remaining_amount) as pending_payments,
            SUM(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE) AND YEAR(created_at) = YEAR(CURRENT_DATE) THEN 1 ELSE 0 END) as monthly_orders
          FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE email = ?)
        `;
        params = [userEmail];
      }

      const [stats] = await pool.execute(query, params);

      return {
        totalOrders: stats[0].total_orders || 0,
        activeOrders: stats[0].active_orders || 0,
        completedOrders: stats[0].completed_orders || 0,
        totalRevenue: userRole === 'tailor' ? parseFloat(stats[0].total_revenue) || 0 : 0,
        pendingPayments: parseFloat(stats[0].pending_payments) || 0,
        monthlyOrders: stats[0].monthly_orders || 0
      };
    } catch (error) {
      throw error;
    }
  }

  async getOverdueOrders(tailorId) {
    try {
      const { pool } = require('../database/connection');
      
      const [orders] = await pool.execute(
        `SELECT * FROM orders 
         WHERE tailor_id = ? 
         AND estimated_delivery_date < CURRENT_DATE 
         AND status NOT IN ('delivered', 'cancelled')
         ORDER BY estimated_delivery_date ASC`,
        [tailorId]
      );

      return orders;
    } catch (error) {
      throw error;
    }
  }

  validateOrderData(orderData) {
    const { customer_id, items, estimated_delivery_date } = orderData;
    const errors = [];

    if (!customer_id) {
      errors.push('Customer selection is required');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.push('At least one item is required');
    }

    if (!estimated_delivery_date) {
      errors.push('Estimated delivery date is required');
    }

    if (items) {
      items.forEach((item, index) => {
        if (!item.design_id || !item.design_name || !item.quantity || !item.unit_price) {
          errors.push(`Item ${index + 1}: design, quantity, and price are required`);
        }
        if (item.quantity <= 0 || item.unit_price <= 0) {
          errors.push(`Item ${index + 1}: quantity and price must be positive numbers`);
        }
      });
    }

    return errors;
  }
}

module.exports = new OrderService();