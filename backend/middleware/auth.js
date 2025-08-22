const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Add JWT decoded info to user object for easy access
    req.user = {
      ...user.toJSON(),
      company_id: decoded.companyId || user.company_id,
      role: decoded.role || user.role
    };

    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check user roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

// Utility function to generate JWT token
const generateToken = (userId, companyId, role) => {
  return jwt.sign(
    {
      userId,
      companyId,
      role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Middleware to ensure company data isolation
const ensureCompanyAccess = (req, res, next) => {
  if (!req.user || !req.user.company_id) {
    return res.status(403).json({ message: 'Company access required' });
  }

  // Add company filter to request for easy access in routes
  req.companyFilter = { company_id: req.user.company_id };
  next();
};

// Middleware to check if user can manage other users
const canManageUsers = (req, res, next) => {
  const userRole = req.user.role;

  if (userRole === 'Staff') {
    return res.status(403).json({
      message: 'Staff members cannot manage users'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  generateToken,
  ensureCompanyAccess,
  canManageUsers
};
