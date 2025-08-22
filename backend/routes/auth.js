const express = require('express');
const { body, validationResult } = require('express-validator');
const { Company, User } = require('../models');
const { generateToken } = require('../middleware/auth');
const { sequelize } = require('../config/database');

const router = express.Router();

// Register new company with admin user
router.post('/register', [
  body('companyName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
], async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await t.rollback();
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { companyName, username, password, email } = req.body;

    // Check if company name already exists
    const existingCompany = await Company.findOne({
      where: { name: companyName },
      transaction: t
    });
    if (existingCompany) {
      await t.rollback();
      return res.status(400).json({ message: 'Company name already exists' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({
      where: { username },
      transaction: t
    });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new company
    const company = await Company.create({
      name: companyName,
      email: email || null
    }, { transaction: t });

    // Create admin user for the company
    const user = await User.create({
      username,
      password,
      role: 'Admin', // Force Admin role for company registration
      company_id: company.id
    }, { transaction: t });

    await t.commit();

    // Generate token with company info
    const token = generateToken(user.id, company.id, user.role);

    res.status(201).json({
      message: 'Company and admin user created successfully',
      token,
      role: user.role,
      companyId: company.id,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        company_id: company.id,
        company: {
          id: company.id,
          name: company.name
        }
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login user
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Find user by username with company info
    const user = await User.findOne({
      where: { username },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'status']
      }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if company is active
    if (user.company.status !== 'active') {
      return res.status(401).json({ message: 'Company account is inactive' });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token with company info
    const token = generateToken(user.id, user.company_id, user.role);

    res.json({
      message: 'Login successful',
      token,
      role: user.role,
      companyId: user.company_id,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        company_id: user.company_id,
        company: {
          id: user.company.id,
          name: user.company.name
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
