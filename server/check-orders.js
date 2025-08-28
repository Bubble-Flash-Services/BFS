import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import User from './models/User.js';

dotenv.config();

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bubbleflash');
    console.log('Connected to MongoDB');

    const orders = await Order.find().populate('userId', 'name email phone');
    console.log(`Found ${orders.length} orders in database`);
    
    if (orders.length > 0) {
      console.log('\nFirst order sample:');
      console.log('Order Number:', orders[0].orderNumber);
      console.log('User ID:', orders[0].userId);
      console.log('Cart Items:', orders[0].cartItems?.length || 0);
      console.log('Status:', orders[0].status);
      console.log('Created At:', orders[0].createdAt);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error checking orders:', error);
  }
}

checkOrders();
