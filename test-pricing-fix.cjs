// Test Pricing Fix - Verify that base price is used correctly
const axios = require('axios');

async function testPricingFix() {
  try {
    console.log('🧪 Testing Pricing Fix...\n');

    // Simulate cart data with packageDetails (total price includes addons)
    const cartData = [
      {
        "id": "carwash-deluxe-456",
        "name": "Deluxe Car Wash",
        "image": "/car/hatchback/car1.png",
        "price": 648,  // THIS IS TOTAL PRICE (base + addons)
        "category": "Hatchbacks",
        "type": "car-wash",
        "packageDetails": {
          "basePrice": 399,  // THIS IS THE BASE PRICE WE SHOULD USE
          "addons": [
            {
              "id": 11,
              "name": "Car Welcome Mats Cover (Set)",
              "price": 50,
              "description": "Premium car mat covers"
            },
            {
              "id": 12,
              "name": "Leather Dashboard/Interior Polishing",
              "price": 199,
              "description": "Complete dashboard polishing"
            }
          ],
          "addonsTotal": 249,  // 50 + 199
          "features": ["Exterior Wash", "Interior Cleaning"]
        },
        "quantity": 1
      }
    ];

    console.log('📊 Cart Analysis:');
    console.log('Cart Total Price (item.price): ₹' + cartData[0].price);
    console.log('Base Price (packageDetails.basePrice): ₹' + cartData[0].packageDetails.basePrice);
    console.log('Addons:');
    cartData[0].packageDetails.addons.forEach(addon => {
      console.log(`  - ${addon.name}: ₹${addon.price}`);
    });
    console.log('Addons Total: ₹' + cartData[0].packageDetails.addonsTotal);
    console.log('Expected Order Total: ₹' + (cartData[0].packageDetails.basePrice + cartData[0].packageDetails.addonsTotal));
    console.log('');

    // Get auth token
    console.log('🔐 Getting auth token...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/signin', {
      email: 'test@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Got auth token\n');

    // Create order with the fixed conversion
    console.log('🛒 Creating order with pricing fix...');
    const orderData = {
      items: cartData.map(item => ({
        serviceId: item.serviceId || item.id,
        packageId: item.packageId,
        serviceName: item.serviceName || item.title || item.name,
        packageName: item.packageName || item.plan,
        quantity: item.quantity || 1,
        price: item.packageDetails?.basePrice || item.basePrice || item.price, // USE BASE PRICE
        addOns: (item.addOns || item.packageDetails?.addons || []).map(addon => ({
          ...addon,
          quantity: addon.quantity || 1
        })),
        laundryItems: item.laundryItems || [],
        vehicleType: item.vehicleType || item.category,
        specialInstructions: item.specialInstructions || item.notes
      })),
      serviceAddress: {
        fullAddress: '123 Test Street, HSR Layout, Bangalore, 560102',
        latitude: 12.9716,
        longitude: 77.5946
      },
      scheduledDate: new Date(Date.now() + 86400000),
      scheduledTimeSlot: '10:00-12:00',
      paymentMethod: 'cash'
    };

    console.log('🔧 Order Data Conversion:');
    console.log('Converted Base Price: ₹' + orderData.items[0].price);
    console.log('Converted Addons:');
    orderData.items[0].addOns.forEach(addon => {
      console.log(`  - ${addon.name}: ₹${addon.price} x ${addon.quantity}`);
    });
    console.log('');

    const orderResponse = await axios.post('http://localhost:5000/api/orders', orderData, {
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
      
      console.log('\n📦 Order Breakdown:');
      const orderItem = order.items[0];
      console.log(`Base Service (${orderItem.packageName}): ₹${orderItem.price}`);
      
      let addonsTotal = 0;
      orderItem.addOns.forEach(addon => {
        const addonTotal = addon.price * addon.quantity;
        addonsTotal += addonTotal;
        console.log(`Add-on: ${addon.name}: ₹${addon.price} x ${addon.quantity} = ₹${addonTotal}`);
      });
      
      const calculatedTotal = orderItem.price + addonsTotal;
      console.log(`Calculated Total: ₹${orderItem.price} + ₹${addonsTotal} = ₹${calculatedTotal}`);
      console.log(`Actual Order Total: ₹${order.totalAmount}`);
      
      // Expected total should be base (399) + addons (249) = 648
      const expectedTotal = 399 + 249;
      console.log(`Expected Total: ₹${expectedTotal}`);
      
      console.log('\n🔍 Verification:');
      if (orderItem.price === 399) {
        console.log('✅ Base price correctly extracted (₹399)');
      } else {
        console.log(`❌ Base price wrong: got ₹${orderItem.price}, expected ₹399`);
      }
      
      if (addonsTotal === 249) {
        console.log('✅ Addons total correct (₹249)');
      } else {
        console.log(`❌ Addons total wrong: got ₹${addonsTotal}, expected ₹249`);
      }
      
      if (order.totalAmount === expectedTotal) {
        console.log('✅ Final total correct (₹648)');
        console.log('\n🎉 PRICING FIX SUCCESSFUL!');
        console.log('✅ No more double-counting of addon prices');
        console.log('✅ Base price properly separated from total');
      } else {
        console.log(`❌ Final total wrong: got ₹${order.totalAmount}, expected ₹${expectedTotal}`);
      }

    } else {
      console.log('❌ Order creation failed:', orderResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testPricingFix();
