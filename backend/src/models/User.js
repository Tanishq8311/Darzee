const { pool } = require('../database/connection');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.phone = userData.phone;
    this.address = userData.address;
    this.role = userData.role;
    this.profileImage = userData.profile_image;
    this.shopName = userData.shop_name;
    this.experience = userData.experience;
    this.specialization = userData.specialization;
    this.createdAt = userData.created_at;
    this.updatedAt = userData.updated_at;
  }

  static async findById(id) {
    try {
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return users.length > 0 ? new User(users[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return users.length > 0 ? new User(users[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    try {
      const { id, name, email, password, phone, role, shopName, experience, specialization } = userData;
      
      const specializationData = specialization ? JSON.stringify(
        Array.isArray(specialization) ? specialization : [specialization]
      ) : null;

      await pool.execute(
        `INSERT INTO users (id, name, email, password, phone, role, shop_name, experience, specialization) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, email, password, phone, role, shopName || null, experience || null, specializationData]
      );

      return await User.findById(id);
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
          if (key === 'specialization') {
            updates.push('specialization = ?');
            values.push(JSON.stringify(updateData[key]));
          } else if (key === 'shopName') {
            updates.push('shop_name = ?');
            values.push(updateData[key]);
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
        `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      return await User.findById(this.id);
    } catch (error) {
      throw error;
    }
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return {
      ...userWithoutPassword,
      specialization: typeof this.specialization === 'string' 
        ? JSON.parse(this.specialization) 
        : this.specialization
    };
  }
}

module.exports = User;