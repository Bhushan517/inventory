const express = require('express');
const { body, validationResult } = require('express-validator');
const { Product, Company } = require('../models');
const { authenticateToken, authorizeRoles, ensureCompanyAccess } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and company access to all routes
router.use(authenticateToken);
router.use(ensureCompanyAccess);

// Get all products in same company (All authenticated users)
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: req.companyFilter,
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get product by ID (All authenticated users)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new product (Admin and Manager only)
router.post('/', [
  authorizeRoles('Admin', 'Manager'),
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name must be between 1 and 100 characters'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('category')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, quantity, price, category } = req.body;

    const product = await Product.create({
      name,
      quantity,
      price,
      category,
      company_id: req.user.company_id
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update product (Admin and Manager only)
router.put('/:id', [
  authorizeRoles('Admin', 'Manager'),
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name must be between 1 and 100 characters'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findOne({
      where: {
        id: req.params.id,
        company_id: req.user.company_id
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found in your company' });
    }

    const { name, quantity, price, category } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;

    await product.update(updateData);

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete product (Admin and Manager only)
router.delete('/:id', authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
        company_id: req.user.company_id
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found in your company' });
    }

    await product.destroy();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
