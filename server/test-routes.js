import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test each route file individually
console.log('Testing route imports...');

try {
  console.log('Testing auth routes...');
  const authRoutes = await import('./routes/auth.js');
  app.use('/api/auth', authRoutes.default);
  console.log('✓ Auth routes loaded successfully');
} catch (error) {
  console.error('✗ Error loading auth routes:', error.message);
}

try {
  console.log('Testing user routes...');
  const userRoutes = await import('./routes/user.js');
  app.use('/api/user', userRoutes.default);
  console.log('✓ User routes loaded successfully');
} catch (error) {
  console.error('✗ Error loading user routes:', error.message);
}

try {
  console.log('Testing service routes...');
  const serviceRoutes = await import('./routes/services.js');
  app.use('/api/services', serviceRoutes.default);
  console.log('✓ Service routes loaded successfully');
} catch (error) {
  console.error('✗ Error loading service routes:', error.message);
}

try {
  console.log('Testing cart routes...');
  const cartRoutes = await import('./routes/cart.js');
  app.use('/api/cart', cartRoutes.default);
  console.log('✓ Cart routes loaded successfully');
} catch (error) {
  console.error('✗ Error loading cart routes:', error.message);
}

try {
  console.log('Testing order routes...');
  const orderRoutes = await import('./routes/orders.js');
  app.use('/api/orders', orderRoutes.default);
  console.log('✓ Order routes loaded successfully');
} catch (error) {
  console.error('✗ Error loading order routes:', error.message);
}

try {
  console.log('Testing address routes...');
  const addressRoutes = await import('./routes/addresses.js');
  app.use('/api/addresses', addressRoutes.default);
  console.log('✓ Address routes loaded successfully');
} catch (error) {
  console.error('✗ Error loading address routes:', error.message);
}

try {
  console.log('Testing coupon routes...');
  const couponRoutes = await import('./routes/coupons.js');
  app.use('/api/coupons', couponRoutes.default);
  console.log('✓ Coupon routes loaded successfully');
} catch (error) {
  console.error('✗ Error loading coupon routes:', error.message);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Route test successful'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Route test server running on port ${PORT}`);
});
