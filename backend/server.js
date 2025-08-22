const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { sequelize, testConnection } = require('./config/database');
const { Company, User, Product, Transaction } = require('./models');
const { migrateToCompanySupport } = require('./migrations/add-company-support');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const transactionRoutes = require('./routes/transactions');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Inventory Management API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Database initialization and server startup
const initializeServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database (create tables if they don't exist, alter if needed)
    console.log('🔄 Synchronizing database...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully');

    // Run migration for company support
    try {
      await migrateToCompanySupport();
    } catch (error) {
      console.log('ℹ️ Migration already completed or not needed');
    }

    // Database is ready for company registrations
    console.log('✅ System ready for company registrations');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 API Health check: http://localhost:${PORT}/api/health`);
      console.log('🏢 Ready for company registrations at http://localhost:${PORT}/api/auth/register');
      console.log('🔐 Multi-company inventory management system is live!');
    });

  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Initialize the server
initializeServer();
