# 📖 User Manual

Complete user guide for the Web-Based Inventory Management System.

## 🎯 Getting Started

### **System Overview**
The Web-Based Inventory Management System is designed to help businesses track their inventory, manage products, handle transactions, and generate reports. The system supports multiple user roles with different access levels.

### **User Roles**
- **👑 Admin**: Full system access, user management, all features
- **👨‍💼 Manager**: Product and transaction management, reports
- **👨‍💻 Staff**: Transaction management, basic inventory operations

### **System Requirements**
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet**: Stable internet connection required
- **Screen**: Minimum 1024x768 resolution (responsive design)

## 🔐 Authentication

### **Company Registration**
1. **Navigate** to the registration page
2. **Fill in Company Details**:
   - Company Name (required)
   - Admin Username (required)
   - Admin Email (required)
   - Password (minimum 6 characters)
   - Confirm Password
   - Company Email (optional)
   - Phone Number (optional)
   - Address (optional)
3. **Click** "Create Company"
4. **Wait** for confirmation message
5. **Redirect** to login page automatically

### **User Login**
1. **Navigate** to the login page
2. **Enter Credentials**:
   - Email address
   - Password
3. **Click** "Sign in"
4. **Access** granted based on user role

### **Password Security**
- Use strong passwords (8+ characters)
- Include uppercase, lowercase, numbers, symbols
- Don't share login credentials
- Log out when finished

## 🏠 Dashboard

### **Dashboard Overview**
The dashboard provides a quick overview of your inventory system with key metrics and quick access to main features.

### **Statistics Cards**
- **📦 Total Products**: Number of products in inventory
- **📊 Total Transactions**: All-time transaction count
- **⚠️ Low Stock Items**: Products needing restocking
- **📈 Recent Activity**: Recent transactions count

### **Feature Access**
Different features are available based on your user role:

#### **Admin Dashboard**
- User Management
- Product Management
- Transaction Management
- Reports & Analytics

#### **Manager Dashboard**
- Product Management
- Transaction Management
- Reports & Analytics

#### **Staff Dashboard**
- Transaction Management

### **Quick Actions**
- **New User** (Admin only): Create new user account
- **New Product**: Add product to inventory
- **New Transaction**: Record stock movement
- **View Reports**: Access analytics and reports

## 👥 User Management (Admin Only)

### **Viewing Users**
1. **Navigate** to Users section from sidebar
2. **View** list of all company users
3. **See** user details: username, email, role, creation date

### **Adding New Users**
1. **Click** "Add New User" button
2. **Fill in User Details**:
   - Username (required)
   - Email (required, must be unique)
   - Password (required, minimum 6 characters)
   - Role (Admin/Manager/Staff)
3. **Click** "Create User"
4. **Confirm** user creation

### **Editing Users**
1. **Click** edit button (✏️) next to user
2. **Modify** user information
3. **Change** role if needed
4. **Click** "Update User"
5. **Confirm** changes

### **Deleting Users**
1. **Click** delete button (🗑️) next to user
2. **Confirm** deletion in popup
3. **User** will be permanently removed

### **User Role Permissions**
- **Admin**: Can manage all users and system settings
- **Manager**: Can view users but cannot modify
- **Staff**: Cannot access user management

## 📦 Product Management

### **Viewing Products**
1. **Navigate** to Products section
2. **View** product list with details:
   - Product name
   - Category
   - Current quantity
   - Price
   - Last updated

### **Adding Products**
1. **Click** "Add New Product" button
2. **Fill in Product Details**:
   - Product Name (required)
   - Category (required)
   - Initial Quantity (required, number)
   - Price (required, decimal)
3. **Click** "Create Product"
4. **Product** added to inventory

### **Editing Products**
1. **Click** edit button (✏️) next to product
2. **Modify** product information:
   - Name, category, price
   - Quantity (updates stock level)
3. **Click** "Update Product"
4. **Changes** saved automatically

### **Deleting Products**
1. **Click** delete button (🗑️) next to product
2. **Confirm** deletion
3. **Warning**: All related transactions will be affected

### **Stock Level Indicators**
- **🟢 High Stock**: Quantity > 50
- **🟡 Medium Stock**: Quantity 11-50
- **🔴 Low Stock**: Quantity ≤ 10

### **Product Categories**
Common categories include:
- Electronics
- Furniture
- Office Supplies
- Clothing
- Food & Beverages
- Custom categories allowed

## 📊 Transaction Management

### **Understanding Transactions**
Transactions record all inventory movements:
- **IN**: Adding stock (purchases, returns)
- **OUT**: Removing stock (sales, damages)

