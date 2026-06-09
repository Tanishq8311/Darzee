const { pool } = require('../database/connection');

class Order {
  constructor(orderData) {
    this.id = orderData.id;
    this.customerId = orderData.customer_id;
    this.customerName = orderData.customer_name;
    this.tailorId = orderData.tailor_id;
    this.status = orderData.status;
    this.totalAmount = orderData.total_amount;
    this.advanceAmount = orderData.advance_amount;
    this.remainingAmount = orderData.remaining_amount;
    this.orderDate = orderData.order_date;
    this.estimatedDeliveryDate = orderData.estimated_delivery_date;
    this.actualDeliveryDate = orderData.actual_delivery_date;
    this.notes = orderData.notes;
    this.createdAt = orderData.created_at;
    this.updatedAt = orderData.updated_at;
    this.items = orderData.items || [];
  }

  static async findById(id) {
    try {
      const [orders] = await pool.execute(
        `SELECT o.*, GROUP_CONCAT(
          JSON_OBJECT(
            'id', oi.id,
            'design_id', oi.design_id,
            'design_name', oi.design_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price,
            'measurements', oi.measurements,
            'customizations', oi.customizations
          )
        ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = ?
        GROUP BY o.id`,
        [id]
      );
      
      if (orders.length === 0) return null;
      
      const order = orders[0];
      order.items = order.items ? JSON.parse(`[${order.items}]`).map(item => ({
        ...item,
        measurements: item.measurements ? JSON.parse(item.measurements) : null,
        customizations: item.customizations ? JSON.parse(item.customizations) : null
      })) : [];
      
      return new Order(order);
    } catch (error) {
      throw error;
    }
  }

  static async findByTailorId(tailorId) {
    try {
      const [orders] = await pool.execute(
        `SELECT o.*, GROUP_CONCAT(
          JSON_OBJECT(
            'id', oi.id,
            'design_id', oi.design_id,
            'design_name', oi.design_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price,
            'measurements', oi.measurements,
            'customizations', oi.customizations
          )
        ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.tailor_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC`,
        [tailorId]
      );

      return orders.map(order => {
        order.items = order.items ? JSON.parse(`[${order.items}]`).map(item => ({
          ...item,
          measurements: item.measurements ? JSON.parse(item.measurements) : null,
          customizations: item.customizations ? JSON.parse(item.customizations) : null
        })) : [];
        return new Order(order);
      });
    } catch (error) {
      throw error;
    }
  }

  static async findByCustomerEmail(customerEmail) {
    try {
      const [orders] = await pool.execute(
        `SELECT o.*, GROUP_CONCAT(
          JSON_OBJECT(
            'id', oi.id,
            'design_id', oi.design_id,
            'design_name', oi.design_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price,
            'measurements', oi.measurements,
            'customizations', oi.customizations
          )
        ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.customer_id IN (SELECT id FROM customers WHERE email = ?)
        GROUP BY o.id
        ORDER BY o.created_at DESC`,
        [customerEmail]
      );

      return orders.map(order => {
        order.items = order.items ? JSON.parse(`[${order.items}]`).map(item => ({
          ...item,
          measurements: item.measurements ? JSON.parse(item.measurements) : null,
          customizations: item.customizations ? JSON.parse(item.customizations) : null
        })) : [];
        return new Order(order);
      });
    } catch (error) {
      throw error;
    }
  }

  static async create(orderData) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const { id, customerId, customerName, tailorId, items, estimatedDeliveryDate, advanceAmount = 0, notes } = orderData;
      
      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const remainingAmount = totalAmount - advanceAmount;

      // Insert order
      await connection.execute(
        `INSERT INTO orders (id, customer_id, customer_name, tailor_id, total_amount, 
         advance_amount, remaining_amount, estimated_delivery_date, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, customerId, customerName, tailorId, totalAmount, 
         advanceAmount, remainingAmount, estimatedDeliveryDate, notes || '']
      );

      // Insert order items
      for (const item of items) {
        await connection.execute(
          `INSERT INTO order_items (id, order_id, design_id, design_name, quantity, 
           unit_price, total_price, measurements, customizations) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            item.id,
            id,
            item.design_id,
            item.design_name,
            item.quantity,
            item.unit_price,
            item.quantity * item.unit_price,
            item.measurements ? JSON.stringify(item.measurements) : null,
            item.customizations ? JSON.stringify(item.customizations) : null
          ]
        );
      }

      await connection.commit();
      return await Order.findById(id);

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async update(updateData) {
    try {
      const updates = [];
      const values = [];
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          if (key === 'estimatedDeliveryDate') {
            updates.push('estimated_delivery_date = ?');
            values.push(updateData[key]);
          } else if (key === 'advanceAmount') {
            updates.push('advance_amount = ?');
            updates.push('remaining_amount = total_amount - ?');
            values.push(updateData[key]);
            values.push(updateData[key]);
          } else {
            updates.push(`${key} = ?`);
            values.push(updateData[key]);
          }
        }
      });

      // Set actual delivery date when status is delivered
      if (updateData.status === 'delivered') {
        updates.push('actual_delivery_date = CURDATE()');
      }

      if (updates.length === 0) {
        return this;
      }

      values.push(this.id);

      await pool.execute(
        `UPDATE orders SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      return await Order.findById(this.id);
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      await pool.execute('DELETE FROM orders WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async verifyOwnership(orderId, tailorId) {
    try {
      const [orders] = await pool.execute(
        'SELECT id FROM orders WHERE id = ? AND tailor_id = ?',
        [orderId, tailorId]
      );
      return orders.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Order;