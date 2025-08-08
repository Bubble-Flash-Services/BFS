# Complete Integration Guide: Client-Admin-Employee Backend Connection with Razorpay

## Table of Contents
1. [Project Architecture Overview](#project-architecture-overview)
2. [Prerequisites & Environment Setup](#prerequisites--environment-setup)
3. [Database Configuration](#database-configuration)
4. [Backend Server Setup](#backend-server-setup)
5. [Frontend Integration](#frontend-integration)
6. [Authentication & Authorization](#authentication--authorization)
7. [User Management System](#user-management-system)
8. [Employee Management System](#employee-management-system)
9. [API Endpoints Integration](#api-endpoints-integration)
10. [Razorpay Payment Integration](#razorpay-payment-integration)
11. [Testing & Validation](#testing--validation)
10. [Deployment Setup](#deployment-setup)
11. [Troubleshooting](#troubleshooting)

---

## Project Architecture Overview

### Current Stack Analysis
```
Frontend (React):
├── Client Portal (Customer Interface)
├── Admin Dashboard (Management Interface)
└── Employee Portal (Worker Interface)

Backend (Node.js + Express):
├── Authentication System
├── API Routes
├── Controllers
├── Middleware
└── Models

Database (MongoDB):
├── Users Collection
├── Admin Collection
├── Employee Collection
├── Orders Collection
├── Services Collection
└── Payments Collection
```

### Data Flow Architecture
```
Client → Frontend → Backend API → Database
Admin → Admin Panel → Backend API → Database
Employee → Employee Portal → Backend API → Database
Payment → Razorpay → Backend Webhook → Database
```

---

## Prerequisites & Environment Setup

### 1. Required Software
```bash
# Node.js (v16 or higher)
node --version

# MongoDB (v5.0 or higher)
mongod --version

# Git
git --version

# Package Manager (npm/yarn)
npm --version
```

### 2. Environment Variables Setup

#### Backend (.env file)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/bubbleflash
# For MongoDB Atlas (Production)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bubbleflash

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# CORS Configuration
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
EMPLOYEE_URL=http://localhost:3002

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5000000
```

#### Frontend (.env file)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# Razorpay Configuration
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id

# App Configuration
REACT_APP_NAME=Bubble Flash
REACT_APP_VERSION=1.0.0
```

---

## Database Configuration

### 1. MongoDB Setup

#### Local MongoDB Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# macOS
brew install mongodb-community

# Windows
# Download from https://www.mongodb.com/try/download/community
```

#### MongoDB Atlas Setup (Cloud)
```javascript
// 1. Create account at https://cloud.mongodb.com
// 2. Create new cluster
// 3. Configure network access (0.0.0.0/0 for development)
// 4. Create database user
// 5. Get connection string
```

### 2. Database Schema Initialization

#### User Schema Enhancement
```javascript
// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'employee'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  razorpayCustomerId: String,
  profileImage: String,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' }
  }
}, {
  timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

#### Order Schema with Payment Integration
```javascript
// server/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    package: {
      type: String,
      required: true
    },
    addons: [{
      name: String,
      price: Number
    }],
    quantity: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'cash', 'card'],
      default: 'razorpay'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    paidAt: Date
  },
  notes: String,
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    images: [String]
  }
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `BF${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
```

### 3. Database Initialization Script
```javascript
// server/scripts/initDatabase.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');
require('dotenv').config();

const initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create default admin user
    const adminExists = await User.findOne({ email: 'admin@bubbleflash.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@bubbleflash.com',
        phone: '9999999999',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });
      console.log('Default admin user created');
    }

    // Create service categories
    const categories = [
      { name: 'Car Wash', description: 'Professional car washing services' },
      { name: 'Bike Wash', description: 'Professional bike washing services' },
      { name: 'Laundry', description: 'Laundry and dry cleaning services' }
    ];

    for (const category of categories) {
      const exists = await ServiceCategory.findOne({ name: category.name });
      if (!exists) {
        await ServiceCategory.create(category);
        console.log(`Created category: ${category.name}`);
      }
    }

    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();
```

---

## Backend Server Setup

### 1. Enhanced Server Configuration
```javascript
// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    process.env.EMPLOYEE_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/employee', require('./routes/employee'));
app.use('/api/services', require('./routes/services'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/payments', require('./routes/payments'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

### 2. Enhanced Authentication Controller
```javascript
// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../utils/sendEmail');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
  };
  
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
  res.cookie('jwt', token, cookieOptions);
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'customer' } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone'
      });
    }
    
    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      role
    });
    
    // Send verification email
    // await sendVerificationEmail(newUser);
    
    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Check if user exists and password is correct
    const user = await User.findOne({ email, role }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }
    
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true });
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'You are not logged in! Please log in to get access.'
      });
    }
    
    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token does no longer exist.'
      });
    }
    
    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};
```

---

## Frontend Integration

### 1. API Service Configuration
```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Authentication Service
```javascript
// src/services/authService.js
import api from './api';

class AuthService {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, data } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  }

  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      const { token, data } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}

export default new AuthService();
```

### 3. Enhanced AuthContext
```javascript
// src/components/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      const user = authService.getCurrentUser();
      const token = authService.getToken();
      
      if (user && token) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.signup(userData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    signup,
    logout,
    clearError,
    hasRole: (role) => state.user?.role === role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## User Management System

### 1. Enhanced User Model with Additional Fields
```javascript
// server/models/User.js - Extended version
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  // Role and Status
  role: {
    type: String,
    enum: ['customer', 'admin', 'employee'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Profile Information
  profileImage: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  
  // Contact Information
  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }],
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid phone number']
    },
    relation: {
      type: String,
      enum: ['father', 'mother', 'spouse', 'sibling', 'friend', 'other']
    }
  },
  
  // Business Relations
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  razorpayCustomerId: String,
  
  // Preferences and Settings
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      promotional: { type: Boolean, default: false }
    },
    language: { 
      type: String, 
      enum: ['en', 'hi', 'kn', 'ta', 'te'],
      default: 'en' 
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  },
  
  // Account Security
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Metadata
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin'],
    default: 'web'
  },
  referralCode: String,
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for account locked status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate referral code
userSchema.methods.generateReferralCode = function() {
  return `BF${this._id.toString().slice(-6).toUpperCase()}`;
};

// Account lock methods
userSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

module.exports = mongoose.model('User', userSchema);
```

### 2. User Management Controller
```javascript
// server/controllers/userController.js
const User = require('../models/User');
const Address = require('../models/Address');
const Order = require('../models/Order');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { sendEmail } = require('../utils/sendEmail');

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('addresses')
      .populate('referredBy', 'name email')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      emergencyContact,
      preferences
    } = req.body;

    // Check if phone is already taken by another user
    if (phone && phone !== req.user.phone) {
      const existingUser = await User.findOne({ 
        phone, 
        _id: { $ne: req.user._id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already registered'
        });
      }
    }

    const updateData = {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(gender && { gender }),
      ...(emergencyContact && { emergencyContact }),
      ...(preferences && { preferences })
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image to upload'
      });
    }

    // Upload to cloudinary or local storage
    const imageUrl = await uploadToCloudinary(req.file.buffer, {
      folder: 'user-profiles',
      width: 400,
      height: 400,
      crop: 'fill'
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imageUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      data: { profileImage: imageUrl }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [orderStats, user] = await Promise.all([
      Order.aggregate([
        { $match: { customer: userId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$payment.amount' },
            completedOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            }
          }
        }
      ]),
      User.findById(userId).select('createdAt lastLogin')
    ]);

    const stats = orderStats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      completedOrders: 0,
      cancelledOrders: 0
    };

    res.json({
      success: true,
      data: {
        ...stats,
        memberSince: user.createdAt,
        lastLogin: user.lastLogin,
        completionRate: stats.totalOrders > 0 
          ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your password to confirm deletion'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Check for pending orders
    const pendingOrders = await Order.countDocuments({
      customer: req.user._id,
      status: { $in: ['pending', 'confirmed', 'assigned', 'in-progress'] }
    });

    if (pendingOrders > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete account with pending orders'
      });
    }

    // Soft delete - deactivate account
    await User.findByIdAndUpdate(req.user._id, {
      isActive: false,
      email: `deleted_${Date.now()}_${user.email}`,
      phone: `deleted_${Date.now()}_${user.phone}`
    });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get all users with filters
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('addresses', 'street city state pincode')
        .lean(),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('addresses')
      .populate('orders')
      .populate('referredBy', 'name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const orderStats = await Order.aggregate([
      { $match: { customer: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$payment.amount' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        stats: orderStats[0] || { totalOrders: 0, totalSpent: 0, completedOrders: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive, isVerified } = req.body;
    const userId = req.params.id;

    const updateData = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send notification email if account status changed
    if (isActive !== undefined) {
      const emailTemplate = isActive ? 'accountActivated' : 'accountDeactivated';
      await sendEmail({
        to: user.email,
        subject: `Account ${isActive ? 'Activated' : 'Deactivated'}`,
        template: emailTemplate,
        data: { name: user.name }
      });
    }

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

---

## Employee Management System

### 1. Enhanced Employee Model
```javascript
// server/models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  // Link to User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Employee Specific Information
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    enum: ['car-wash', 'bike-wash', 'laundry', 'general'],
    required: true
  },
  specializations: [{
    type: String,
    enum: ['hatchback', 'suv', 'sedan', 'luxury', 'bike', 'scooter', 'laundry', 'dry-clean']
  }],
  
  // Employment Details
  joiningDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance'],
    default: 'full-time'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'terminated'],
    default: 'active'
  },
  
  // Work Information
  workingHours: {
    start: {
      type: String,
      default: '09:00'
    },
    end: {
      type: String,
      default: '18:00'
    }
  },
  workingDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  serviceArea: {
    zones: [{
      type: String // Area names like 'HSR Layout', 'Koramangala', etc.
    }],
    maxDistance: {
      type: Number,
      default: 10 // in kilometers
    }
  },
  
  },
  
  // Current Status
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: Date,
  
  // Assignments
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  assignedOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  
  // Emergency Contact (separate from user's emergency contact)
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
    address: String
  },
  
  // Admin Notes
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ department: 1, status: 1 });
employeeSchema.index({ 'serviceArea.zones': 1 });
employeeSchema.index({ currentLocation: '2dsphere' });

// Virtual for full profile (includes user data)
employeeSchema.virtual('fullProfile', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// Generate employee ID
employeeSchema.pre('save', async function(next) {
  if (!this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    const dept = this.department.substring(0, 2).toUpperCase();
    this.employeeId = `BF-${dept}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Check if employee is available for assignment
employeeSchema.methods.isAvailable = function() {
  return this.status === 'active' && 
         this.isOnline && 
         !this.currentOrder &&
         this.assignedOrders.length < 3; // Max 3 pending assignments
};

module.exports = mongoose.model('Employee', employeeSchema);
```

### 2. Employee Management Controller
```javascript
// server/controllers/employeeController.js
const Employee = require('../models/Employee');
const User = require('../models/User');
const Order = require('../models/Order');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Get employee profile (for employee themselves)
exports.getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id })
      .populate('user', '-password')
      .populate('currentOrder')
      .populate('assignedOrders');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update employee profile
exports.updateMyProfile = async (req, res) => {
  try {
    const {
      specializations,
      workingHours,
      workingDays,
      serviceArea,
      emergencyContact
    } = req.body;

    const updateData = {};
    if (specializations) updateData.specializations = specializations;
    if (workingHours) updateData.workingHours = workingHours;
    if (workingDays) updateData.workingDays = workingDays;
    if (serviceArea) updateData.serviceArea = serviceArea;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;

    const employee = await Employee.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('user', '-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update location (for tracking)
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    await Employee.findOneAndUpdate(
      { user: req.user._id },
      {
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        lastSeen: new Date(),
        isOnline: true
      }
    );

    res.json({
      success: true,
      message: 'Location updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Set online/offline status
exports.updateOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;

    await Employee.findOneAndUpdate(
      { user: req.user._id },
      {
        isOnline,
        lastSeen: new Date()
      }
    );

    res.json({
      success: true,
      message: `Status updated to ${isOnline ? 'online' : 'offline'}`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      department,
      status,
      isOnline,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    if (department && department !== 'all') filter.department = department;
    if (status && status !== 'all') filter.status = status;
    if (isOnline !== undefined) filter.isOnline = isOnline === 'true';

    // Search in user details
    let userFilter = {};
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      if (users.length > 0) {
        filter.user = { $in: users.map(u => u._id) };
      }
    }

    const [employees, total] = await Promise.all([
      Employee.find(filter)
        .populate('user', 'name email phone profileImage isActive')
        .populate('currentOrder', 'orderNumber status')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Employee.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: employees,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      department,
      specializations,
      workingHours,
      workingDays,
      serviceArea,
      emergencyContact
    } = req.body;

    // Create user account first
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'employee',
      isVerified: true
    });

    // Create employee profile
    const employee = await Employee.create({
      user: user._id,
      department,
      specializations,
      workingHours,
      workingDays,
      serviceArea,
      emergencyContact
    });

    await employee.populate('user', '-password');

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Update employee details
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Separate user updates from employee updates
    const userUpdates = {};
    const employeeUpdates = {};

    // Fields that belong to User model
    const userFields = ['name', 'email', 'phone', 'isActive'];
    const employeeFields = ['department', 'specializations', 'status', 'workingHours', 'workingDays', 'serviceArea', 'emergencyContact'];

    Object.keys(updateData).forEach(key => {
      if (userFields.includes(key)) {
        userUpdates[key] = updateData[key];
      } else if (employeeFields.includes(key)) {
        employeeUpdates[key] = updateData[key];
      }
    });

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Update user details if any
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(employee.user, userUpdates, {
        runValidators: true
      });
    }

    // Update employee details if any
    if (Object.keys(employeeUpdates).length > 0) {
      await Employee.findByIdAndUpdate(id, employeeUpdates, {
        runValidators: true
      });
    }

    const updatedEmployee = await Employee.findById(id)
      .populate('user', '-password');

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Admin: Get employee performance analytics
exports.getEmployeeAnalytics = async (req, res) => {
  try {
    // Overall statistics
    const overallStats = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          activeEmployees: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          onlineEmployees: {
            $sum: { $cond: ['$isOnline', 1, 0] }
          }
        }
      }
    ]);

    // Department wise distribution
    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: overallStats[0] || {
          totalEmployees: 0,
          activeEmployees: 0,
          onlineEmployees: 0
        },
        departmentBreakdown: departmentStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

---

## API Endpoints Integration

### User Management Routes
```javascript
// server/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

// User profile routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.post('/upload-image', protect, upload.single('image'), userController.uploadProfileImage);
router.put('/change-password', protect, userController.changePassword);
router.get('/stats', protect, userController.getUserStats);
router.delete('/delete-account', protect, userController.deleteAccount);

// Admin routes for user management
router.get('/admin/all', protect, restrictTo('admin'), userController.getAllUsers);
router.get('/admin/:id', protect, restrictTo('admin'), userController.getUserById);
router.put('/admin/:id/status', protect, restrictTo('admin'), userController.updateUserStatus);

module.exports = router;
```

### Employee Management Routes
```javascript
// server/routes/employee.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Employee self-management routes
router.get('/profile', protect, restrictTo('employee'), employeeController.getMyProfile);
router.put('/profile', protect, restrictTo('employee'), employeeController.updateMyProfile);
router.put('/location', protect, restrictTo('employee'), employeeController.updateLocation);
router.put('/status', protect, restrictTo('employee'), employeeController.updateOnlineStatus);

// Admin routes for employee management
router.get('/admin/all', protect, restrictTo('admin'), employeeController.getAllEmployees);
router.post('/admin/create', protect, restrictTo('admin'), employeeController.createEmployee);
router.put('/admin/:id', protect, restrictTo('admin'), employeeController.updateEmployee);
router.get('/admin/analytics', protect, restrictTo('admin'), employeeController.getEmployeeAnalytics);

module.exports = router;
```

### Frontend API Integration

#### User Management API Service
```javascript
// src/api/user.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const userAPI = axios.create({
  baseURL: `${API_URL}/users`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
userAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User profile operations
export const userService = {
  // Get current user profile
  getProfile: async () => {
    const response = await userAPI.get('/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await userAPI.put('/profile', profileData);
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await userAPI.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await userAPI.put('/change-password', passwordData);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await userAPI.get('/stats');
    return response.data;
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await userAPI.delete('/delete-account', {
      data: { password }
    });
    return response.data;
  },

  // Admin functions
  admin: {
    getAllUsers: async (filters = {}) => {
      const params = new URLSearchParams(filters);
      const response = await userAPI.get(`/admin/all?${params}`);
      return response.data;
    },

    getUserById: async (userId) => {
      const response = await userAPI.get(`/admin/${userId}`);
      return response.data;
    },

    updateUserStatus: async (userId, statusData) => {
      const response = await userAPI.put(`/admin/${userId}/status`, statusData);
      return response.data;
    },
  }
};

// Error handling wrapper
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      message: error.response.data.message || 'An error occurred',
      status: error.response.status
    };
  } else if (error.request) {
    // Request made but no response
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      status: 0
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      status: 0
    };
  }
};
```

#### Employee Management API Service
```javascript
// src/api/employee.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const employeeAPI = axios.create({
  baseURL: `${API_URL}/employees`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
employeeAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const employeeService = {
  // Employee self-management
  getMyProfile: async () => {
    const response = await employeeAPI.get('/profile');
    return response.data;
  },

  updateMyProfile: async (profileData) => {
    const response = await employeeAPI.put('/profile', profileData);
    return response.data;
  },

  updateLocation: async (latitude, longitude) => {
    const response = await employeeAPI.put('/location', { latitude, longitude });
    return response.data;
  },

  updateOnlineStatus: async (isOnline) => {
    const response = await employeeAPI.put('/status', { isOnline });
    return response.data;
  },

  // Admin functions
  admin: {
    getAllEmployees: async (filters = {}) => {
      const params = new URLSearchParams(filters);
      const response = await employeeAPI.get(`/admin/all?${params}`);
      return response.data;
    },

    createEmployee: async (employeeData) => {
      const response = await employeeAPI.post('/admin/create', employeeData);
      return response.data;
    },

    updateEmployee: async (employeeId, updateData) => {
      const response = await employeeAPI.put(`/admin/${employeeId}`, updateData);
      return response.data;
    },

    getAnalytics: async () => {
      const response = await employeeAPI.get('/admin/analytics');
      return response.data;
    },
  }
};
```

### React Components for User Management

#### Enhanced User Profile Component
```jsx
// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { userService, handleApiError } from '../api/user';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [profileResponse, statsResponse] = await Promise.all([
        userService.getProfile(),
        userService.getUserStats()
      ]);

      if (profileResponse.success) {
        setUser(profileResponse.data);
        setFormData(profileResponse.data);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      const errorInfo = handleApiError(error);
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(formData);
      if (response.success) {
        setUser(response.data);
        setEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      const errorInfo = handleApiError(error);
      toast.error(errorInfo.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await userService.uploadProfileImage(file);
        if (response.success) {
          setUser(prev => ({ ...prev, profileImage: response.data.profileImage }));
          toast.success('Profile image updated successfully');
        }
      } catch (error) {
        const errorInfo = handleApiError(error);
        toast.error(errorInfo.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects like preferences.notifications.email
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={user?.profileImage || '/default-avatar.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-gray-50">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-blue-100">{user?.email}</p>
              <p className="text-blue-100">{user?.phone}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹{stats.totalSpent?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor((new Date() - new Date(stats.memberSince)) / (1000 * 60 * 60 * 24))} days
                </div>
                <div className="text-sm text-gray-600">Member Since</div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact?.name || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact?.phone || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
                  <select
                    name="emergencyContact.relation"
                    value={formData.emergencyContact?.relation || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Relation</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="spouse">Spouse</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="preferences.notifications.email"
                    checked={formData.preferences?.notifications?.email || false}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Email Notifications</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="preferences.notifications.sms"
                    checked={formData.preferences?.notifications?.sms || false}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">SMS Notifications</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="preferences.notifications.push"
                    checked={formData.preferences?.notifications?.push || false}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Push Notifications</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="preferences.notifications.promotional"
                    checked={formData.preferences?.notifications?.promotional || false}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Promotional Emails</label>
                </div>
              </div>
            </div>

            {editing && (
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
```

### Database Integration Complete Flow

#### Connection and Setup
```javascript
// server/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### Data Validation and Sanitization
```javascript
// server/middleware/validation.js
const { body, validationResult } = require('express-validator');

// User validation rules
const userValidationRules = () => {
  return [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('phone')
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Please provide a valid Indian phone number'),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  ];
};

// Employee validation rules
const employeeValidationRules = () => {
  return [
    ...userValidationRules(),
    body('department')
      .isIn(['car-wash', 'bike-wash', 'laundry', 'general'])
      .withMessage('Invalid department'),
    
    body('specializations')
      .optional()
      .isArray()
      .withMessage('Specializations must be an array'),
    
    body('workingHours.start')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Invalid start time format'),
    
    body('workingHours.end')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Invalid end time format'),
  ];
};

// Check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  userValidationRules,
  employeeValidationRules,
  validate
};
```

This comprehensive user and employee management system replaces all frontend array-based validation with proper database operations. The system includes:

1. **Database Models**: Enhanced User and Employee schemas with full validation
2. **Controllers**: Complete CRUD operations for both users and employees
3. **API Routes**: RESTful endpoints for all operations
4. **Frontend Integration**: React components with proper API calls
5. **Data Validation**: Server-side validation and sanitization
6. **Error Handling**: Comprehensive error management
7. **Authentication**: JWT-based auth with role-based access
8. **File Uploads**: Profile images and document uploads
9. **Admin Features**: User and employee management dashboards
10. **Real-time Features**: Location tracking and online status

All user and employee data is now stored in and retrieved from the MongoDB database with proper validation, authentication, and authorization!

### 1. Order Management API
```javascript
// server/routes/orders.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Customer routes
router.use(protect); // All routes require authentication

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);
router.patch('/:id/cancel', orderController.cancelOrder);
router.post('/:id/feedback', orderController.addFeedback);

// Admin routes
router.use(restrictTo('admin'));
router.get('/', orderController.getAllOrders);
router.patch('/:id/assign', orderController.assignEmployee);
router.patch('/:id/status', orderController.updateOrderStatus);

// Employee routes
router.use(restrictTo('employee'));
router.get('/assigned/me', orderController.getAssignedOrders);
router.patch('/:id/start', orderController.startOrder);
router.patch('/:id/complete', orderController.completeOrder);

module.exports = router;
```

### 2. Order Controller Implementation
```javascript
// server/controllers/orderController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Employee = require('../models/Employee');
const { createRazorpayOrder } = require('../services/paymentService');

exports.createOrder = async (req, res) => {
  try {
    const {
      services,
      address,
      scheduledDate,
      scheduledTime,
      notes,
      paymentMethod = 'razorpay'
    } = req.body;

    // Calculate total amount
    const totalAmount = services.reduce((total, service) => {
      const addonsTotal = service.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0;
      return total + (service.price * service.quantity) + addonsTotal;
    }, 0);

    // Create order
    const order = await Order.create({
      customer: req.user._id,
      services,
      address,
      scheduledDate,
      scheduledTime,
      notes,
      payment: {
        method: paymentMethod,
        amount: totalAmount
      }
    });

    // Create Razorpay order if payment method is Razorpay
    if (paymentMethod === 'razorpay') {
      const razorpayOrder = await createRazorpayOrder({
        amount: totalAmount * 100, // Convert to paise
        currency: 'INR',
        receipt: order.orderNumber
      });
      
      order.payment.razorpayOrderId = razorpayOrder.id;
      await order.save();
    }

    await order.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'address' },
      { path: 'services.service' }
    ]);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ customer: req.user._id })
      .populate('services.service')
      .populate('address')
      .populate('assignedEmployee', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ customer: req.user._id });

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
```

### 3. Frontend Order Service
```javascript
// src/services/orderService.js
import api from './api';

class OrderService {
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  }

  async getMyOrders(page = 1, limit = 10) {
    try {
      const response = await api.get(`/orders/my-orders?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order' };
    }
  }

  async cancelOrder(orderId, reason) {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel order' };
    }
  }

  async addFeedback(orderId, feedback) {
    try {
      const response = await api.post(`/orders/${orderId}/feedback`, feedback);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add feedback' };
    }
  }

  // Admin methods
  async getAllOrders(filters = {}) {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await api.get(`/orders?${queryString}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  }

  async assignEmployee(orderId, employeeId) {
    try {
      const response = await api.patch(`/orders/${orderId}/assign`, { employeeId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to assign employee' };
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  }
}

export default new OrderService();
```

---

## Razorpay Payment Integration

### 1. Backend Payment Service
```javascript
// server/services/paymentService.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (orderData) => {
  try {
    const options = {
      amount: orderData.amount, // amount in smallest currency unit
      currency: orderData.currency || 'INR',
      receipt: orderData.receipt,
      notes: orderData.notes || {}
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(`Razorpay order creation failed: ${error.message}`);
  }
};

exports.verifyPayment = async (paymentData) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id
    } = paymentData;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      throw new Error('Payment verification failed');
    }

    // Update order with payment details
    const order = await Order.findById(order_id);
    if (!order) {
      throw new Error('Order not found');
    }

    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;
    order.payment.status = 'paid';
    order.payment.paidAt = new Date();
    order.status = 'confirmed';

    await order.save();

    return {
      success: true,
      order
    };
  } catch (error) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};

exports.createRefund = async (paymentId, amount, reason) => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount,
      notes: {
        reason: reason
      }
    });

    return refund;
  } catch (error) {
    throw new Error(`Refund creation failed: ${error.message}`);
  }
};
```

### 2. Payment Routes
```javascript
// server/routes/payments.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

router.use(protect);

router.post('/create-order', paymentController.createPaymentOrder);
router.post('/verify', paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
```

### 3. Payment Controller
```javascript
// server/controllers/paymentController.js
const { createRazorpayOrder, verifyPayment } = require('../services/paymentService');
const Order = require('../models/Order');

exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order || order.customer.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.payment.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order already paid'
      });
    }

    const razorpayOrder = await createRazorpayOrder({
      amount: order.payment.amount * 100, // Convert to paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString()
      }
    });

    order.payment.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const result = await verifyPayment(req.body);
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: result.order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    const event = req.body.event;
    const payload = req.body.payload;
    
    switch (event) {
      case 'payment.captured':
        // Handle successful payment
        console.log('Payment captured:', payload.payment.entity);
        break;
      case 'payment.failed':
        // Handle failed payment
        console.log('Payment failed:', payload.payment.entity);
        break;
      default:
        console.log('Unhandled event:', event);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
```

### 4. Frontend Payment Integration
```javascript
// src/services/paymentService.js
import api from './api';

class PaymentService {
  async createPaymentOrder(orderId) {
    try {
      const response = await api.post('/payments/create-order', { orderId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create payment order' };
    }
  }

  async verifyPayment(paymentData) {
    try {
      const response = await api.post('/payments/verify', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payment verification failed' };
    }
  }

  async initiatePayment(orderData) {
    return new Promise((resolve, reject) => {
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Bubble Flash',
        description: 'Service Payment',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verificationResult = await this.verifyPayment({
              ...response,
              order_id: orderData.order_id
            });
            resolve(verificationResult);
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  }
}

export default new PaymentService();
```

### 5. Payment Component
```javascript
// src/components/PaymentModal.jsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import paymentService from '../services/paymentService';

const PaymentModal = ({ order, onSuccess, onClose }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Create payment order
      const paymentOrder = await paymentService.createPaymentOrder(order._id);

      // Initiate Razorpay payment
      const result = await paymentService.initiatePayment({
        ...paymentOrder.data,
        order_id: order._id,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone
      });

      onSuccess(result.data);
    } catch (error) {
      setError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
        
        <div className="mb-4">
          <p className="text-gray-600">Order Number: {order.orderNumber}</p>
          <p className="text-2xl font-bold text-blue-600">₹{order.payment.amount}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
```

---

## Testing & Validation

### 1. API Testing Script
```javascript
// scripts/testAPI.js
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
let authToken = '';

const test = {
  async auth() {
    console.log('Testing Authentication...');
    
    // Test signup
    try {
      const signupResponse = await axios.post(`${API_BASE}/auth/signup`, {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9999999999',
        password: 'password123'
      });
      console.log('✓ Signup successful');
      authToken = signupResponse.data.token;
    } catch (error) {
      console.log('✗ Signup failed:', error.response?.data?.message);
    }

    // Test login
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('✓ Login successful');
      authToken = loginResponse.data.token;
    } catch (error) {
      console.log('✗ Login failed:', error.response?.data?.message);
    }
  },

  async orders() {
    console.log('Testing Orders...');
    
    const headers = { Authorization: `Bearer ${authToken}` };
    
    // Test create order
    try {
      const orderResponse = await axios.post(`${API_BASE}/orders`, {
        services: [{
          service: '507f1f77bcf86cd799439011', // Mock service ID
          package: 'Basic',
          addons: [],
          quantity: 1,
          price: 299
        }],
        address: '507f1f77bcf86cd799439012', // Mock address ID
        scheduledDate: new Date(),
        scheduledTime: '10:00 AM'
      }, { headers });
      console.log('✓ Order creation successful');
    } catch (error) {
      console.log('✗ Order creation failed:', error.response?.data?.message);
    }

    // Test get orders
    try {
      const ordersResponse = await axios.get(`${API_BASE}/orders/my-orders`, { headers });
      console.log('✓ Get orders successful');
    } catch (error) {
      console.log('✗ Get orders failed:', error.response?.data?.message);
    }
  },

  async payments() {
    console.log('Testing Payments...');
    
    const headers = { Authorization: `Bearer ${authToken}` };
    
    try {
      const paymentResponse = await axios.post(`${API_BASE}/payments/create-order`, {
        orderId: '507f1f77bcf86cd799439013' // Mock order ID
      }, { headers });
      console.log('✓ Payment order creation successful');
    } catch (error) {
      console.log('✗ Payment order creation failed:', error.response?.data?.message);
    }
  }
};

// Run tests
async function runTests() {
  await test.auth();
  await test.orders();
  await test.payments();
}

runTests().catch(console.error);
```

### 2. Frontend Testing with React Testing Library
```javascript
// src/__tests__/PaymentFlow.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../components/AuthContext';
import PaymentModal from '../components/PaymentModal';

// Mock Razorpay
global.Razorpay = jest.fn(() => ({
  open: jest.fn()
}));

const mockOrder = {
  _id: '123',
  orderNumber: 'BF123456',
  payment: {
    amount: 299
  }
};

const MockedPaymentModal = () => (
  <AuthProvider>
    <PaymentModal
      order={mockOrder}
      onSuccess={jest.fn()}
      onClose={jest.fn()}
    />
  </AuthProvider>
);

describe('Payment Flow', () => {
  test('renders payment modal correctly', () => {
    render(<MockedPaymentModal />);
    
    expect(screen.getByText('Complete Payment')).toBeInTheDocument();
    expect(screen.getByText('₹299')).toBeInTheDocument();
    expect(screen.getByText('Pay Now')).toBeInTheDocument();
  });

  test('initiates payment on button click', async () => {
    render(<MockedPaymentModal />);
    
    const payButton = screen.getByText('Pay Now');
    fireEvent.click(payButton);
    
    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });
});
```

---

## Deployment Setup

### 1. Docker Configuration
```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

# Install dependencies for both frontend and backend
COPY package*.json ./
RUN npm install

# Copy backend files
COPY server/ ./server/

# Copy frontend files
COPY src/ ./src/
COPY public/ ./public/

# Build frontend
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
```

### 2. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: bubbleflash-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: .
    container_name: bubbleflash-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/bubbleflash?authSource=admin
      JWT_SECRET: your_jwt_secret_here
      RAZORPAY_KEY_ID: your_razorpay_key_id
      RAZORPAY_KEY_SECRET: your_razorpay_secret
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    volumes:
      - ./uploads:/app/uploads

  nginx:
    image: nginx:alpine
    container_name: bubbleflash-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### 3. Production Environment Setup
```bash
#!/bin/bash
# deploy.sh

echo "Starting Bubble Flash deployment..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Clone repository
git clone https://github.com/your-username/bubble-flash.git
cd bubble-flash

# Copy environment file
cp .env.example .env
nano .env  # Edit with production values

# Install dependencies
npm install

# Build frontend
npm run build

# Start services with Docker Compose
docker-compose up -d

# Setup PM2 for Node.js app (alternative to Docker)
# pm2 start ecosystem.config.js

echo "Deployment completed!"
```

---

## Step-by-Step Setup Instructions

### Phase 1: Backend Setup (Day 1-2)

1. **Environment Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Configure MongoDB and Razorpay keys
   ```

2. **Database Initialization**
   ```bash
   node scripts/initDatabase.js
   ```

3. **Start Backend Server**
   ```bash
   npm run dev
   ```

4. **Test API Endpoints**
   ```bash
   node scripts/testAPI.js
   ```

### Phase 2: Frontend Integration (Day 3-4)

1. **Install Dependencies**
   ```bash
   npm install axios react-router-dom
   ```

2. **Configure API Services**
   - Update API base URL
   - Configure authentication
   - Test login/signup flow

3. **Integrate Components**
   - Connect forms to backend
   - Implement protected routes
   - Add error handling

### Phase 3: Payment Integration (Day 5-6)

1. **Razorpay Setup**
   ```bash
   npm install razorpay
   ```

2. **Backend Payment Routes**
   - Implement payment creation
   - Add webhook handling
   - Test payment verification

3. **Frontend Payment UI**
   - Add Razorpay script
   - Implement payment modal
   - Handle payment success/failure

### Phase 4: Testing & Deployment (Day 7)

1. **Comprehensive Testing**
   - API endpoint testing
   - Frontend integration testing
   - Payment flow testing

2. **Production Deployment**
   - Configure production environment
   - Deploy to cloud provider
   - Set up SSL certificates

---

## Troubleshooting Common Issues

### 1. CORS Issues
```javascript
// Add to server/app.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 2. MongoDB Connection Issues
```javascript
// Check connection string format
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bubbleflash';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
```

### 3. Razorpay Integration Issues
```javascript
// Verify webhook signature
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(body)
  .digest('hex');

if (signature !== expectedSignature) {
  return res.status(400).json({ error: 'Invalid signature' });
}
```

### 4. Authentication Token Issues
```javascript
// Frontend token refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

This comprehensive guide provides everything needed to connect your client, admin, and employee interfaces to the backend with full Razorpay payment integration. Follow the phases sequentially for a systematic implementation.
