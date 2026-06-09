const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateId } = require('../utils/helpers');

class AuthService {
  async register(userData) {
    try {
      const { name, email, password, phone, role, shopName, experience, specialization } = userData;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));
      
      // Generate user ID
      const userId = generateId();
      
      // Create user
      const user = await User.create({
        id: userId,
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        shopName,
        experience,
        specialization
      });

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        message: 'User registered successfully',
        token,
        user: user.toJSON()
      };

    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    try {
      const { email, password } = credentials;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        message: 'Login successful',
        token,
        user: user.toJSON()
      };

    } catch (error) {
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get fresh user data
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        valid: true,
        user: user.toJSON()
      };

    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  generateToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

module.exports = new AuthService();