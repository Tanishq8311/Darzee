const { validationResult } = require('express-validator');
const CustomerService = require('../services/customerService');

class CustomerController {
  async getCustomers(req, res) {
    try {
      const { search } = req.query;
      
      let customers;
      if (search) {
        customers = await CustomerService.searchCustomers(req.user.id, search);
      } else {
        customers = await CustomerService.getCustomersByTailor(req.user.id);
      }
      
      res.json(customers);

    } catch (error) {
      console.error('Customers fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  }

  async addCustomer(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Additional validation using service
      const validationErrors = CustomerService.validateCustomerData(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          errors: validationErrors.map(error => ({ message: error }))
        });
      }

      const result = await CustomerService.addCustomer(req.body, req.user.id);
      res.status(201).json(result);

    } catch (error) {
      console.error('Customer creation error:', error);
      
      if (error.message.includes('required')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to add customer' });
    }
  }

  async updateCustomer(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const result = await CustomerService.updateCustomer(id, req.body, req.user.id);
      res.json(result);

    } catch (error) {
      console.error('Customer update error:', error);
      
      if (error.message === 'Customer not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to update customer' });
    }
  }

  async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const result = await CustomerService.deleteCustomer(id, req.user.id);
      res.json(result);

    } catch (error) {
      console.error('Customer deletion error:', error);
      
      if (error.message === 'Customer not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to delete customer' });
    }
  }

  async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const customer = await CustomerService.getCustomerById(id, req.user.id);
      res.json(customer);

    } catch (error) {
      console.error('Customer fetch error:', error);
      
      if (error.message === 'Customer not found') {
        return res.status(404).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  }

  async getCustomerStats(req, res) {
    try {
      const stats = await CustomerService.getCustomerStats(req.user.id);
      res.json(stats);

    } catch (error) {
      console.error('Customer stats error:', error);
      res.status(500).json({ error: 'Failed to fetch customer stats' });
    }
  }
}

module.exports = new CustomerController();