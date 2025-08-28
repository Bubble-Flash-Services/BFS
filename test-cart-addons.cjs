// Test Cart Addons - Verify that addons from localStorage are properly sent to order API
const axios = require('axios');

async function testCartAddonsConversion() {
  try {
    console.log('🧪 Testing Cart Addons Conversion...\n');

    // This simulates the cart structure from localStorage
    const cartWithAddons = [
      {
        "id": "carwash-1-1756326064787",
        "name": "Quick Shine",
        "image": "/car/hatchback/car1.png",
        "price": 547,
        "category": "Hatchbacks",
        "type": "car-wash",
        "packageDetails": {
          "basePrice": 199,
          "addons": [
            {
              "id": 10,
              "name": "Wax Body Polishing",
              "price": 149,
              "description": "Premium wax coating for body protection",
              "icon": ""
            },
            {
              "id": 11,
              "name": "Leather Dashboard/Interior Polishing",
              "price": 199,
              "description": "Complete leather dashboard and interior polishing",
              "icon": ""
            }
          ],
          "addonsTotal": 348,
          "features": [
            "Exterior Wash using high-pressure water gun",
            "Foam Wash (Normal Foam included)",
            "Tyre Cleaning"
          ]
        },
        "quantity": 1
      }
    ];

    console.log('📦 Cart Data Structure from localStorage:');
    console.log('Service: Quick Shine (₹199 base)');
    console.log('Add-ons:');
    cartWithAddons[0].packageDetails.addons.forEach(addon => {
      console.log(`  - ${addon.name}: ₹${addon.price}`);
    });
    console.log(`Total Item Price: ₹${cartWithAddons[0].price}\n`);

    // Simulate the conversion logic from CartPage.jsx
    const convertedOrderData = {
      items: cartWithAddons.map(item => ({
        serviceId: item.serviceId || item.id,
        packageId: item.packageId,
        serviceName: item.serviceName || item.title || item.name,
        packageName: item.packageName || item.plan,
        quantity: item.quantity || 1,
        price: item.price,
        addOns: (item.addOns || item.packageDetails?.addons || []).map(addon => ({
          ...addon,
          quantity: addon.quantity || 1
        })),
        laundryItems: item.laundryItems || [],
        vehicleType: item.vehicleType || item.category,
        specialInstructions: item.specialInstructions || item.notes
      })),
      serviceAddress: {
        fullAddress: 'Test Address, Bangalore, 560001',
        latitude: 12.9716,
        longitude: 77.5946
      },
      scheduledDate: new Date(Date.now() + 86400000),
      scheduledTimeSlot: '10:00-12:00',
      paymentMethod: 'cash'
    };

    console.log('🔄 Converted Order Data:');
    console.log('Service Name:', convertedOrderData.items[0].serviceName);
    console.log('Add-ons Count:', convertedOrderData.items[0].addOns.length);
    console.log('Add-ons:');
    convertedOrderData.items[0].addOns.forEach(addon => {
      console.log(`  - ${addon.name}: ₹${addon.price}`);
    });
    console.log('');

    // Get auth token
    console.log('🔐 Getting auth token...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/signin', {
      email: 'test@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Got auth token\n');

    // Create order with converted data
    console.log('🛒 Creating order with addons...');
    const orderResponse = await axios.post('http://localhost:5000/api/orders', convertedOrderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (orderResponse.data.success) {
      const order = orderResponse.data.data;
      console.log('✅ Order created successfully!');
      console.log(`📋 Order Number: ${order.orderNumber}`);
      console.log(`💰 Total Amount: ₹${order.totalAmount}`);
      
      console.log('\n🔍 Verification - Order Items:');
      order.items.forEach((item, index) => {
        console.log(`${index + 1}. Service: ${item.serviceName}`);
        console.log(`   Base Price: ₹${item.price}`);
        console.log(`   Add-ons (${item.addOns?.length || 0}):`);
        
        if (item.addOns && item.addOns.length > 0) {
          item.addOns.forEach(addon => {
            console.log(`   - ${addon.name}: ₹${addon.price}`);
          });
          
          const addonsTotal = item.addOns.reduce((sum, addon) => sum + addon.price, 0);
          console.log(`   Add-ons Total: ₹${addonsTotal}`);
          
          // Verify the addons were preserved
          if (item.addOns.length === 2 && 
              item.addOns.some(a => a.name === 'Wax Body Polishing') &&
              item.addOns.some(a => a.name === 'Leather Dashboard/Interior Polishing')) {
            console.log('   ✅ All addons preserved correctly!');
          } else {
            console.log('   ❌ Some addons were lost or modified');
          }
        } else {
          console.log('   ❌ No addons found in order - conversion failed!');
        }
      });

    } else {
      console.log('❌ Order creation failed:', orderResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testCartAddonsConversion();
