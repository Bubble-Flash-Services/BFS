import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bubbleflash');
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'testcart@example.com' });
    if (existingUser) {
      console.log('Test user already exists:', existingUser.name, existingUser.email);
      await mongoose.disconnect();
      return;
    }

    // Create test user
    const testUser = new User({
      name: 'Test Cart User',
      email: 'testcart@example.com',
      password: 'test123', // This will be hashed automatically by the pre-save hook
      phone: '9876543299', // Changed to avoid duplicate phone number
      address: 'Test Address for Cart Sync',
      isActive: true
    });

    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log('Email: testcart@example.com');
    console.log('Password: test123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();
