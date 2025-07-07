# Bubble Flash - Backend Development Guide

## Technology Stack Recommendation

### Backend Framework
- **Node.js with Express.js** (Fast development, great for REST APIs)
- **Alternative**: NestJS (for larger teams, TypeScript-first)

### Database
- **MySQL 8.0** or **PostgreSQL 14+** (RDBMS for structured data)
- **Redis** (for caching and sessions)

### Authentication
- **JWT (JSON Web Tokens)** for stateless authentication
- **Google OAuth 2.0** for social login
- **OTP verification** for phone numbers

### File Storage
- **AWS S3** or **Cloudinary** for image uploads
- **Local storage** for development

### Payment Integration
- **Razorpay** (supports UPI, cards, wallets - perfect for Indian market)
- **PayU** (alternative)

### Real-time Features
- **Socket.io** for real-time order updates
- **WebSockets** for live notifications

## Project Structure

```
bubble-flash-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── cloudinary.js
│   │   └── razorpay.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── serviceController.js
│   │   ├── orderController.js
│   │   ├── cartController.js
│   │   ├── paymentController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── Service.js
│   │   ├── Cart.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── upload.js
│   │   ├── rateLimit.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── services.js
│   │   ├── orders.js
│   │   ├── cart.js
│   │   ├── payments.js
│   │   └── admin.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── smsService.js
│   │   ├── notificationService.js
│   │   └── paymentService.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   └── logger.js
│   └── app.js
├── migrations/
├── seeders/
├── tests/
├── .env
├── package.json
└── server.js
```

## Implementation Steps

### Step 1: Initialize Project

```bash
mkdir bubble-flash-backend
cd bubble-flash-backend
npm init -y

# Install dependencies
npm install express mysql2 sequelize jsonwebtoken bcryptjs
npm install dotenv cors helmet morgan compression
npm install multer cloudinary razorpay redis ioredis
npm install nodemailer socket.io express-rate-limit
npm install joi express-validator

# Install dev dependencies
npm install --save-dev nodemon jest supertest
```

### Step 2: Environment Configuration

Create `.env` file:
```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bubble_flash
DB_USER=root
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# SMS/Email
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Step 3: Database Configuration

```javascript
// src/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
```

### Step 4: Main Application Setup

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
```

### Step 5: Authentication Middleware

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = { auth, adminAuth };
```

### Step 6: Sample Controller (Auth)

```javascript
// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendOTP, verifyOTP } = require('../services/smsService');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, phone, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email or phone' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      phone,
      password_hash: hashedPassword,
      name
    });

    // Send OTP for phone verification
    await sendOTP(phone);

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully. Please verify your phone number.',
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        phone_verified: user.phone_verified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(400).json({ error: 'Account is suspended' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        phone_verified: user.phone_verified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

const verifyPhone = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const userId = req.user.id;

    const isValid = await verifyOTP(phone, otp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    await User.update(
      { phone_verified: true },
      { where: { id: userId } }
    );

    res.json({ message: 'Phone number verified successfully' });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ error: 'Server error during phone verification' });
  }
};

module.exports = {
  register,
  login,
  verifyPhone
};
```

### Step 7: Sample Routes

```javascript
// src/routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const { register, login, verifyPhone } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('en-IN'),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/verify-phone', auth, verifyPhone);

module.exports = router;
```

### Step 8: Server Entry Point

```javascript
// server.js
require('dotenv').config();
const http = require('http');
const socketio = require('socket.io');
const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Create server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_order', (orderId) => {
    socket.join(`order_${orderId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Sync database (use { force: true } only in development to reset tables)
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
```

### Step 9: Package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "migrate": "sequelize-cli db:migrate",
    "seed": "sequelize-cli db:seed:all"
  }
}
```

## API Endpoints Overview

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/verify-phone` - Verify phone number
- POST `/api/auth/forgot-password` - Forgot password
- POST `/api/auth/reset-password` - Reset password

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/addresses` - Get user addresses
- POST `/api/users/addresses` - Add new address
- PUT `/api/users/addresses/:id` - Update address
- DELETE `/api/users/addresses/:id` - Delete address

### Services
- GET `/api/services/categories` - Get all service categories
- GET `/api/services/categories/:id/subcategories` - Get subcategories
- GET `/api/services/packages/:subcategoryId` - Get service packages
- GET `/api/services/addons/:categoryId` - Get available addons
- GET `/api/services/laundry-items/:subcategoryId` - Get laundry items
- GET `/api/services/accessories` - Get accessories

### Cart
- GET `/api/cart` - Get user cart
- POST `/api/cart/add` - Add item to cart
- PUT `/api/cart/update` - Update cart item
- DELETE `/api/cart/remove/:id` - Remove item from cart
- DELETE `/api/cart/clear` - Clear entire cart

### Orders
- POST `/api/orders` - Create new order
- GET `/api/orders` - Get user orders
- GET `/api/orders/:id` - Get specific order
- PUT `/api/orders/:id/cancel` - Cancel order
- GET `/api/orders/:id/status` - Get order status

### Payments
- POST `/api/payments/create-order` - Create Razorpay order
- POST `/api/payments/verify` - Verify payment
- POST `/api/payments/webhook` - Razorpay webhook

### Admin
- GET `/api/admin/dashboard` - Dashboard stats
- GET `/api/admin/orders` - All orders management
- PUT `/api/admin/orders/:id/status` - Update order status
- GET `/api/admin/users` - User management
- POST `/api/admin/services` - Add new service
- PUT `/api/admin/services/:id` - Update service

## Development Workflow

1. **Setup Database**: Create MySQL database and run migrations
2. **Seed Data**: Add initial service categories, packages, and admin users
3. **Test APIs**: Use Postman or create automated tests
4. **Frontend Integration**: Update frontend API calls to use new endpoints
5. **Deploy**: Use PM2 for process management in production

## Security Best Practices

1. **Input Validation**: Validate all inputs using joi or express-validator
2. **Rate Limiting**: Implement rate limiting for all endpoints
3. **CORS**: Configure CORS properly for production
4. **SQL Injection**: Use parameterized queries (Sequelize handles this)
5. **Authentication**: Use JWT with short expiration times
6. **HTTPS**: Always use HTTPS in production
7. **Environment Variables**: Never commit sensitive data to git

This comprehensive backend setup will provide a solid foundation for your Bubble Flash application with all necessary CRUD operations, authentication, payment integration, and real-time features.
