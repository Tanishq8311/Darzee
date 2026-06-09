const { testConnection } = require('../database/connection');
const { initializeDatabase } = require('../database/init');

async function initDB() {
  console.log('🚀 Initializing Darzee Database...');
  
  try {
    await testConnection();
    await initializeDatabase();
    
    console.log('✅ Database initialization completed successfully!');
    console.log('📋 You can now:');
    console.log('   - Run "npm run dev" to start the development server');
    console.log('   - Use the API endpoints for authentication, customers, orders, etc.');
    console.log('   - Connect your frontend to http://localhost:5000');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('💡 Make sure MySQL is running and credentials are correct in .env file');
    process.exit(1);
  }
  
  process.exit(0);
}

initDB();