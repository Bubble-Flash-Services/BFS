import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import './passport.js';
import authRoutes from './routes/auth.js';
import authAdminRoutes from './routes/authAdmin.js';
import userRoutes from './routes/user.js';
import serviceRoutes from './routes/services.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import addressRoutes from './routes/addresses.js';
import couponRoutes from './routes/coupons.js';
import paymentRoutes from './routes/payments.js';
import callbackRoutes from './routes/callback.js';
import adminRoutes from './routes/admin.js';
import adminNewRoutes from './routes/adminNew.js';
import employeeRoutes from './routes/employee.js';
import greenServicesRoutes from './routes/greenServices.js';
import greenBookingsRoutes from './routes/greenBookings.js';
import greenProvidersRoutes from './routes/greenProviders.js';
import greenAdminRoutes from './routes/greenAdmin.js';
import moversPackersRoutes from './routes/moversPackers.js';
import dotenv from 'dotenv';
dotenv.config();
import { configureCloudinary } from './services/cloudinary.js';
import { startCleanupTasks } from './services/cleanupScheduler.js';

const app = express();

// Trust proxy so secure cookies and protocol detection work on Render/Proxies
app.set('trust proxy', 1);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', authAdminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/callback', callbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/adminNew', adminNewRoutes);
app.use('/api/employee', employeeRoutes);

// Green & Clean routes
app.use('/api/green/services', greenServicesRoutes);
app.use('/api/green/booking', greenBookingsRoutes);
app.use('/api/green/providers', greenProvidersRoutes);
app.use('/api/green/admin', greenAdminRoutes);

// Movers & Packers routes
app.use('/api/movers-packers', moversPackersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Bubble Flash API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
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

const connectOnce = async (uri) => {
  await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 20000,
        retryWrites: true,
  });
};

const connectWithRetry = async (retries = 5, delayMs = 4000) => {
  const primary = process.env.MONGO_URI;
  const fallback = process.env.MONGO_URI_FALLBACK;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await connectOnce(primary);
      console.log('MongoDB connected successfully');
      return;
    } catch (err) {
      console.error(`MongoDB connection error (attempt ${attempt}/${retries}):`, err.message || err);
      if (attempt === retries) {
        if (fallback) {
          console.warn('Primary DB unreachable. Trying fallback URI...');
          await connectOnce(fallback);
          console.log('MongoDB connected via fallback URI');
          return;
        }
        throw err;
      }
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
};

(async () => {
  try {
    configureCloudinary();
    startCleanupTasks();
    await connectWithRetry();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
})();
