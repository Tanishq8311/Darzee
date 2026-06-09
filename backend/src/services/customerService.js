const Customer = require('../models/Customer');
const { generateId } = require('../utils/helpers');

class CustomerService {
  async getCustomersByTailor(tailorId) {
    try {
      const customers = await Customer.findByTailorId(tailorId);
      return customers.map(customer => customer.toJSON());
    } catch (error) {
      throw error;
    }
  }

  async addCustomer(customerData, tailorId) {
    try {
      const { name, email, phone, address, measurements } = customerData;
      
      // Validate required fields
      if (!name || !email || !phone) {
        throw new Error('Name, email, and phone are required');
      }

      // Generate customer ID
      const customerId = generateId();

      const customer = await Customer.create({
        id: customerId,
        name,
        email,
        phone,
        address,
        tailorId,
        measurements
      });

      return {
        message: 'Customer added successfully',
        customer: customer.toJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  async updateCustomer(customerId, updateData, tailorId) {
    try {
      // Verify customer belongs to this tailor
      const isOwner = await Customer.verifyOwnership(customerId, tailorId);
      if (!isOwner) {
        throw new Error('Customer not found');
      }

      const customer = await Customer.findById(customerId);
      const updatedCustomer = await customer.update(updateData);

      return {
        message: 'Customer updated successfully',
        customer: updatedCustomer.toJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteCustomer(customerId, tailorId) {
    try {
      // Verify customer belongs to this tailor
      const isOwner = await Customer.verifyOwnership(customerId, tailorId);
      if (!isOwner) {
        throw new Error('Customer not found');
      }

      const customer = await Customer.findById(customerId);
      await customer.delete();

      return { message: 'Customer deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getCustomerById(customerId, tailorId) {
    try {
      // Verify customer belongs to this tailor
      const isOwner = await Customer.verifyOwnership(customerId, tailorId);
      if (!isOwner) {
        throw new Error('Customer not found');
      }

      const customer = await Customer.findById(customerId);
      return customer.toJSON();
    } catch (error) {
      throw error;
    }
  }

  async searchCustomers(tailorId, searchTerm) {
    try {
      const customers = await Customer.findByTailorId(tailorId);
      
      if (!searchTerm) {
        return customers.map(customer => customer.toJSON());
      }

      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );

      return filtered.map(customer => customer.toJSON());
    } catch (error) {
      throw error;
    }
  }

  async getCustomerStats(tailorId) {
    try {
      const { pool } = require('../database/connection');
      
      const [stats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_customers,
          SUM(CASE WHEN DATEDIFF(CURRENT_DATE, updated_at) <= 30 THEN 1 ELSE 0 END) as active_this_month,
          SUM(CASE WHEN DATEDIFF(CURRENT_DATE, created_at) <= 7 THEN 1 ELSE 0 END) as new_this_week
        FROM customers WHERE tailor_id = ?`,
        [tailorId]
      );

      return {
        totalCustomers: stats[0].total_customers || 0,
        activeThisMonth: stats[0].active_this_month || 0,
        newThisWeek: stats[0].new_this_week || 0
      };
    } catch (error) {
      throw error;
    }
  }

  validateCustomerData(customerData) {
    const { name, email, phone } = customerData;
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Valid email is required');
    }

    if (!phone || phone.trim().length < 10) {
      errors.push('Valid phone number is required');
    }

    return errors;
  }
}

module.exports = new CustomerService();