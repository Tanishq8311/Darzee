const { v4: uuidv4 } = require('uuid');

// Generate UUID
const generateId = () => uuidv4();

// Password validation
const validatePassword = (password) => {
  const minLength = 6;
  return password && password.length >= minLength;
};

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Sanitize user data for response (remove sensitive fields)
const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

// Format date for MySQL
const formatDateForMySQL = (date) => {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};

// Calculate order totals
const calculateOrderTotals = (items) => {
  const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0);
  return {
    totalAmount: parseFloat(totalAmount.toFixed(2))
  };
};

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

module.exports = {
  generateId,
  validatePassword,
  validateEmail,
  validatePhone,
  sanitizeUser,
  formatDateForMySQL,
  calculateOrderTotals,
  generateOrderNumber
};