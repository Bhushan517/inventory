const express = require('express');
const { body, validationResult } = require('express-validator');
const { Transaction, Product, User, Company } = require('../models');
const { authenticateToken, authorizeRoles, ensureCompanyAccess } = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();

// Apply authentication and company access to all routes
router.use(authenticateToken);
router.use(ensureCompanyAccess);

// Get all transactions in same company (All authenticated users)
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: User,
          as: 'user',
          where: { company_id: req.user.company_id },
          attributes: ['id', 'username', 'role']
        },
        {
          model: Product,
          as: 'product',
          where: { company_id: req.user.company_id },
          attributes: ['id', 'name', 'category']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get transaction by ID (All authenticated users)
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'role']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'category']
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new transaction (All authenticated users)
router.post('/', [
  body('productId')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
  body('action')
    .isIn(['IN', 'OUT'])
    .withMessage('Action must be either IN or OUT'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
], async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, action, quantity } = req.body;
    const userId = req.user.id;

    // Find the product in same company
    const product = await Product.findOne({
      where: {
        id: productId,
        company_id: req.user.company_id
      },
      transaction: t
    });

    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: 'Product not found in your company' });
    }

    // Check if there's enough stock for OUT transactions
    if (action === 'OUT' && product.quantity < quantity) {
      await t.rollback();
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${product.quantity}, Requested: ${quantity}` 
      });
    }

    // Create the transaction
    const transaction = await Transaction.create({
      productId,
      userId,
      action,
      quantity
    }, { transaction: t });

    // Update product stock
    let newQuantity;
    if (action === 'IN') {
      newQuantity = product.quantity + quantity;
    } else {
      newQuantity = product.quantity - quantity;
    }

    await product.update({ quantity: newQuantity }, { transaction: t });

    // Commit the transaction
    await t.commit();

    // Fetch the created transaction with associations
    const createdTransaction = await Transaction.findByPk(transaction.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'role']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'category']
        }
      ]
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: createdTransaction
    });
  } catch (error) {
    await t.rollback();
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get transactions by user (All authenticated users can see their own)
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Users can only see their own transactions unless they're Admin
    if (req.user.role !== 'Admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const transactions = await Transaction.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'role']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'category']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get transactions by product (All authenticated users)
router.get('/product/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);

    const transactions = await Transaction.findAll({
      where: { productId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'role']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'category']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    console.error('Get product transactions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
