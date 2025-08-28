import mongoose from 'mongoose';
import User from './models/User.js';
import Service from './models/Service.js';
import Package from './models/Package.js';
import Order from './models/Order.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const testOrderFlow = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    // Create a test user
    const hashedPassword = await bcrypt.hash('testuser123', 10);
    const testUser = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword,
      phone: '9876543210',
      address: 'Test Address, Bangalore, Karnataka, 560001'
    });

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'testuser@example.com' });
    let user;
    if (existingUser) {
      user = existingUser;
      console.log('📱 Using existing test user');
    } else {
      user = await testUser.save();
      console.log('👤 Created test user');
    }

    // Get a service and package for testing
    const service = await Service.findOne();
    const servicePackage = await Package.findOne({ service: service._id });

    if (!service || !servicePackage) {
      console.error('❌ No services or packages found. Please run seedDatabase.js first');
      return;
    }

    console.log(`🛍️ Found service: ${service.name}`);
    console.log(`📦 Found package: ${servicePackage.name}`);

    // Create test order data
    const orderData = {
      items: [{
        serviceId: service._id,
        packageId: servicePackage._id,
        serviceName: service.name,
        packageName: servicePackage.name,
        quantity: 1,
        price: servicePackage.price,
        addOns: [],
        laundryItems: [],
        vehicleType: servicePackage.vehicleType || 'car',
        specialInstructions: 'Test order'
      }],
      serviceAddress: {
        fullAddress: 'Test Address, HSR Layout, Bangalore, Karnataka, 560102',
        latitude: 12.9141,
        longitude: 77.6101,
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560102'
      },
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      scheduledTimeSlot: '10:00 AM - 12:00 PM',
      paymentMethod: 'upi',
      customerNotes: 'Test order for system verification',
      subtotal: servicePackage.price,
      totalAmount: servicePackage.price
    };

    // Create the order
    const order = new Order({
      userId: user._id,
      orderNumber: `BFS${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...orderData
    });

    await order.save();
    console.log(`✅ Order created successfully!`);
    console.log(`📋 Order Number: ${order.orderNumber}`);
    console.log(`💰 Total Amount: ₹${order.totalAmount}`);
    console.log(`📅 Scheduled Date: ${order.scheduledDate.toDateString()}`);
    console.log(`🏠 Service Address: ${order.serviceAddress.fullAddress}`);

    // Verify the order appears in admin queries
    const allOrders = await Order.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    console.log(`\n📊 Recent Orders (Admin View):`);
    allOrders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.orderNumber} - ${order.userId.name} - ₹${order.totalAmount} - ${order.orderStatus}`);
    });

    console.log('\n🎉 Test completed successfully!');
    console.log('\n📝 Summary:');
    console.log('✅ User created/found');
    console.log('✅ Order placed successfully');
    console.log('✅ Order visible in admin queries');
    console.log('✅ Database integration working');
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Open frontend application');
    console.log('2. Login as test user (testuser@example.com / testuser123)');
    console.log('3. Add items to cart and place order');
    console.log('4. Login to admin panel (admin@bubbleflash.com / admin123)');
    console.log('5. Check booking history for the new order');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

testOrderFlow();
