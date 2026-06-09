const { pool } = require('../database/connection');
const { generateId } = require('../utils/helpers');

class DesignService {
  async getAllActiveDesigns() {
    try {
      const [designs] = await pool.execute(
        'SELECT * FROM designs WHERE is_active = TRUE ORDER BY name ASC'
      );

      return designs;
    } catch (error) {
      throw error;
    }
  }

  async getAllDesigns(includeInactive = false) {
    try {
      let query = 'SELECT * FROM designs ORDER BY name ASC';
      if (!includeInactive) {
        query = 'SELECT * FROM designs WHERE is_active = TRUE ORDER BY name ASC';
      }

      const [designs] = await pool.execute(query);
      return designs;
    } catch (error) {
      throw error;
    }
  }

  async createDesign(designData) {
    try {
      const { name, type, description, base_price } = designData;
      
      if (!name || !type || base_price === undefined) {
        throw new Error('Name, type, and base price are required');
      }

      if (base_price < 0) {
        throw new Error('Base price must be a positive number');
      }

      const designId = generateId();

      await pool.execute(
        `INSERT INTO designs (id, name, type, description, base_price) 
         VALUES (?, ?, ?, ?, ?)`,
        [designId, name, type, description || '', base_price]
      );

      // Fetch the created design
      const [designs] = await pool.execute(
        'SELECT * FROM designs WHERE id = ?',
        [designId]
      );

      return {
        message: 'Design added successfully',
        design: designs[0]
      };
    } catch (error) {
      throw error;
    }
  }

  async updateDesign(designId, updateData) {
    try {
      const { name, type, description, base_price, is_active } = updateData;

      const updates = [];
      const values = [];
      
      if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
      }
      if (type !== undefined) {
        updates.push('type = ?');
        values.push(type);
      }
      if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
      }
      if (base_price !== undefined) {
        if (base_price < 0) {
          throw new Error('Base price must be a positive number');
        }
        updates.push('base_price = ?');
        values.push(base_price);
      }
      if (is_active !== undefined) {
        updates.push('is_active = ?');
        values.push(is_active);
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(designId);

      const result = await pool.execute(
        `UPDATE designs SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      if (result[0].affectedRows === 0) {
        throw new Error('Design not found');
      }

      return { message: 'Design updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async deleteDesign(designId) {
    try {
      // Soft delete by setting is_active to false
      const result = await pool.execute(
        'UPDATE designs SET is_active = FALSE WHERE id = ?',
        [designId]
      );

      if (result[0].affectedRows === 0) {
        throw new Error('Design not found');
      }

      return { message: 'Design deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getDesignById(designId) {
    try {
      const [designs] = await pool.execute(
        'SELECT * FROM designs WHERE id = ?',
        [designId]
      );

      if (designs.length === 0) {
        throw new Error('Design not found');
      }

      return designs[0];
    } catch (error) {
      throw error;
    }
  }

  async searchDesigns(searchTerm, type = null) {
    try {
      let query = 'SELECT * FROM designs WHERE is_active = TRUE';
      const params = [];

      if (searchTerm) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${searchTerm}%`, `%${searchTerm}%`);
      }

      if (type) {
        query += ' AND type = ?';
        params.push(type);
      }

      query += ' ORDER BY name ASC';

      const [designs] = await pool.execute(query, params);
      return designs;
    } catch (error) {
      throw error;
    }
  }

  async getDesignTypes() {
    try {
      const [types] = await pool.execute(
        'SELECT DISTINCT type FROM designs WHERE is_active = TRUE ORDER BY type ASC'
      );

      return types.map(row => row.type);
    } catch (error) {
      throw error;
    }
  }

  async getDesignStats() {
    try {
      const [stats] = await pool.execute(
        `SELECT 
          COUNT(*) as total_designs,
          SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_designs,
          AVG(base_price) as average_price,
          MIN(base_price) as min_price,
          MAX(base_price) as max_price
         FROM designs`
      );

      return {
        totalDesigns: stats[0].total_designs || 0,
        activeDesigns: stats[0].active_designs || 0,
        averagePrice: parseFloat(stats[0].average_price) || 0,
        minPrice: parseFloat(stats[0].min_price) || 0,
        maxPrice: parseFloat(stats[0].max_price) || 0
      };
    } catch (error) {
      throw error;
    }
  }

  async getPopularDesigns(limit = 10) {
    try {
      const [designs] = await pool.execute(
        `SELECT d.*, COUNT(oi.design_id) as order_count
         FROM designs d
         LEFT JOIN order_items oi ON d.id = oi.design_id
         WHERE d.is_active = TRUE
         GROUP BY d.id
         ORDER BY order_count DESC, d.name ASC
         LIMIT ?`,
        [limit]
      );

      return designs;
    } catch (error) {
      throw error;
    }
  }

  validateDesignData(designData) {
    const { name, type, base_price } = designData;
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (!type || type.trim().length < 2) {
      errors.push('Type is required');
    }

    if (base_price === undefined || base_price < 0) {
      errors.push('Base price must be a positive number');
    }

    return errors;
  }
}

module.exports = new DesignService();