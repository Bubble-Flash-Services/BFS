import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bubbleflash');
    console.log('Connected to MongoDB');

    const users = await User.find().select('name email').limit(5);
    console.log(`Found ${users.length} users in database:`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - ${user.email}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkUsers();
