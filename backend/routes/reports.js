const express = require('express');
const { Transaction, Product, User, Company } = require('../models');
const { authenticateToken, authorizeRoles, ensureCompanyAccess } = require('../middleware/auth');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const router = express.Router();

// Apply authentication and company access to all routes
router.use(authenticateToken);
router.use(ensureCompanyAccess);

// Debug endpoint to check user info
router.get('/debug-user', (req, res) => {
  res.json({
    user: req.user,
    companyFilter: req.companyFilter
  });
});

// Stock movements report (Admin and Manager only)
router.get('/stock-movements', authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    console.log('Stock movements request - User:', req.user.id, 'Company:', req.user.company_id);

    // Get all transactions for products in this company
    const transactions = await Transaction.findAll({
      include: [{
        model: Product,
        as: 'product',
        where: { company_id: req.user.company_id },
        attributes: ['id', 'name']
      }],
      attributes: ['action', 'quantity']
    });

    console.log('Found transactions:', transactions.length);

    // Calculate totals manually
    let stockIn = 0;
    let stockOut = 0;

    transactions.forEach(transaction => {
      if (transaction.action === 'IN') {
        stockIn += transaction.quantity;
      } else if (transaction.action === 'OUT') {
        stockOut += transaction.quantity;
      }
    });

    const result = [
      { name: 'Stock IN', value: stockIn },
      { name: 'Stock OUT', value: stockOut }
    ];

    console.log('Stock movements result:', result);
    res.json(result);
  } catch (error) {
    console.error('Stock movements report error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Top 5 most moved products (Admin and Manager only)
router.get('/top-products', authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    // Get all transactions for products in this company
    const transactions = await Transaction.findAll({
      include: [{
        model: Product,
        as: 'product',
        where: { company_id: req.user.company_id },
        attributes: ['id', 'name']
      }],
      attributes: ['productId', 'quantity']
    });

    // Calculate totals manually
    const productMovements = {};

    transactions.forEach(transaction => {
      const productId = transaction.productId;
      const productName = transaction.product.name;

      if (!productMovements[productId]) {
        productMovements[productId] = {
          name: productName,
          movements: 0
        };
      }

      productMovements[productId].movements += transaction.quantity;
    });

    // Convert to array and sort by movements
    const result = Object.values(productMovements)
      .sort((a, b) => b.movements - a.movements)
      .slice(0, 5);

    res.json(result);
  } catch (error) {
    console.error('Top products report error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Transactions by date (Admin and Manager only)
router.get('/transactions-by-date', authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let whereClause = {};
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Get all transactions for products in this company
    const transactions = await Transaction.findAll({
      include: [{
        model: Product,
        as: 'product',
        where: { company_id: req.user.company_id },
        attributes: ['id']
      }],
      where: whereClause,
      attributes: ['created_at'],
      order: [['created_at', 'ASC']]
    });

    // Group by date manually
    const dateGroups = {};
    transactions.forEach(transaction => {
      const date = transaction.created_at.toISOString().split('T')[0];
      dateGroups[date] = (dateGroups[date] || 0) + 1;
    });

    const transactionsByDate = Object.entries(dateGroups).map(([date, count]) => ({
      date,
      transactions: count
    }));

    const result = transactionsByDate.map(item => ({
      date: item.date,
      transactions: parseInt(item.transactions)
    }));

    res.json(result);
  } catch (error) {
    console.error('Transactions by date report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Low stock products (Admin and Manager only)
router.get('/low-stock', authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    const threshold = req.query.threshold || 10; // Default threshold of 10

    const lowStockProducts = await Product.findAll({
      where: {
        company_id: req.user.company_id,
        quantity: {
          [Op.lte]: threshold
        }
      },
      order: [['quantity', 'ASC']]
    });

    res.json(lowStockProducts);
  } catch (error) {
    console.error('Low stock report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Dashboard summary (All authenticated users)
router.get('/dashboard-summary', authenticateToken, async (req, res) => {
  try {
    const companyId = req.user.company_id;

    // Total products in company
    const totalProducts = await Product.count({
      where: { company_id: companyId }
    });

    // Total transactions in company
    const totalTransactions = await Transaction.count({
      include: [{
        model: Product,
        as: 'product',
        where: { company_id: companyId },
        attributes: []
      }]
    });

    // Low stock items (quantity <= 10) in company
    const lowStockItems = await Product.count({
      where: {
        company_id: companyId,
        quantity: {
          [Op.lte]: 10
        }
      }
    });

    // Recent transactions (last 7 days) in company
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTransactions = await Transaction.count({
      include: [{
        model: Product,
        as: 'product',
        where: { company_id: companyId },
        attributes: []
      }],
      where: {
        created_at: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    // Total stock value in company
    const products = await Product.findAll({
      where: { company_id: companyId },
      attributes: ['quantity', 'price']
    });

    const totalStockValue = products.reduce((total, product) => {
      return total + (product.quantity * parseFloat(product.price));
    }, 0);

    res.json({
      totalProducts,
      totalTransactions,
      lowStockItems,
      recentTransactions,
      totalStockValue: parseFloat(totalStockValue.toFixed(2))
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User activity report (Admin only)
router.get('/user-activity', authorizeRoles('Admin'), async (req, res) => {
  try {
    const userActivity = await Transaction.findAll({
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('Transaction.id')), 'transactionCount']
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'role']
        }
      ],
      group: ['userId', 'user.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('Transaction.id')), 'DESC']]
    });

    const result = userActivity.map(item => ({
      username: item.user.username,
      role: item.user.role,
      transactionCount: parseInt(item.dataValues.transactionCount)
    }));

    res.json(result);
  } catch (error) {
    console.error('User activity report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
