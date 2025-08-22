# 📦 Web-Based Inventory Management System

A comprehensive multi-user inventory management system built with **React.js** frontend and **Node.js** backend, featuring role-based access control and real-time inventory tracking.

## 🌟 Features

### 🔐 **Authentication & Authorization**
- **Email-based Authentication** - Secure login with email and password
- **Multi-Company Support** - Each company has isolated data
- **Role-Based Access Control** - Admin, Manager, and Staff roles
- **JWT Token Security** - Secure API authentication

### 👥 **User Management**
- **Admin Controls** - Create, edit, and delete users
- **Role Assignment** - Assign specific roles to users
- **Company Isolation** - Users can only access their company data
- **User Profile Management** - Update user information

### 📦 **Product Management**
- **Product CRUD Operations** - Add, edit, delete products
- **Inventory Tracking** - Real-time stock levels
- **Category Management** - Organize products by categories
- **Low Stock Alerts** - Automatic notifications for low inventory

### 📊 **Transaction Management**
- **Stock Movements** - Track IN/OUT transactions
- **Transaction History** - Complete audit trail
- **Real-time Updates** - Instant inventory updates
- **User Attribution** - Track who made each transaction

### 📈 **Reports & Analytics**
- **Dashboard Analytics** - Key metrics and statistics
- **Stock Movement Reports** - Visual charts and graphs
- **Transaction Reports** - Detailed transaction analysis
- **Export Capabilities** - Download reports in various formats

### 📱 **Responsive Design**
- **Mobile-First** - Optimized for all devices
- **Modern UI/UX** - Clean and intuitive interface
- **Component-Based CSS** - Modular styling approach
- **Cross-Browser Compatible** - Works on all modern browsers

## 🛠️ Technology Stack

### **Frontend**
- **React.js 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization library
- **Custom CSS** - Component-based styling
- **Vite** - Fast build tool and dev server

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **Sequelize ORM** - Database object-relational mapping
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Web-Based Inventory Management System/
├── frontend/                    # React.js Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Layout.jsx     # Main layout wrapper
│   │   │   └── Layout.css     # Layout styles
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Login.css      # Login styles
│   │   │   ├── Register.jsx   # Registration page
│   │   │   ├── Register.css   # Registration styles
│   │   │   ├── Dashboard.jsx  # Dashboard page
│   │   │   ├── Dashboard.css  # Dashboard styles
│   │   │   ├── Products.jsx   # Products management
│   │   │   ├── Products.css   # Products styles
│   │   │   ├── Users.jsx      # User management
│   │   │   ├── Users.css      # Users styles
│   │   │   ├── Transactions.jsx # Transaction management
│   │   │   ├── Transactions.css # Transaction styles
│   │   │   ├── Reports.jsx    # Reports and analytics
│   │   │   └── Reports.css    # Reports styles
│   │   ├── utils/             # Utility functions
│   │   │   ├── api.js         # API configuration
│   │   │   └── auth.js        # Authentication utilities
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # App entry point
│   │   └── index.css          # Global styles
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
├── backend/                    # Node.js Backend
│   ├── config/                # Configuration files
│   │   └── database.js        # Database configuration
│   ├── middleware/            # Custom middleware
│   │   └── auth.js            # Authentication middleware
│   ├── models/                # Database models
│   │   ├── Company.js         # Company model
│   │   ├── User.js            # User model
│   │   ├── Product.js         # Product model
│   │   └── Transaction.js     # Transaction model
│   ├── routes/                # API routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js           # User management routes
│   │   ├── products.js        # Product management routes
│   │   ├── transactions.js    # Transaction routes
│   │   └── reports.js         # Reports and analytics routes
│   ├── migrations/            # Database migrations
│   ├── package.json           # Backend dependencies
│   └── server.js              # Server entry point
└── README.md                  # Project documentation
```

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### **1. Clone Repository**
```bash
git clone <repository-url>
cd "Web-Based Inventory Management System (Multi-user roles)"
```

### **2. Database Setup**
```sql
-- Create MySQL database
CREATE DATABASE inventory_management;

-- Create user (optional)
CREATE USER 'inventory_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON inventory_management.* TO 'inventory_user'@'localhost';
FLUSH PRIVILEGES;
```

### **3. Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inventory_management
JWT_SECRET=your_jwt_secret_key
PORT=5000

# Start backend server
npm start
```

### **4. Frontend Setup**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### **Environment Variables**

#### **Backend (.env)**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inventory_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

#### **Frontend (vite.config.js)**
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

## 📊 Database Schema

