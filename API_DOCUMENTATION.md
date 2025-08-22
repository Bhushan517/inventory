# 🔌 API Documentation

Complete API reference for the Web-Based Inventory Management System.

## 📋 Base Information

- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`
- **Response Format**: JSON

## 🔐 Authentication

### **Register Company**
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "companyName": "Tech Solutions Ltd",
  "username": "admin",
  "email": "admin@techsolutions.com",
  "password": "securepassword123",
  "companyEmail": "contact@techsolutions.com",
  "phone": "+1234567890",
  "address": "123 Business Street, City, State"
}
```

**Response (201):**
```json
{
  "message": "Company and admin user created successfully",
  "company": {
    "id": 1,
    "name": "Tech Solutions Ltd",
    "email": "contact@techsolutions.com",
    "phone": "+1234567890",
    "address": "123 Business Street, City, State"
  },
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@techsolutions.com",
    "role": "Admin"
  }
}
```

### **User Login**
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@techsolutions.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@techsolutions.com",
    "role": "Admin",
    "company_id": 1
  }
}
```

### **Verify Token**
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@techsolutions.com",
    "role": "Admin",
    "company_id": 1
  }
}
```

## 👥 User Management

### **Get All Users**
```http
GET /api/users
Authorization: Bearer <token>
```
*Requires: Admin or Manager role*

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@techsolutions.com",
      "role": "Admin",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "username": "manager1",
      "email": "manager@techsolutions.com",
      "role": "Manager",
      "createdAt": "2024-01-16T09:15:00.000Z"
    }
  ]
}
```

### **Create New User**
```http
POST /api/users
Authorization: Bearer <token>
```
*Requires: Admin role*

**Request Body:**
```json
{
  "username": "staff1",
  "email": "staff1@techsolutions.com",
  "password": "staffpassword123",
  "role": "Staff"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 3,
    "username": "staff1",
    "email": "staff1@techsolutions.com",
    "role": "Staff",
    "company_id": 1
  }
}
```

### **Update User**
```http
PUT /api/users/:id
Authorization: Bearer <token>
```
*Requires: Admin role*

**Request Body:**
```json
{
  "username": "staff1_updated",
  "email": "staff1_new@techsolutions.com",
  "role": "Manager"
}
```

**Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 3,
    "username": "staff1_updated",
    "email": "staff1_new@techsolutions.com",
    "role": "Manager"
  }
}
```

### **Delete User**
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```
*Requires: Admin role*

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

## 📦 Product Management

### **Get All Products**
```http
GET /api/products
Authorization: Bearer <token>
```

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search by product name
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Laptop Dell XPS 13",
      "quantity": 25,
      "price": 999.99,
      "category": "Electronics",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T14:45:00.000Z"
    },
    {
      "id": 2,
      "name": "Office Chair",
      "quantity": 5,
      "price": 299.99,
      "category": "Furniture",
      "createdAt": "2024-01-16T11:20:00.000Z",
      "updatedAt": "2024-01-16T11:20:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 2,
    "itemsPerPage": 10
  }
}
```

### **Create Product**
```http
POST /api/products
Authorization: Bearer <token>
```
*Requires: Admin or Manager role*

**Request Body:**
```json
{
  "name": "Wireless Mouse",
  "quantity": 50,
  "price": 29.99,
  "category": "Electronics"
}
```

**Response (201):**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": 3,
    "name": "Wireless Mouse",
    "quantity": 50,
    "price": 29.99,
    "category": "Electronics",
    "company_id": 1
  }
}
```

### **Update Product**
```http
PUT /api/products/:id
Authorization: Bearer <token>
```
*Requires: Admin or Manager role*

**Request Body:**
```json
{
  "name": "Wireless Mouse Pro",
  "quantity": 45,
  "price": 39.99,
  "category": "Electronics"
}
```

**Response (200):**
```json
{
  "message": "Product updated successfully",
  "product": {
    "id": 3,
    "name": "Wireless Mouse Pro",
    "quantity": 45,
    "price": 39.99,
    "category": "Electronics"
  }
}
```

### **Delete Product**
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```
*Requires: Admin or Manager role*

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

## 📊 Transaction Management

### **Get All Transactions**
```http
GET /api/transactions
Authorization: Bearer <token>
```

