import express from 'express';
import mongoose from 'mongoose';
import Service from './models/Service.js';
import Package from './models/Package.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Test endpoint to debug order creation
app.post('/debug-order', async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('📋 Debug Order Request Body:', JSON.stringify(req.body, null, 2));
    
    // Check if services exist
    const serviceIds = req.body.items?.map(item => item.serviceId) || [];
    const services = await Service.find({ _id: { $in: serviceIds } });
    console.log('🔍 Found services:', services.length, 'Expected:', serviceIds.length);
    
    // Check if packages exist
    const packageIds = req.body.items?.map(item => item.packageId).filter(Boolean) || [];
    const packages = await Package.find({ _id: { $in: packageIds } });
    console.log('📦 Found packages:', packages.length, 'Expected:', packageIds.length);
    
    // Check if user exists (assuming user ID is passed)
    const testUser = await User.findOne({ email: 'testuser@example.com' });
    console.log('👤 Test user found:', !!testUser);
    
    res.json({
      success: true,
      debug: {
        servicesFound: services.length,
        servicesExpected: serviceIds.length,
        packagesFound: packages.length,
        packagesExpected: packageIds.length,
        userExists: !!testUser,
        requestStructure: Object.keys(req.body)
      }
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🔧 Debug server running on port ${PORT}`);
});
