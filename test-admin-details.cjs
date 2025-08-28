// Test Admin Booking Details - Create detailed order and check admin view
const axios = require('axios');

async function testDetailedBookingView() {
  try {
    console.log('🧪 Testing Admin Booking Details View...\n');

    // Create a detailed order with multiple add-ons and items
    const detailedOrder = {
      items: [
        {
          serviceName: 'Deluxe Car Wash',
          packageName: 'Premium Exterior & Interior',
          price: 399,
          quantity: 1,
          vehicleType: 'hatchback',
          addOns: [
            {
              name: 'Tyre Cleaning & Polishing',
              price: 189,
              quantity: 1
            },
            {
              name: 'Car Welcome Mats Cover (Set)',
              price: 50,
              quantity: 1
            }
          ],
          specialInstructions: 'Please be careful with the leather seats'
        },
        {
          serviceName: 'Bike Deep Clean',
          packageName: 'Sports Bike Platinum',
          price: 299,
          quantity: 1,
          vehicleType: 'sports',
          addOns: [
            {
              name: 'Chain Cleaning & Lubrication',
              price: 99,
              quantity: 1
            }
          ]
        },
        {
          serviceName: 'Laundry Service',
          packageName: 'Express Wash & Fold',
          price: 150,
          quantity: 1,
          laundryItems: [
            {
              itemType: 'Shirts',
              quantity: 5,
              pricePerItem: 25
            },
            {
              itemType: 'Jeans',
              quantity: 2,
              pricePerItem: 40
            }
          ]
        }
      ],
      serviceAddress: {
        fullAddress: '123 Test Street, HSR Layout, Bangalore, 560102',
        latitude: 12.9716,
        longitude: 77.5946
      },
      scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
      scheduledTimeSlot: '10:00-12:00',
      paymentMethod: 'upi',
      customerNotes: 'Please call before arriving. Gate number 3.'
    };

    // Calculate expected totals
    const item1Total = 399 + 189 + 50; // 638
    const item2Total = 299 + 99; // 398
    const item3Total = 150 + (5 * 25) + (2 * 40); // 355
    const expectedTotal = item1Total + item2Total + item3Total; // 1391

    console.log('📦 Creating Detailed Order:');
    console.log('1. Deluxe Car Wash (Hatchback): ₹399');
    console.log('   + Tyre Cleaning & Polishing: ₹189');
    console.log('   + Car Welcome Mats Cover: ₹50');
    console.log('   = Item Total: ₹638\n');
    
    console.log('2. Bike Deep Clean (Sports): ₹299');
    console.log('   + Chain Cleaning & Lubrication: ₹99');
    console.log('   = Item Total: ₹398\n');
    
    console.log('3. Laundry Service: ₹150');
    console.log('   + Shirts (5 × ₹25): ₹125');
    console.log('   + Jeans (2 × ₹40): ₹80');
    console.log('   = Item Total: ₹355\n');
    
    console.log(`📊 Expected Grand Total: ₹${expectedTotal}\n`);

    // Get auth token
    console.log('🔐 Getting auth token...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/signin', {
      email: 'test@example.com',
      password: 'password123'
    }).catch(err => {
      console.log('❌ Login failed, trying to register first...');
      return axios.post('http://localhost:5000/api/auth/signup', {
        name: 'Test Customer',
        email: 'test@example.com',
        password: 'password123',
        phone: '9876543210'
      });
    });

    const token = loginResponse.data.token;
    console.log('✅ Got auth token\n');

    // Create the detailed order
    console.log('🛒 Creating detailed order...');
    const orderResponse = await axios.post('http://localhost:5000/api/orders', detailedOrder, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (orderResponse.data.success) {
      const order = orderResponse.data.data;
      console.log('✅ Detailed order created successfully!');
      console.log(`📋 Order Number: ${order.orderNumber}`);
      console.log(`💰 Actual Total: ₹${order.totalAmount}`);
      
      if (order.totalAmount === expectedTotal) {
        console.log('✅ Total matches expected amount!');
      } else {
        console.log(`❌ Total mismatch: expected ₹${expectedTotal}, got ₹${order.totalAmount}`);
      }

      console.log('\n🎯 Order created with detailed breakdown:');
      console.log('✅ Multiple services with different packages');
      console.log('✅ Multiple add-ons with individual pricing');
      console.log('✅ Laundry items with quantity-based pricing');
      console.log('✅ Special instructions included');
      console.log('✅ Complete address and scheduling info');
      
      console.log(`\n🔍 To verify the admin view:`);
      console.log(`1. Go to http://localhost:3000/admin/bookings`);
      console.log(`2. Find order: ${order.orderNumber}`);
      console.log(`3. Click "View" to see detailed cart-like breakdown`);
      console.log(`4. Should show itemized pricing like the cart view`);

    } else {
      console.log('❌ Order creation failed:', orderResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testDetailedBookingView();
