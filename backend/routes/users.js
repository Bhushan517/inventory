const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, Company } = require('../models');
const { authenticateToken, authorizeRoles, ensureCompanyAccess, canManageUsers } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and company access to all routes
router.use(authenticateToken);
router.use(ensureCompanyAccess);

// Get all users in same company (Admin and Manager only)
router.get('/', canManageUsers, async (req, res) => {
  try {
    const users = await User.findAll({
      where: req.companyFilter,
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user by ID (Admin and Manager can view users in their company)
router.get('/:id', canManageUsers, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
        company_id: req.user.company_id
      },
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found in your company' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new user (Admin can create Manager/Staff, Manager can create Staff only)
router.post('/', [
  canManageUsers,
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['Admin', 'Manager', 'Staff'])
    .withMessage('Role must be Admin, Manager, or Staff')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password, role } = req.body;
    const currentUserRole = req.user.role;

    // Role creation rules
    if (currentUserRole === 'Manager' && (role === 'Admin' || role === 'Manager')) {
      return res.status(403).json({
        message: 'Managers can only create Staff users'
      });
    }

    // Check if username already exists (globally, not just in company)
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = await User.create({
      username,
      password,
      role,
      company_id: req.user.company_id
    });

    // Fetch user with company info
    const userWithCompany = await User.findByPk(user.id, {
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name']
      }]
    });

    res.status(201).json({
      message: 'User created successfully',
      user: userWithCompany
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user (Admin and Manager can update users in their company)
router.put('/:id', [
  canManageUsers,
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['Admin', 'Manager', 'Staff'])
    .withMessage('Role must be Admin, Manager, or Staff')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findOne({
      where: {
        id: req.params.id,
        company_id: req.user.company_id
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found in your company' });
    }

    const { username, password, role } = req.body;
    const currentUserRole = req.user.role;

    // Role update rules
    if (role && currentUserRole === 'Manager' && (role === 'Admin' || role === 'Manager')) {
      return res.status(403).json({
        message: 'Managers can only manage Staff users'
      });
    }

    // Check if new username already exists (if username is being changed)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    // Update user
    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = password;
    if (role) updateData.role = role;

    await user.update(updateData);

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user (Admin and Manager can delete users in their company)
router.delete('/:id', canManageUsers, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
        company_id: req.user.company_id
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found in your company' });
    }

    // Prevent user from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Role deletion rules
    const currentUserRole = req.user.role;
    if (currentUserRole === 'Manager' && (user.role === 'Admin' || user.role === 'Manager')) {
      return res.status(403).json({
        message: 'Managers can only delete Staff users'
      });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