### **Viewing Transactions**
1. **Navigate** to Transactions section
2. **View** transaction history:
   - Product name
   - Action (IN/OUT)
   - Quantity
   - User who created transaction
   - Date and time

### **Creating Transactions**

#### **Stock IN (Adding Inventory)**
1. **Click** "New Transaction" button
2. **Select** product from dropdown
3. **Choose** "IN" action
4. **Enter** quantity to add
5. **Click** "Create Transaction"
6. **Stock** automatically updated

#### **Stock OUT (Removing Inventory)**
1. **Click** "New Transaction" button
2. **Select** product from dropdown
3. **Choose** "OUT" action
4. **Enter** quantity to remove
5. **Verify** sufficient stock available
6. **Click** "Create Transaction"
7. **Stock** automatically reduced

### **Transaction Validation**
- Cannot remove more stock than available
- Quantity must be positive number
- Product must exist in system
- User must have appropriate permissions

### **Transaction History**
- All transactions are permanently recorded
- Cannot be deleted (audit trail)
- Can be filtered by date, product, or user
- Searchable by product name

## 📈 Reports & Analytics

### **Dashboard Summary**
Real-time overview of key metrics:
- Total products in system
- Total transactions processed
- Low stock alerts
- Recent activity summary

### **Stock Movement Reports**
1. **Navigate** to Reports section
2. **View** stock movement charts
3. **Filter** by date range
4. **Analyze** trends and patterns

### **Product Performance**
- Top-selling products
- Most active inventory items
- Stock turnover rates
- Category performance

### **Transaction Trends**
- Daily/weekly/monthly transaction volumes
- IN vs OUT transaction ratios
- Peak activity periods
- User activity patterns

### **Low Stock Alerts**
- Products below minimum threshold
- Automatic notifications
- Reorder recommendations
- Stock level trends

### **Export Options**
- Download reports as PDF
- Export data to Excel/CSV
- Print-friendly formats
- Email report summaries

## 📱 Mobile Usage

### **Responsive Design**
The system is fully responsive and works on:
- **Mobile phones** (320px+)
- **Tablets** (768px+)
- **Desktop computers** (1024px+)

### **Mobile Features**
- Touch-friendly interface
- Swipe navigation
- Optimized forms
- Quick actions
- Offline capability (limited)

### **Mobile Best Practices**
- Use landscape mode for tables
- Zoom in for detailed views
- Use search function for quick access
- Regular sync when online

## 🔧 Settings & Preferences

### **User Profile**
1. **Click** user avatar in top-right
2. **View** profile information
3. **Update** personal details
4. **Change** password if needed

### **Company Settings** (Admin Only)
- Update company information
- Manage system preferences
- Configure notification settings
- Set stock level thresholds

### **Notification Preferences**
- Low stock alerts
- Transaction notifications
- System updates
- Email preferences

## 🚨 Troubleshooting

### **Common Issues**

#### **Login Problems**
- **Check** email and password spelling
- **Ensure** caps lock is off
- **Try** password reset if available
- **Contact** admin for account issues

#### **Page Not Loading**
- **Refresh** browser page (F5)
- **Clear** browser cache
- **Check** internet connection
- **Try** different browser

#### **Transaction Errors**
- **Verify** sufficient stock for OUT transactions
- **Check** product exists in system
- **Ensure** positive quantity values
- **Confirm** user permissions

#### **Data Not Updating**
- **Refresh** page to see latest data
- **Check** internet connection
- **Wait** for system sync
- **Contact** support if persistent

### **Browser Compatibility**
- **Chrome**: Recommended browser
- **Firefox**: Fully supported
- **Safari**: Supported (Mac/iOS)
- **Edge**: Supported (Windows)
- **Internet Explorer**: Not supported

### **Performance Tips**
- **Close** unused browser tabs
- **Clear** browser cache regularly
- **Use** latest browser version
- **Ensure** stable internet connection

## 📞 Support & Help

### **Getting Help**
- **Check** this user manual first
- **Contact** system administrator
- **Report** bugs or issues
- **Request** new features

### **Training Resources**
- Video tutorials available
- Step-by-step guides
- Best practices documentation
- Regular training sessions

### **System Updates**
- Regular feature updates
- Security patches
- Performance improvements
- New functionality additions

### **Feedback**
We welcome your feedback to improve the system:
- Feature requests
- Usability suggestions
- Bug reports
- General comments

---

**Need Help?** Contact your system administrator or IT support team.

**Last Updated**: August 2025  
**Version**: 1.0
