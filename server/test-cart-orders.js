import mongoose from 'mongoose';
import User from './models/User.js';
import Service from './models/Service.js';
import Package from './models/Package.js';
import Order from './models/Order.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const createTestOrderWithMultipleItems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    // Get test user
    const user = await User.findOne({ email: 'testuser@example.com' });
    if (!user) {
      console.error('❌ Test user not found. Please run test-order-flow.js first');
      return;
    }

    // Get multiple services and packages for cart simulation
    const services = await Service.find().limit(3);
    const packages = await Package.find().limit(3);

    if (services.length < 2 || packages.length < 2) {
      console.error('❌ Not enough services/packages found. Please run seedDatabase.js first');
      return;
    }

    console.log('🛒 Creating order with multiple cart items...');

    // Create order with multiple items (simulating cart)
    const orderData = {
      items: [
        {
          serviceId: services[0]._id,
          packageId: packages[0]._id,
          serviceName: services[0].name,
          packageName: packages[0].name,
          quantity: 1,
          price: packages[0].price,
          addOns: [
            {
              addOnId: null,
              name: 'Interior Cleaning',
              quantity: 1,
              price: 50
            }
          ],
          laundryItems: [],
          vehicleType: 'hatchback',
          specialInstructions: 'Handle with care'
        },
        {
          serviceId: services[1]._id,
          packageId: packages[1]._id,
          serviceName: services[1].name,
          packageName: packages[1].name,
          quantity: 2,
          price: packages[1].price,
          addOns: [],
          laundryItems: [],
          vehicleType: 'bike',
          specialInstructions: 'Quick service needed'
        },
        {
          serviceId: services[2]._id,
          packageId: packages[2]._id,
          serviceName: services[2].name,
          packageName: packages[2].name,
          quantity: 1,
          price: packages[2].price,
          addOns: [
            {
              addOnId: null,
              name: 'Express Delivery',
              quantity: 1,
              price: 30
            },
            {
              addOnId: null,
              name: 'Extra Starch',
              quantity: 1,
              price: 20
            }
          ],
          laundryItems: [
            {
              itemType: 'Shirts',
              quantity: 5,
              pricePerItem: 15
            },
            {
              itemType: 'Pants',
              quantity: 3,
              pricePerItem: 20
            }
          ],
          vehicleType: 'all',
          specialInstructions: 'Laundry items - please iron carefully'
        }
      ],
      serviceAddress: {
        fullAddress: 'Multi-Service Test Address, Whitefield, Bangalore, Karnataka, 560066',
        latitude: 12.9698,
        longitude: 77.7500,
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560066'
      },
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      scheduledTimeSlot: '2:00 PM - 4:00 PM',
      paymentMethod: 'cash',
      customerNotes: 'Mixed cart order - Car + Bike + Laundry services',
      subtotal: 0,
      totalAmount: 0
    };

    // Calculate totals
    let subtotal = 0;
    orderData.items.forEach(item => {
      let itemTotal = item.price * item.quantity;
      
      // Add-ons
      if (item.addOns) {
        item.addOns.forEach(addon => {
          itemTotal += addon.price * addon.quantity;
        });
      }
      
      // Laundry items
      if (item.laundryItems) {
        item.laundryItems.forEach(laundryItem => {
          itemTotal += laundryItem.pricePerItem * laundryItem.quantity;
        });
      }
      
      subtotal += itemTotal;
    });

    orderData.subtotal = subtotal;
    orderData.totalAmount = subtotal;

    // Create the order
    const order = new Order({
      userId: user._id,
      orderNumber: `BFS${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...orderData
    });

    await order.save();

    console.log(`✅ Multi-item order created successfully!`);
    console.log(`📋 Order Number: ${order.orderNumber}`);
    console.log(`💰 Total Amount: ₹${order.totalAmount}`);
    console.log(`🛒 Cart Items: ${order.items.length}`);
    console.log(`📅 Scheduled Date: ${order.scheduledDate.toDateString()}`);
    console.log(`💳 Payment Method: ${order.paymentMethod.toUpperCase()}`);

    console.log('\n🛍️ Cart Breakdown:');
    order.items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.serviceName} - ${item.packageName}`);
      console.log(`   Vehicle: ${item.vehicleType} | Qty: ${item.quantity} | Price: ₹${item.price}`);
      if (item.addOns && item.addOns.length > 0) {
        console.log(`   Add-ons: ${item.addOns.map(addon => `${addon.name} (₹${addon.price})`).join(', ')}`);
      }
      if (item.laundryItems && item.laundryItems.length > 0) {
        console.log(`   Laundry: ${item.laundryItems.map(laundry => `${laundry.quantity}x ${laundry.itemType} (₹${laundry.pricePerItem} each)`).join(', ')}`);
      }
    });

    // Create another simple order for comparison
    const simpleOrder = new Order({
      userId: user._id,
      orderNumber: `BFS${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      items: [{
        serviceId: services[0]._id,
        packageId: packages[0]._id,
        serviceName: services[0].name,
        packageName: packages[0].name,
        quantity: 1,
        price: packages[0].price,
        addOns: [],
        laundryItems: [],
        vehicleType: 'sedan',
        specialInstructions: 'Simple car wash'
      }],
      serviceAddress: {
        fullAddress: 'Simple Order Address, HSR Layout, Bangalore, Karnataka, 560102',
        latitude: 12.9141,
        longitude: 77.6101,
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560102'
      },
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      scheduledTimeSlot: '10:00 AM - 12:00 PM',
      paymentMethod: 'upi',
      customerNotes: 'Simple single service order',
      subtotal: packages[0].price,
      totalAmount: packages[0].price
    });

    await simpleOrder.save();
    console.log(`\n✅ Simple order also created: ${simpleOrder.orderNumber}`);

    console.log('\n🎉 Test orders created successfully!');
    console.log('\n📝 Summary:');
    console.log('✅ Multi-item cart order created (Car + Bike + Laundry)');
    console.log('✅ Simple single-item order created');
    console.log('✅ Different payment methods (COD, UPI)');
    console.log('✅ Various add-ons and laundry items included');
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Open admin panel: http://localhost:3000/admin');
    console.log('2. Login with admin@bubbleflash.com / admin123');
    console.log('3. Go to Booking History');
    console.log('4. See the new cart-based display format');
    console.log('5. View detailed booking info by clicking the eye icon');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

createTestOrderWithMultipleItems();
