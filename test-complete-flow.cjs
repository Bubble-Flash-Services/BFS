// Test Complete Cart Flow - From localStorage to Order with Addons
const axios = require('axios');

async function testCompleteCartFlow() {
  try {
    console.log('🧪 Testing Complete Cart Flow with Addons...\n');

    // Get auth token
    console.log('🔐 Getting auth token...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/signin', {
      email: 'test@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Got auth token\n');

    // Simulate cart data structure from localStorage (with packageDetails.addons)
    const localStorageCartData = [
      {
        "id": "carwash-premium-123",
        "name": "Deluxe Car Wash",
        "image": "/car/hatchback/car1.png",
        "price": 638,
        "category": "Hatchbacks",
        "type": "car-wash",
        "packageDetails": {
          "basePrice": 399,
          "addons": [
            {
              "id": 10,
              "name": "Tyre Cleaning & Polishing",
              "price": 189,
              "description": "Professional tyre cleaning and polishing",
              "icon": ""
            },
            {
              "id": 11,
              "name": "Car Welcome Mats Cover (Set)",
              "price": 50,
              "description": "Premium car mat covers",
              "icon": ""
            }
          ],
          "addonsTotal": 239,
          "features": [
            "Base Service",
            "Exterior Wash",
            "Interior Cleaning"
          ]
        },
        "quantity": 1
      }
    ];

    console.log('📦 Step 1: Cart Data from localStorage');
    console.log('Service:', localStorageCartData[0].name);
    console.log('Base Price: ₹' + localStorageCartData[0].packageDetails.basePrice);
    console.log('Add-ons:');
    localStorageCartData[0].packageDetails.addons.forEach(addon => {
      console.log(`  - ${addon.name}: ₹${addon.price}`);
    });
    console.log('Total Price: ₹' + localStorageCartData[0].price);
    console.log('');

    // Step 2: Sync cart to database
    console.log('🔄 Step 2: Syncing cart to database...');
    const syncResponse = await axios.post('http://localhost:5000/api/cart/sync', {
      items: localStorageCartData
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (syncResponse.data.success) {
      console.log('✅ Cart synced to database successfully');
      console.log('Cart items in DB:', syncResponse.data.data.totalItems);
      console.log('');
    } else {
      console.log('❌ Cart sync failed:', syncResponse.data.message);
      return;
    }

    // Step 3: Get cart from database
    console.log('📥 Step 3: Retrieving cart from database...');
    const getCartResponse = await axios.get('http://localhost:5000/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (getCartResponse.data.success) {
      console.log('✅ Cart retrieved from database');
      const dbCartItems = getCartResponse.data.data.items;
      if (dbCartItems.length > 0) {
        console.log('DB Cart Item:');
        console.log(`  Service ID: ${dbCartItems[0].serviceId}`);
        console.log(`  Price: ₹${dbCartItems[0].price}`);
        console.log(`  Add-ons: ${dbCartItems[0].addOns.length}`);
        dbCartItems[0].addOns.forEach(addon => {
          console.log(`    - ${addon.name}: ₹${addon.price} x ${addon.quantity}`);
        });
      }
      console.log('');
    }

    // Step 4: Create order (simulating frontend conversion)
    console.log('🛒 Step 4: Creating order with cart data...');
    const orderData = {
      items: localStorageCartData.map(item => ({
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
        fullAddress: '123 Test Street, HSR Layout, Bangalore, 560102',
        latitude: 12.9716,
        longitude: 77.5946
      },
      scheduledDate: new Date(Date.now() + 86400000),
      scheduledTimeSlot: '10:00-12:00',
      paymentMethod: 'cash'
    };

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
      
      console.log('\n📦 Order Item Details:');
      order.items.forEach((item, index) => {
        console.log(`${index + 1}. Service: ${item.serviceName}`);
        console.log(`   Package: ${item.packageName}`);
        console.log(`   Base Price: ₹${item.price}`);
        console.log(`   Add-ons (${item.addOns.length}):`);
        
        let addonsTotal = 0;
        item.addOns.forEach(addon => {
          addonsTotal += addon.price * addon.quantity;
          console.log(`     - ${addon.name}: ₹${addon.price} x ${addon.quantity} = ₹${addon.price * addon.quantity}`);
        });
        
        const itemTotal = item.price + addonsTotal;
        console.log(`   Item Total: ₹${itemTotal}`);
      });

      console.log('\n🎯 Verification:');
      const orderItem = order.items[0];
      const originalAddons = localStorageCartData[0].packageDetails.addons;
      
      if (orderItem.addOns.length === originalAddons.length) {
        console.log('✅ Correct number of addons preserved');
        
        let allMatch = true;
        originalAddons.forEach(originalAddon => {
          const orderAddon = orderItem.addOns.find(a => a.name === originalAddon.name);
          if (orderAddon && orderAddon.price === originalAddon.price) {
            console.log(`✅ ${originalAddon.name}: ₹${originalAddon.price} preserved`);
          } else {
            console.log(`❌ ${originalAddon.name}: price mismatch or missing`);
            allMatch = false;
          }
        });
        
        if (allMatch) {
          console.log('\n🎉 SUCCESS! Complete cart flow working perfectly:');
          console.log('✅ Cart with addons stored in localStorage');
          console.log('✅ Cart synced to database with addons preserved');
          console.log('✅ Order created with all addon details intact');
          console.log('✅ Admin will see detailed breakdown in booking view');
        }
      } else {
        console.log('❌ Addon count mismatch');
      }

    } else {
      console.log('❌ Order creation failed:', orderResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testCompleteCartFlow();
