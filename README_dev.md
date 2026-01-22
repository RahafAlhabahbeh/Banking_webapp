# SecureBank - Fullstack Banking System

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Authentication & Security](#authentication--security)
- [Development Setup](#development-setup)
- [Deployment Guide](#deployment-guide)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

SecureBank is a comprehensive fullstack banking application that provides secure financial services through a modern web interface. The system allows users to register, login, manage bank accounts, and perform financial transactions with enterprise-grade security and user experience.

### Core Concepts

- **User Management**: Registration, authentication, and profile management
- **Account Management**: Multiple account types with balance tracking
- **Transaction Processing**: Secure deposit and withdrawal operations
- **Financial Security**: JWT-based authentication and data protection
- **Modern UI/UX**: Professional banking interface with responsive design

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   Frontend      │◄────────────────►│   Backend API   │
│   (React)       │                  │   (Node.js)     │
│                 │                  │                 │
│ - Components    │                  │ - Routes        │
│ - Pages         │                  │ - Controllers   │
│ - Services      │                  │ - Middleware    │
│ - State Mgmt    │                  │ - Validation    │
└─────────────────┘                  └─────────────────┘
         │                                   │
         └───────────────────────────────────┼─────────────────┐
                                             │                 │
                                  ┌──────────▼─────────┐   ┌───▼─────────────┐
                                  │   Database        │   │   JWT Auth      │
                                  │   (MySQL)         │   │   (Security)     │
                                  │                   │   │                 │
                                  │ - Users           │   │ - Token Gen     │
                                  │ - Accounts        │   │ - Verification  │
                                  │ - Transactions    │   │ - Expiration    │
                                  │ - Account Types   │   │                 │
                                  └───────────────────┘   └─────────────────┘
```

### Design Patterns

- **MVC Architecture**: Clear separation of concerns in backend
- **Component-Based UI**: Modular React components
- **RESTful API Design**: Standard HTTP methods and resource naming
- **Environment Configuration**: Secure credential management
- **Error Handling**: Comprehensive error management and logging

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern React with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **Tailwind CSS 4**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client (via fetch API)
- **ESLint**: Code linting and quality assurance

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MySQL2**: Database driver with connection pooling
- **bcrypt**: Password hashing
- **jsonwebtoken (JWT)**: Authentication tokens
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Database
- **MySQL 8.0**: Relational database management system
- **Connection Pooling**: Efficient database connections
- **Prepared Statements**: SQL injection prevention

### DevOps & Deployment
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Web server and reverse proxy
- **PM2**: Process management (optional)

## 🗄️ Database Schema

### Tables Overview

#### 1. Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. Account Types Table
```sql
CREATE TABLE account_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type_name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Accounts Table
```sql
CREATE TABLE accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  account_number VARCHAR(20) UNIQUE NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'USD',
  account_type_id INT NOT NULL,
  national_number VARCHAR(20),
  nationality VARCHAR(50),
  birth_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (account_type_id) REFERENCES account_types(id)
);
```

#### 4. Transactions Table
```sql
CREATE TABLE transactions (
  transaction_id INT PRIMARY KEY AUTO_INCREMENT,
  account_id INT NOT NULL,
  type ENUM('deposit', 'withdraw') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);
```

### Database Relationships

```
Users (1) ────► Accounts (Many)
    │
    └───► Customers (1:1 via national info)

Accounts (Many) ────► Transactions (Many)
    │
    └───► Account Types (Many:1)
```

## 📡 API Documentation

### Authentication Endpoints

#### POST `/users/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword",
  "full_name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "user_id": 1,
  "message": "User registered successfully"
}
```

#### POST `/users/login`
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": 1,
  "message": "Login successful"
}
```

### Account Management Endpoints

#### POST `/accounts/create`
Create a new bank account for authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "user_id": 1,
  "national_number": "123456789",
  "nationality": "American",
  "birth_date": "1990-01-01",
  "account_type_id": 1,
  "initial_balance": 0.00
}
```

#### GET `/users/:userId/accounts`
Get all accounts for a user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "accounts": [
    {
      "id": 1,
      "account_number": "ACC00123456789",
      "balance": 1500.00,
      "currency": "USD",
      "account_type_id": 1
    }
  ]
}
```

### Transaction Endpoints

#### POST `/transactions/deposit-by-number`
Deposit money into account by account number.

**Request Body:**
```json
{
  "account_number": "ACC00123456789",
  "amount": 500.00
}
```

#### POST `/transactions/withdraw-by-number`
Withdraw money from account by account number.

**Request Body:**
```json
{
  "account_number": "ACC00123456789",
  "amount": 200.00
}
```

#### GET `/accounts/:accountId/transactions`
Get transaction history for an account.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "transactions": [
    {
      "transaction_id": 1,
      "type": "deposit",
      "amount": 500.00,
      "transaction_date": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## 🎨 Frontend Components

### Core Components

#### App.jsx
Main application component with routing configuration.

#### Navbar.jsx
Responsive navigation bar with branding and mobile menu.

#### Pages

**Login.jsx**
- User authentication form
- JWT token handling
- Redirect logic

**Register.jsx**
- User registration form
- Password validation
- Form state management

**Dashboard.jsx**
- Account overview cards
- Transaction history
- Customer registration flow

**TransactionPage.jsx**
- Deposit/withdrawal forms
- Transaction type selection
- Result feedback

### Component Architecture

```
App
├── Navbar (authenticated routes)
├── Routes
│   ├── Login (/login)
│   ├── Register (/register)
│   ├── ProtectedRoute
│   │   ├── Dashboard (/dashboard)
│   │   └── TransactionPage (/transactions)
│   └── Redirect (/)
```

### State Management

- **Local State**: React useState hooks for component state
- **Local Storage**: JWT token and user data persistence
- **Context API**: Potential future global state management

## 🔐 Authentication & Security

### JWT Authentication Flow

1. **Registration**: User creates account with credentials
2. **Login**: Server validates credentials and issues JWT
3. **Token Storage**: Client stores token in localStorage
4. **API Requests**: Token included in Authorization header
5. **Token Verification**: Server validates token on protected routes
6. **Logout**: Token removed from storage

### Security Measures

- **Password Hashing**: bcrypt with salt rounds
- **Token Expiration**: 24-hour JWT validity
- **CORS Protection**: Configured allowed origins
- **Input Validation**: Server-side data validation
- **SQL Injection Prevention**: Prepared statements
- **HTTPS Ready**: Environment for SSL certificates

### Environment Variables

```env
# Backend
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=banking_user
DB_PASSWORD=secure_password
DB_NAME=banking_db
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173

# Frontend
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_ENV=development
```

## 🚀 Development Setup

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn
- Git

### Backend Setup

```bash
cd bankingBackend
npm install
cp env.example .env
# Edit .env with your database credentials
npm run dev
```

### Frontend Setup

```bash
cd banking-ui
npm install
cp env.example .env
npm run dev
```

### Database Setup

```bash
# Start MySQL service
mysql -u root -p

# Create database
CREATE DATABASE banking_db;
GRANT ALL PRIVILEGES ON banking_db.* TO 'banking_user'@'localhost' IDENTIFIED BY 'secure_password';
FLUSH PRIVILEGES;
```

### Running the Application

```bash
# Terminal 1: Backend
cd bankingBackend && npm run dev

# Terminal 2: Frontend
cd banking-ui && npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🚢 Deployment Guide

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individually
docker build -t banking-backend ./bankingBackend
docker build -t banking-frontend ./banking-ui
```

### Production Build

```bash
# Frontend production build
cd banking-ui
npm run build:prod

# Backend production start
cd bankingBackend
npm run prod
```

### Environment Setup for Production

```env
# Production Backend .env
NODE_ENV=production
DB_HOST=production-db-host
JWT_SECRET=strong-production-secret
CORS_ORIGIN=https://yourdomain.com

# Production Frontend .env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_ENV=production
```

## 📁 Project Structure

```
banking_system/
├── banking-ui/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable Components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/               # Page Components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── TransactionPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── bankingBackend/               # Node.js Backend
│   ├── db.js                    # Database Connection
│   ├── server.js                # Main Server File
│   ├── package.json
│   ├── Dockerfile
│   └── env.example
├── docker-compose.yml           # Docker Orchestration
├── DEPLOYMENT.md               # Deployment Guide
└── README_dev.md              # Developer Documentation
```

## ✨ Key Features

### Core Banking Features
- ✅ User registration and authentication
- ✅ Multiple account type support
- ✅ Account balance management
- ✅ Transaction history
- ✅ Deposit and withdrawal operations
- ✅ Customer profile management

### Technical Features
- ✅ JWT-based security
- ✅ Responsive design
- ✅ Real-time form validation
- ✅ Error handling and logging
- ✅ Environment-based configuration
- ✅ Docker containerization
- ✅ Production-ready builds

### User Experience
- ✅ Modern, professional UI
- ✅ Loading states and feedback
- ✅ Mobile-responsive design
- ✅ Smooth animations and transitions
- ✅ Intuitive navigation
- ✅ Form validation and error messages

## 📚 Best Practices

### Code Quality
- ESLint configuration for consistent code style
- Component separation and reusability
- Error boundary implementation
- TypeScript-ready structure

### Security
- Input sanitization and validation
- Secure password storage (bcrypt)
- JWT token management
- CORS configuration
- Environment variable usage

### Performance
- Code splitting and lazy loading
- Optimized bundle size
- Database connection pooling
- Caching strategies

### Testing
- Component testing structure
- API endpoint testing
- Integration testing setup

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check MySQL service status
sudo systemctl status mysql

# Test database connection
mysql -u banking_user -p banking_db
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3001
netstat -tulpn | grep :5173

# Kill process using port
kill -9 <PID>
```

#### Environment Variables
```bash
# Verify environment variables are loaded
cd bankingBackend && node -e "console.log(process.env.DB_HOST)"
```

#### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
cd banking-ui && rm -rf node_modules .vite
npm install
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check application logs
docker-compose logs -f
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Open an issue on GitHub

---

*Built with ❤️ using React, Node.js, and MySQL*