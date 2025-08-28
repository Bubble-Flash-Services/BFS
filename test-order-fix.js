// Test Order Fix - Check if cart data is preserved
const axios = require('axios');

async function testOrderCreation() {
  try {
    console.log('🧪 Testing Order Creation with Cart Data...\n');

    // Test cart items with specific names and prices (NOT database defaults)
    const testOrder = {
      items: [
        {
          serviceName: 'Premium Car Wash',
          packageName: 'Ultra Shine Package',
          price: 299,
          quantity: 1,
          vehicleType: 'sedan',
          addOns: [
            {
              name: 'Engine Cleaning',
              price: 150,
              quantity: 1
            }
          ]
        },
        {
          serviceName: 'Bike Deep Clean',
          packageName: 'Sports Bike Special',
          price: 199,
          quantity: 2,
          vehicleType: 'sports',
          addOns: []
        },
        {
          serviceName: 'Laundry Service',
          packageName: 'Express Wash',
          price: 120,
          quantity: 1,
          laundryItems: [
            {
              itemType: 'Shirts',
              quantity: 5,
              pricePerItem: 25
            }
          ]
        }
      ],
      addressId: '674a02ac27f9c3a8cd123456', // Test address
      pickupDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      pickupTime: '10:00',
      paymentMethod: 'cash'
    };

    console.log('📦 Test Order Data:');
    testOrder.items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.serviceName} - ${item.packageName}`);
      console.log(`   Price: ₹${item.price} x ${item.quantity}`);
      if (item.addOns?.length > 0) {
        item.addOns.forEach(addon => {
          console.log(`   Add-on: ${addon.name} - ₹${addon.price} x ${addon.quantity}`);
        });
      }
      if (item.laundryItems?.length > 0) {
        item.laundryItems.forEach(laundry => {
          console.log(`   Laundry: ${laundry.itemType} - ₹${laundry.pricePerItem} x ${laundry.quantity}`);
        });
      }
      console.log('');
    });

    // First login to get a token
    console.log('🔐 Getting auth token...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    }).catch(err => {
      console.log('❌ Login failed, trying to register first...');
      return axios.post('http://localhost:5000/api/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '9876543210'
      });
    });

    const token = loginResponse.data.token;
    console.log('✅ Got auth token\n');

    // Create the order
    console.log('🛒 Creating order...');
    const orderResponse = await axios.post('http://localhost:5000/api/orders', testOrder, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (orderResponse.data.success) {
      console.log('✅ Order created successfully!');
      console.log(`📋 Order Number: ${orderResponse.data.order.orderNumber}`);
      console.log(`💰 Total Amount: ₹${orderResponse.data.order.totalAmount}`);
      console.log('\n📦 Order Items:');
      
      orderResponse.data.order.items.forEach((item, index) => {
        console.log(`${index + 1}. Service: ${item.serviceName}`);
        console.log(`   Package: ${item.packageName}`);
        console.log(`   Price: ₹${item.price} x ${item.quantity}`);
        console.log(`   Vehicle: ${item.vehicleType}`);
        
        if (item.addOns?.length > 0) {
          console.log('   Add-ons:');
          item.addOns.forEach(addon => {
            console.log(`   - ${addon.name}: ₹${addon.price} x ${addon.quantity}`);
          });
        }
        
        if (item.laundryItems?.length > 0) {
          console.log('   Laundry Items:');
          item.laundryItems.forEach(laundry => {
            console.log(`   - ${laundry.itemType}: ₹${laundry.pricePerItem} x ${laundry.quantity}`);
          });
        }
        console.log('');
      });

      // Check if the names and prices match what we sent
      console.log('🔍 Verification:');
      let allMatch = true;
      
      testOrder.items.forEach((sentItem, index) => {
        const receivedItem = orderResponse.data.order.items[index];
        
        if (sentItem.serviceName !== receivedItem.serviceName) {
          console.log(`❌ Service name mismatch: sent "${sentItem.serviceName}", got "${receivedItem.serviceName}"`);
          allMatch = false;
        }
        
        if (sentItem.packageName !== receivedItem.packageName) {
          console.log(`❌ Package name mismatch: sent "${sentItem.packageName}", got "${receivedItem.packageName}"`);
          allMatch = false;
        }
        
        if (sentItem.price !== receivedItem.price) {
          console.log(`❌ Price mismatch: sent ₹${sentItem.price}, got ₹${receivedItem.price}`);
          allMatch = false;
        }
      });

      if (allMatch) {
        console.log('✅ Perfect! All cart data preserved correctly!');
        console.log('🎉 Fix successful - no more generic "Quick Shine ₹199" for all orders!');
      } else {
        console.log('❌ Some data was still overridden by database values');
      }

    } else {
      console.log('❌ Order creation failed:', orderResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testOrderCreation();