**Query Parameters:**
- `productId` (optional): Filter by product ID
- `action` (optional): Filter by action (IN/OUT)
- `startDate` (optional): Start date filter (YYYY-MM-DD)
- `endDate` (optional): End date filter (YYYY-MM-DD)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "transactions": [
    {
      "id": 1,
      "productId": 1,
      "userId": 2,
      "action": "IN",
      "quantity": 10,
      "created_at": "2024-01-20T09:30:00.000Z",
      "Product": {
        "name": "Laptop Dell XPS 13",
        "category": "Electronics"
      },
      "User": {
        "username": "manager1",
        "email": "manager@techsolutions.com"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  }
}
```

### **Create Transaction**
```http
POST /api/transactions
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": 1,
  "action": "OUT",
  "quantity": 5
}
```

**Response (201):**
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": 2,
    "productId": 1,
    "userId": 1,
    "action": "OUT",
    "quantity": 5,
    "created_at": "2024-01-20T15:45:00.000Z"
  },
  "updatedProduct": {
    "id": 1,
    "name": "Laptop Dell XPS 13",
    "quantity": 20,
    "price": 999.99,
    "category": "Electronics"
  }
}
```

### **Get Transaction by ID**
```http
GET /api/transactions/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "transaction": {
    "id": 1,
    "productId": 1,
    "userId": 2,
    "action": "IN",
    "quantity": 10,
    "created_at": "2024-01-20T09:30:00.000Z",
    "Product": {
      "name": "Laptop Dell XPS 13",
      "category": "Electronics",
      "price": 999.99
    },
    "User": {
      "username": "manager1",
      "email": "manager@techsolutions.com",
      "role": "Manager"
    }
  }
}
```

## 📈 Reports & Analytics

### **Dashboard Summary**
```http
GET /api/reports/dashboard-summary
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalProducts": 25,
  "totalTransactions": 150,
  "lowStockItems": 3,
  "recentTransactions": 12
}
```

### **Stock Movement Report**
```http
GET /api/reports/stock-movements
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `productId` (optional): Specific product ID

**Response (200):**
```json
{
  "movements": [
    {
      "date": "2024-01-20",
      "totalIn": 50,
      "totalOut": 25,
      "netMovement": 25
    },
    {
      "date": "2024-01-21",
      "totalIn": 30,
      "totalOut": 40,
      "netMovement": -10
    }
  ]
}
```

### **Top Products Report**
```http
GET /api/reports/top-products
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of products (default: 10)
- `sortBy` (optional): Sort by 'quantity' or 'transactions' (default: 'transactions')

**Response (200):**
```json
{
  "topProducts": [
    {
      "id": 1,
      "name": "Laptop Dell XPS 13",
      "category": "Electronics",
      "totalTransactions": 45,
      "currentStock": 20
    },
    {
      "id": 3,
      "name": "Wireless Mouse Pro",
      "category": "Electronics",
      "totalTransactions": 32,
      "currentStock": 45
    }
  ]
}
```

### **Transaction Trends**
```http
GET /api/reports/transactions-by-date
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `groupBy` (optional): 'day', 'week', 'month' (default: 'day')

**Response (200):**
```json
{
  "trends": [
    {
      "period": "2024-01-20",
      "inTransactions": 15,
      "outTransactions": 8,
      "totalTransactions": 23
    },
    {
      "period": "2024-01-21",
      "inTransactions": 12,
      "outTransactions": 18,
      "totalTransactions": 30
    }
  ]
}
```

## ❌ Error Responses

### **400 Bad Request**
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "field": "email",
    "issue": "Invalid email format"
  }
}
```

### **401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### **403 Forbidden**
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions for this action"
}
```

### **404 Not Found**
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### **409 Conflict**
```json
{
  "error": "Conflict",
  "message": "Email already exists"
}
```

### **500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## 🔒 Authentication Headers

All protected endpoints require the JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Response Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists
- **500 Internal Server Error** - Server error

## 🔄 Rate Limiting

- **General API**: 100 requests per minute per IP
- **Authentication**: 10 requests per minute per IP
- **Reports**: 20 requests per minute per user

---

**Last Updated**: August 2025
**API Version**: v1.0
**Documentation Version**: 1.0
