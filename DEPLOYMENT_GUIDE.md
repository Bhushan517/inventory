# 🚀 Deployment Guide

Complete deployment guide for the Web-Based Inventory Management System.

## 📋 Prerequisites

### **System Requirements**
- **Server**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 10GB free space
- **Network**: Stable internet connection

### **Software Requirements**
- **Node.js**: v16.0.0 or higher
- **MySQL**: v8.0 or higher
- **PM2**: Process manager (for production)
- **Nginx**: Web server (optional, for reverse proxy)
- **SSL Certificate**: For HTTPS (recommended)

## 🛠️ Local Development Setup

### **1. Clone Repository**
```bash
git clone <your-repository-url>
cd "Web-Based Inventory Management System (Multi-user roles)"
```

### **2. Database Setup**
```bash
# Install MySQL (Ubuntu/Debian)
sudo apt update
sudo apt install mysql-server

# Install MySQL (CentOS/RHEL)
sudo yum install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation

# Create database
mysql -u root -p
CREATE DATABASE inventory_management;
CREATE USER 'inventory_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON inventory_management.* TO 'inventory_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### **3. Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

**Backend .env Configuration:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=inventory_user
DB_PASSWORD=secure_password
DB_NAME=inventory_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

```bash
# Start backend server
npm start

# Or for development with auto-reload
npm run dev
```

### **4. Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Production Deployment

### **Option 1: Traditional Server Deployment**

#### **1. Server Preparation**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx

# Install MySQL
sudo apt install mysql-server
```

#### **2. Application Deployment**
```bash
# Clone repository to server
git clone <your-repository-url> /var/www/inventory-system
cd /var/www/inventory-system

# Set proper permissions
sudo chown -R $USER:$USER /var/www/inventory-system
```

#### **3. Backend Production Setup**
```bash
cd backend

# Install production dependencies
npm install --production

# Create production environment file
sudo nano .env
```

**Production .env:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=inventory_user
DB_PASSWORD=your_secure_production_password
DB_NAME=inventory_management

# JWT Configuration
JWT_SECRET=your_super_secure_production_jwt_secret

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://yourdomain.com
```

```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'inventory-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

```bash
# Create logs directory
mkdir logs

# Start application with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### **4. Frontend Production Build**
```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Copy build files to web server directory
sudo cp -r dist/* /var/www/html/
```

#### **5. Nginx Configuration**
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/inventory-system
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend static files
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/inventory-system /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### **6. SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### **Option 2: Docker Deployment**

#### **1. Create Dockerfile for Backend**
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### **2. Create Dockerfile for Frontend**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **3. Create Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: inventory_mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: inventory_management
      MYSQL_USER: inventory_user
      MYSQL_PASSWORD: secure_password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    restart: unless-stopped

  backend:
    build: ./backend
    container_name: inventory_backend
    environment:
      DB_HOST: mysql
      DB_USER: inventory_user
      DB_PASSWORD: secure_password
      DB_NAME: inventory_management
      JWT_SECRET: your_jwt_secret
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      - mysql
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: inventory_frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  mysql_data:
```

#### **4. Deploy with Docker**
```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### **Option 3: Cloud Deployment (AWS)**

#### **1. EC2 Instance Setup**
```bash
# Launch EC2 instance (Ubuntu 20.04)
# Configure security groups:
# - HTTP (80)
# - HTTPS (443)
# - SSH (22)
# - Custom TCP (5000) for backend

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Follow traditional server deployment steps
```

#### **2. RDS Database Setup**
```bash
# Create RDS MySQL instance
# Configure security group to allow EC2 access
# Update backend .env with RDS endpoint
DB_HOST=your-rds-endpoint.amazonaws.com
DB_USER=admin
DB_PASSWORD=your_rds_password
DB_NAME=inventory_management
```

#### **3. S3 Static Hosting (Optional)**
```bash
# Build frontend
npm run build

# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Configure CloudFront distribution
# Update API calls to point to EC2 backend
```

## 🔧 Environment Configuration

### **Development Environment**
```env
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
JWT_SECRET=dev_secret_key
FRONTEND_URL=http://localhost:3000
```

### **Staging Environment**
```env
NODE_ENV=staging
DB_HOST=staging-db.example.com
DB_USER=staging_user
DB_PASSWORD=staging_password
JWT_SECRET=staging_secret_key
FRONTEND_URL=https://staging.yourdomain.com
```

### **Production Environment**
```env
NODE_ENV=production
DB_HOST=prod-db.example.com
DB_USER=prod_user
DB_PASSWORD=super_secure_prod_password
JWT_SECRET=ultra_secure_prod_jwt_secret
FRONTEND_URL=https://yourdomain.com
```

## 🔒 Security Checklist

### **Server Security**
- [ ] Update system packages regularly
- [ ] Configure firewall (UFW/iptables)
- [ ] Disable root SSH login
- [ ] Use SSH keys instead of passwords
- [ ] Install fail2ban for brute force protection
- [ ] Regular security audits

### **Application Security**
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Regular dependency updates

### **Database Security**
- [ ] Use strong database passwords
- [ ] Limit database user privileges
- [ ] Enable MySQL SSL connections
- [ ] Regular database backups
- [ ] Monitor database access logs

## 📊 Monitoring & Logging

### **Application Monitoring**
```bash
# PM2 monitoring
pm2 monit

# View application logs
pm2 logs inventory-backend

# System resource monitoring
htop
iostat
```

### **Log Management**
```bash
# Rotate logs with logrotate
sudo nano /etc/logrotate.d/inventory-system

# Log rotation configuration
/var/www/inventory-system/backend/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        pm2 reload inventory-backend
    endscript
}
```

## 🔄 Backup Strategy

### **Database Backup**
```bash
# Create backup script
nano backup-db.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u inventory_user -p inventory_management > /backups/db_backup_$DATE.sql
find /backups -name "db_backup_*.sql" -mtime +7 -delete

# Make executable and add to crontab
chmod +x backup-db.sh
crontab -e
# Add: 0 2 * * * /path/to/backup-db.sh
```

### **Application Backup**
```bash
# Backup application files
tar -czf /backups/app_backup_$(date +%Y%m%d).tar.gz /var/www/inventory-system

# Automated backup script
nano backup-app.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/app_backup_$DATE.tar.gz /var/www/inventory-system
find /backups -name "app_backup_*.tar.gz" -mtime +30 -delete
```

## 🚨 Troubleshooting

### **Common Issues**

#### **Backend Won't Start**
```bash
# Check logs
pm2 logs inventory-backend

# Check port availability
sudo netstat -tlnp | grep :5000

# Check environment variables
pm2 env inventory-backend
```

#### **Database Connection Issues**
```bash
# Test database connection
mysql -h localhost -u inventory_user -p inventory_management

# Check MySQL service
sudo systemctl status mysql

# Check firewall
sudo ufw status
```

#### **Frontend Build Issues**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build

# Check build output
ls -la dist/
```

#### **Nginx Issues**
```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

## 📞 Support & Maintenance

### **Regular Maintenance Tasks**
- [ ] Weekly: Check application logs
- [ ] Weekly: Monitor system resources
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review security logs
- [ ] Quarterly: Full system backup test
- [ ] Quarterly: Security audit

### **Performance Optimization**
- Enable Gzip compression in Nginx
- Implement Redis caching for sessions
- Optimize database queries
- Use CDN for static assets
- Monitor and optimize bundle sizes

---

**Last Updated**: August 2025  
**Version**: 1.0
