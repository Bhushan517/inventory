# Inventory Management System - Backend

A complete Express.js backend with Sequelize ORM and MySQL integration for inventory management.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-based Access Control**: Admin, Manager, and Staff roles with different permissions
- **Automatic Database Setup**: Auto-creates tables using `sequelize.sync({ alter: true })`
- **Stock Management**: Automatic stock updates with transactions
- **Comprehensive APIs**: Full CRUD operations for users, products, and transactions
- **Analytics & Reports**: Various reporting endpoints for business insights

## Tech Stack

- **Express.js** - Web framework
- **Sequelize** - ORM for MySQL
- **MySQL2** - Database driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment configuration
- **cors** - Cross-origin resource sharing

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=inventory_management
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

4. Make sure MySQL is running and create the database:
```sql
CREATE DATABASE inventory_management;
```

5. Start the server:
```bash
npm run dev  # Development with nodemon
# or
npm start    # Production
```

## Default Credentials

The system automatically creates a default admin user:
- **Username**: admin
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products (Admin & Manager can modify, All can view)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Transactions (All authenticated users)
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/user/:userId` - Get transactions by user
- `GET /api/transactions/product/:productId` - Get transactions by product

### Reports (Admin & Manager only)
- `GET /api/reports/stock-movements` - Stock IN vs OUT data
- `GET /api/reports/top-products` - Top 5 most moved products
- `GET /api/reports/transactions-by-date` - Transactions by date
- `GET /api/reports/low-stock` - Low stock products
- `GET /api/reports/dashboard-summary` - Dashboard summary data
- `GET /api/reports/user-activity` - User activity report (Admin only)

### Health Check
- `GET /api/health` - Server health status

## Database Models

### User
- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password
- `role` - Admin, Manager, or Staff

### Product
- `id` - Primary key
- `name` - Product name
- `quantity` - Current stock quantity
- `price` - Product price
- `category` - Product category

### Transaction
- `id` - Primary key
- `productId` - Foreign key to Product
- `userId` - Foreign key to User
- `action` - "IN" or "OUT"
- `quantity` - Transaction quantity
- `created_at` - Timestamp

## Role Permissions

### Admin
- Full access to all endpoints
- Can manage users, products, transactions
- Can view all reports

### Manager
- Can manage products and transactions
- Can view reports
- Cannot manage users

### Staff
- Can only create transactions
- Can view products (read-only)
- Limited access to other features

## Stock Management

When creating transactions:
- **Stock IN**: Adds quantity to product stock
- **Stock OUT**: Subtracts quantity from product stock
- Validates sufficient stock before OUT transactions
- Uses database transactions for data consistency

## Error Handling

- Comprehensive validation using express-validator
- Global error handler for unhandled errors
- Proper HTTP status codes
- Detailed error messages in development mode

## Development

The server includes:
- Request logging middleware
- Graceful shutdown handling
- Database connection testing
- Automatic table creation/updates