### **Companies Table**
```sql
CREATE TABLE companies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### **Users Table**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Manager', 'Staff') DEFAULT 'Staff',
  company_id INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);
```

### **Products Table**
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  company_id INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);
```

### **Transactions Table**
```sql
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  productId INT NOT NULL,
  userId INT NOT NULL,
  action ENUM('IN', 'OUT') NOT NULL,
  quantity INT NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (productId) REFERENCES products(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## 🎯 User Roles & Permissions

### **👑 Admin**
- **Full System Access** - Complete control over the system
- **User Management** - Create, edit, delete users
- **Product Management** - Full CRUD operations on products
- **Transaction Management** - View and manage all transactions
- **Reports Access** - Access to all reports and analytics
- **Company Settings** - Manage company information

### **👨‍💼 Manager**
- **Product Management** - Full CRUD operations on products
- **Transaction Management** - View and manage transactions
- **Reports Access** - Access to reports and analytics
- **Limited User View** - Can view user information
- **Inventory Control** - Manage stock levels and movements

### **👨‍💻 Staff**
- **Transaction Management** - Create and view transactions
- **Product View** - View product information (read-only)
- **Basic Reports** - Access to basic inventory reports
- **Stock Updates** - Update inventory through transactions

## 🔄 API Endpoints

### **Authentication Routes**
```
POST /api/auth/register    # Register new company
POST /api/auth/login       # User login
GET  /api/auth/verify      # Verify JWT token
```

### **User Management Routes**
```
GET    /api/users          # Get all users (Admin/Manager)
POST   /api/users          # Create new user (Admin)
PUT    /api/users/:id      # Update user (Admin)
DELETE /api/users/:id      # Delete user (Admin)
```

### **Product Management Routes**
```
GET    /api/products       # Get all products
POST   /api/products       # Create new product
PUT    /api/products/:id   # Update product
DELETE /api/products/:id   # Delete product
```

### **Transaction Routes**
```
GET    /api/transactions   # Get all transactions
POST   /api/transactions   # Create new transaction
GET    /api/transactions/:id # Get specific transaction
```

### **Reports Routes**
```
GET /api/reports/dashboard-summary    # Dashboard statistics
GET /api/reports/stock-movements      # Stock movement data
GET /api/reports/top-products         # Top products report
GET /api/reports/transactions-by-date # Transaction trends
```

## 🎨 Frontend Components

### **Layout Component**
- **Responsive Sidebar** - Collapsible navigation
- **Top Navigation** - User info and logout
- **Mobile Menu** - Touch-friendly mobile navigation
- **Role-based Menu** - Different menu items per role

### **Dashboard Component**
- **Statistics Cards** - Key metrics display
- **Feature Grid** - Available features per role
- **Quick Actions** - Fast access to common tasks
- **Welcome Message** - Personalized user greeting

### **Product Management**
- **Product Table** - Sortable and filterable
- **Add/Edit Modal** - Form for product operations
- **Stock Status** - Visual stock level indicators
- **Category Filtering** - Filter by product categories

### **User Management**
- **User Table** - Display all company users
- **Role Management** - Assign and change user roles
- **User Creation** - Add new users to company
- **Permission Control** - Role-based access control

### **Transaction Management**
- **Transaction History** - Complete transaction log
- **Stock Movement** - IN/OUT transaction creation
- **Real-time Updates** - Instant inventory updates
- **User Attribution** - Track transaction creators

### **Reports & Analytics**
- **Interactive Charts** - Visual data representation
- **Export Functions** - Download reports
- **Date Filtering** - Custom date range reports
- **Real-time Data** - Live dashboard updates

## 🔒 Security Features

### **Authentication Security**
- **JWT Tokens** - Secure token-based authentication
- **Password Hashing** - bcrypt password encryption
- **Token Expiration** - Automatic session timeout
- **Secure Headers** - CORS and security headers

### **Authorization Security**
- **Role-based Access** - Granular permission control
- **Company Isolation** - Data segregation by company
- **API Protection** - Protected routes and endpoints
- **Input Validation** - Server-side data validation

### **Data Security**
- **SQL Injection Protection** - Parameterized queries
- **XSS Prevention** - Input sanitization
- **CSRF Protection** - Cross-site request forgery prevention
- **Data Encryption** - Sensitive data encryption

## 📱 Responsive Design

### **Mobile (320px - 767px)**
- **Single Column Layout** - Stacked components
- **Touch-friendly Buttons** - Larger touch targets
- **Collapsible Sidebar** - Overlay navigation
- **Optimized Forms** - Mobile-friendly inputs

### **Tablet (768px - 1023px)**
- **Two Column Layout** - Balanced content distribution
- **Adaptive Grid** - Flexible grid system
- **Touch Navigation** - Tablet-optimized interactions
- **Responsive Tables** - Horizontal scrolling

### **Desktop (1024px+)**
- **Full Layout** - Complete sidebar and content
- **Multi-column Grids** - Maximum content density
- **Hover Effects** - Desktop interaction patterns
- **Keyboard Navigation** - Full keyboard support

## 🚀 Deployment

### **Production Build**

#### **Frontend**
```bash
cd frontend
npm run build
# Deploy dist/ folder to web server
```

#### **Backend**
```bash
cd backend
npm install --production
# Set NODE_ENV=production
# Configure production database
# Start with PM2 or similar process manager
```

### **Environment Setup**
```bash
# Production environment variables
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_production_jwt_secret
```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🧪 Testing

### **Frontend Testing**
```bash
cd frontend
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run lint        # Code linting
```

### **Backend Testing**
```bash
cd backend
npm test           # Run API tests
npm run test:unit  # Unit tests
npm run test:integration # Integration tests
```

## 📚 Documentation

- **[README.md](README.md)** - Project overview and setup
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Production deployment guide
- **[USER_MANUAL.md](USER_MANUAL.md)** - End-user documentation

## 🐛 Troubleshooting

### **Common Issues**

#### **Database Connection Error**
```bash
# Check MySQL service
sudo systemctl status mysql

# Verify credentials in .env file
# Ensure database exists
# Check firewall settings
```

#### **Frontend Build Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
```

#### **Authentication Issues**
```bash
# Check JWT_SECRET in .env
# Verify token expiration
# Clear browser localStorage
# Check CORS configuration
```

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Code Standards**
- Follow ESLint configuration
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed

### **Pull Request Guidelines**
- Describe changes clearly
- Include screenshots for UI changes
- Ensure all tests pass
- Update relevant documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided
- ❌ No liability accepted

## 🙏 Acknowledgments

### **Technologies Used**
- **[React.js](https://reactjs.org/)** - Frontend framework
- **[Node.js](https://nodejs.org/)** - Backend runtime
- **[Express.js](https://expressjs.com/)** - Web framework
- **[MySQL](https://mysql.com/)** - Database system
- **[Sequelize](https://sequelize.org/)** - ORM library
- **[Vite](https://vitejs.dev/)** - Build tool

### **Open Source Libraries**
- **[Axios](https://axios-http.com/)** - HTTP client
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** - JWT implementation
- **[CORS](https://github.com/expressjs/cors)** - Cross-origin resource sharing

### **Development Tools**
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Postman](https://postman.com/)** - API testing
- **[Git](https://git-scm.com/)** - Version control

## 📞 Support & Contact

### **Development Team**
- **Lead Developer**: [Your Name]
- **Email**: [your.email@domain.com]
- **GitHub**: [github.com/yourusername]
- **LinkedIn**: [linkedin.com/in/yourprofile]

### **Project Links**
- **Repository**: [GitHub Repository URL]
- **Documentation**: [Documentation URL]
- **Live Demo**: [Demo URL]
- **Issue Tracker**: [Issues URL]

### **Community**
- **Discord**: [Discord Server Link]
- **Slack**: [Slack Workspace Link]
- **Forum**: [Community Forum Link]

## 🔄 Changelog

### **Version 1.0.0** (August 2025)
- ✅ Initial release
- ✅ User authentication and authorization
- ✅ Product management system
- ✅ Transaction tracking
- ✅ Reports and analytics
- ✅ Responsive design
- ✅ Role-based access control

### **Upcoming Features**
- 🔄 Email notifications
- 🔄 Advanced reporting
- 🔄 Mobile app
- 🔄 API rate limiting
- 🔄 Data export/import
- 🔄 Multi-language support

## 🎯 Roadmap

### **Q3 2025**
- [ ] Enhanced reporting features
- [ ] Email notification system
- [ ] Advanced user permissions
- [ ] API documentation improvements

### **Q4 2025**
- [ ] Mobile application (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

### **Q1 2026**
- [ ] Integration with external systems
- [ ] Advanced inventory forecasting
- [ ] Barcode scanning support
- [ ] Automated reorder points

---

**Made with ❤️ by [Your Name]**

*"Simplifying inventory management, one transaction at a time."*

**Last Updated**: August 2025
**Project Version**: 1.0.0
**Documentation Version**: 1.0.0
