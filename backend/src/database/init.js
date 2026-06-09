const mysql = require('mysql2/promise');
const { pool } = require('./connection');
require('dotenv').config();

// Initialize database and tables
async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    
    await tempPool.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await tempPool.end();
    
    // Create tables
    await createTables();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
}

async function createTables() {
  const connection = await pool.getConnection();
  
  try {
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        role ENUM('tailor', 'customer') NOT NULL,
        profile_image VARCHAR(255),
        shop_name VARCHAR(255),
        experience INT,
        specialization JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Customers table (for tailors to manage their customers)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT,
        tailor_id VARCHAR(36) NOT NULL,
        measurements JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tailor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Designs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS designs (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        base_price DECIMAL(10,2) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        tailor_id VARCHAR(36) NOT NULL,
        status ENUM('pending', 'in_progress', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        advance_amount DECIMAL(10,2) DEFAULT 0,
        remaining_amount DECIMAL(10,2) NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estimated_delivery_date DATE NOT NULL,
        actual_delivery_date DATE NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tailor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Order items table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,
        design_id VARCHAR(36) NOT NULL,
        design_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        measurements JSON,
        customizations JSON,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (design_id) REFERENCES designs(id)
      )
    `);

    // Notifications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('order_ready', 'eta_reminder', 'payment_due', 'order_created', 'order_updated') NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        order_id VARCHAR(36) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ All tables created successfully');
  } finally {
    connection.release();
  }
}

module.exports = {
  initializeDatabase
};