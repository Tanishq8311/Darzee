const { pool } = require('../database/connection');

class Customer {
  constructor(customerData) {
    this.id = customerData.id;
    this.name = customerData.name;
    this.email = customerData.email;
    this.phone = customerData.phone;
    this.address = customerData.address;
    this.tailorId = customerData.tailor_id;
    this.measurements = customerData.measurements;
    this.createdAt = customerData.created_at;
    this.updatedAt = customerData.updated_at;
  }

  static async findById(id) {
    try {
      const [customers] = await pool.execute(
        'SELECT * FROM customers WHERE id = ?',
        [id]
      );
      return customers.length > 0 ? new Customer(customers[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async findByTailorId(tailorId) {
    try {
      const [customers] = await pool.execute(
        'SELECT * FROM customers WHERE tailor_id = ? ORDER BY created_at DESC',
        [tailorId]
      );
      return customers.map(customer => new Customer(customer));
    } catch (error) {
      throw error;
    }
  }

  static async create(customerData) {
    try {
      const { id, name, email, phone, address, tailorId, measurements } = customerData;
      
      await pool.execute(
        `INSERT INTO customers (id, name, email, phone, address, tailor_id, measurements) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          name,
          email,
          phone,
          address || '',
          tailorId,
          measurements ? JSON.stringify(measurements) : null
        ]
      );

      return await Customer.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async update(updateData) {
    try {
      const updates = [];
      const values = [];
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          if (key === 'measurements') {
            updates.push('measurements = ?');
            values.push(JSON.stringify(updateData[key]));
          } else {
            updates.push(`${key} = ?`);
            values.push(updateData[key]);
          }
        }
      });

      if (updates.length === 0) {
        return this;
      }

      values.push(this.id);

      await pool.execute(
        `UPDATE customers SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      return await Customer.findById(this.id);
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      await pool.execute('DELETE FROM customers WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async verifyOwnership(customerId, tailorId) {
    try {
      const [customers] = await pool.execute(
        'SELECT id FROM customers WHERE id = ? AND tailor_id = ?',
        [customerId, tailorId]
      );
      return customers.length > 0;
    } catch (error) {
      throw error;
    }
  }

  toJSON() {
    return {
      ...this,
      measurements: typeof this.measurements === 'string' 
        ? JSON.parse(this.measurements) 
        : this.measurements
    };
  }
}

module.exports = Customer;