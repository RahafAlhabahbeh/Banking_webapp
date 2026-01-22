# SecureBank Deployment Guide

## Overview
This is a fullstack banking application with a React frontend and Node.js backend with MySQL database.

## Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

## Project Structure
```
banking_system/
├── banking-ui/          # React frontend
├── bankingBackend/      # Node.js backend
└── README.md
```

---

## Backend Deployment

### 1. Environment Setup
```bash
cd bankingBackend
cp env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3001
NODE_ENV=production
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=banking_db
DB_PORT=3306
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

### 2. Database Setup
Create MySQL database and run the schema:
```sql
-- Create database
CREATE DATABASE banking_db;

-- The backend will create tables automatically on first run
```

### 3. Install Dependencies
```bash
npm install --production
```

### 4. Build for Production (if needed)
```bash
npm run build  # If you add a build script
```

### 5. Start Production Server
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "banking-backend"

# Or using node directly
NODE_ENV=production node server.js
```

---

## Frontend Deployment

### 1. Environment Setup
```bash
cd banking-ui
cp env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_ENV=production
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build for Production
```bash
npm run build
```

### 4. Serve Static Files
The `dist/` folder contains your production build.

#### Using Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/banking-ui/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Using Apache
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/banking-ui/dist

    <Directory "/path/to/banking-ui/dist">
        AllowOverride All
        Require all granted
    </Directory>

    ProxyPass /api http://localhost:3001/
    ProxyPassReverse /api http://localhost:3001/
</VirtualHost>
```

#### Using Serve (simple option)
```bash
npm install -g serve
serve -s dist -l 3000
```

---

## Production Checklist

### Security
- [ ] Change JWT_SECRET to a strong, random string
- [ ] Use HTTPS in production
- [ ] Set secure database credentials
- [ ] Configure firewall rules
- [ ] Enable CORS only for your domain
- [ ] Set NODE_ENV=production

### Performance
- [ ] Enable gzip compression
- [ ] Set up database connection pooling
- [ ] Configure database indexes
- [ ] Enable caching if needed
- [ ] Set up monitoring

### Monitoring
- [ ] Set up error logging
- [ ] Configure health checks
- [ ] Set up database backups
- [ ] Monitor server resources

---

## Development Setup

### Quick Start
```bash
# Backend
cd bankingBackend
npm install
cp env.example .env  # Configure database
npm run dev

# Frontend (new terminal)
cd banking-ui
npm install
cp env.example .env
npm run dev
```

### Database Schema
The application uses MySQL with the following main tables:
- users
- customers
- accounts
- account_types
- transactions

Tables are created automatically on first run.

---

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DB_HOST, DB_USER, DB_PASSWORD in .env
   - Ensure MySQL is running
   - Verify database exists

2. **CORS Errors**
   - Check CORS_ORIGIN in backend .env
   - Ensure frontend VITE_API_BASE_URL matches backend URL

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings

---

## Support
For issues or questions, please check the application logs and ensure all environment variables are correctly configured.