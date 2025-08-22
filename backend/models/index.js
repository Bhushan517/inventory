const Company = require('./Company');
const User = require('./User');
const Product = require('./Product');
const Transaction = require('./Transaction');

// Define associations

// Company has many Users, Products
Company.hasMany(User, {
  foreignKey: 'company_id',
  as: 'users'
});

Company.hasMany(Product, {
  foreignKey: 'company_id',
  as: 'products'
});

// User belongs to Company
User.belongsTo(Company, {
  foreignKey: 'company_id',
  as: 'company'
});

// Product belongs to Company
Product.belongsTo(Company, {
  foreignKey: 'company_id',
  as: 'company'
});

// Transaction belongs to User and Product
Transaction.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Transaction.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

// User has many Transactions
User.hasMany(Transaction, {
  foreignKey: 'userId',
  as: 'transactions'
});

// Product has many Transactions
Product.hasMany(Transaction, {
  foreignKey: 'productId',
  as: 'transactions'
});

module.exports = {
  Company,
  User,
  Product,
  Transaction
};
