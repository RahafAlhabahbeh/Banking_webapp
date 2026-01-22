
# SecureBank - Fullstack Banking System

## 🌟 Overview

SecureBank is a modern, professional banking web application featuring a beautiful React frontend and robust Node.js backend with MySQL database. The application provides secure user authentication, account management, and financial transaction capabilities with an enterprise-grade user interface.

### ✨ Key Features
- **Modern UI/UX**: Professional banking interface with gradients, animations, and responsive design
- **Secure Authentication**: JWT-based user authentication with password hashing
- **Account Management**: Multiple account types with balance tracking
- **Transaction Processing**: Secure deposit and withdrawal operations
- **Real-time Feedback**: Loading states and transaction confirmations
- **Mobile Responsive**: Works seamlessly on all devices

### 🏗️ Architecture
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + MySQL
- **Security**: JWT authentication + bcrypt password hashing
- **Deployment**: Docker + Nginx ready

## 🛠️ Quick Start (Recommended)

### Using Docker (Easiest)
```bash
# Clone and navigate to project
cd banking_system

# Start all services with Docker Compose
docker-compose up --build

# Access the application at http://localhost:3000
```

### Manual Setup

#### Prerequisites
- Node.js 18+
- MySQL 8.0+ (optional for basic testing)
- npm or yarn

#### 1. Database Setup (Optional - can run without DB initially)
```bash
# Start MySQL service and create database
mysql -u root -p
```

```sql
CREATE DATABASE banking_db;
CREATE USER 'banking_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON banking_db.* TO 'banking_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 2. Backend Setup
```bash
cd bankingBackend

# Install dependencies (bcrypt replaced with bcryptjs for Windows compatibility)
npm install

# Start development server
npm run dev
```
✅ Backend will run on `http://localhost:3001`

#### 3. Frontend Setup
```bash
cd banking-ui

# Install dependencies
npm install

# Start development server
npm run dev
```
✅ Frontend will run on `http://localhost:5173`

## 🌐 Access the Application

Once both servers are running:

1. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

2. **Register** a new account or **login** with existing credentials

3. **Create a customer profile** to access banking features

4. **Perform transactions** using the Transactions page

## 🧪 Testing & Verification

### Backend Connection Test
Visit `http://localhost:3001/test-db` to verify database connectivity.

### API Health Check
```bash
curl http://localhost:3001/test-db
```

Expected response:
```json
{
  "message": "DB connected",
  "result": 1
}
```

## 📁 Project Structure

```
banking_system/
├── banking-ui/                    # React Frontend
│   ├── src/
│   │   ├── components/           # Reusable Components
│   │   ├── pages/               # Page Components
│   │   └── index.css           # Global Styles & Tailwind
│   ├── Dockerfile               # Frontend Container
│   └── nginx.conf              # Production Web Server
├── bankingBackend/              # Node.js Backend
│   ├── server.js               # Main Application
│   ├── db.js                   # Database Connection
│   ├── Dockerfile              # Backend Container
│   └── env.example            # Environment Template
├── docker-compose.yml          # Multi-container Setup
├── DEPLOYMENT.md              # Production Deployment Guide
└── README_dev.md              # Developer Documentation
```

## 🚀 Development Workflow

### Starting Development Servers
```bash
# Terminal 1: Backend
cd bankingBackend && npm run dev

# Terminal 2: Frontend
cd banking-ui && npm run dev
```

### Building for Production
```bash
# Frontend production build
cd banking-ui && npm run build:prod

# Backend production start
cd bankingBackend && npm run prod
```

## 🔧 Environment Configuration

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=banking_user
DB_PASSWORD=secure_password
DB_NAME=banking_db
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_ENV=development
VITE_APP_NAME=SecureBank
```

## 📡 API Endpoints

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User authentication

### Account Management
- `POST /accounts/create` - Create new account
- `GET /users/:userId/accounts` - Get user accounts
- `GET /accounts/:accountId/transactions` - Get transaction history

### Transactions
- `POST /transactions/deposit-by-number` - Deposit funds
- `POST /transactions/withdraw-by-number` - Withdraw funds

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build backend
```

## 🔍 Troubleshooting

### Common Issues

**Port Conflicts:**
```bash
# Check port usage
netstat -tulpn | grep :3001
netstat -tulpn | grep :5173

# Kill process using port
kill -9 <PID>
```

**Database Connection Issues:**
```bash
# Test MySQL connection
mysql -u banking_user -p banking_db -e "SELECT 1"

# Check MySQL service
sudo systemctl status mysql
```

**Build Issues:**
```bash
# Clear caches and reinstall
cd banking-ui && rm -rf node_modules .vite && npm install
cd bankingBackend && rm -rf node_modules && npm install
```

**CORS Errors:**
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check that backend is running on correct port

## 📚 Documentation

- **[README_dev.md](README_dev.md)** - Comprehensive developer documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 User Journey

1. **Registration**: Create account with username, email, and password
2. **Login**: Authenticate with credentials
3. **Profile Setup**: Complete customer information and create bank account
4. **Dashboard**: View account balance and recent transactions
5. **Transactions**: Perform deposits and withdrawals
6. **History**: Monitor transaction history and account activity

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side data sanitization
- **CORS Protection**: Configured cross-origin policies
- **SQL Injection Prevention**: Prepared statements

---

**Built with ❤️ using React, Node.js, and MySQL**

*SecureBank - Your trusted banking partner*

