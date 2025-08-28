import fetch from 'node-fetch';

const testOrderCreation = async () => {
  try {
    // Login first to get token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'testuser123'
      })
    });

    const loginResult = await loginResponse.json();
    
    if (!loginResult.success) {
      console.error('❌ Login failed:', loginResult.message);
      return;
    }

    console.log('✅ Login successful');
    const token = loginResult.token;

    // Test order creation with mock cart data
    const orderData = {
      items: [
        {
          id: 'bikewash-basic-1234567890',
          name: 'Basic Bike Wash',
          type: 'bike-wash',
          price: 199,
          category: 'standard',
          quantity: 1,
          packageDetails: {
            basePrice: 199,
            addons: [],
            addonsTotal: 0,
            features: ['Exterior wash', 'Basic cleaning']
          }
        }
      ],
      serviceAddress: {
        fullAddress: 'Test Address, Bangalore, Karnataka, 560001',
        latitude: 12.9716,
        longitude: 77.5946,
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      },
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scheduledTimeSlot: '10:00 AM - 12:00 PM',
      paymentMethod: 'upi',
      customerNotes: 'Test order from API'
    };

    console.log('📋 Creating order...');
    
    const orderResponse = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const orderResult = await orderResponse.json();
    
    if (orderResult.success) {
      console.log('✅ Order created successfully!');
      console.log('📋 Order Number:', orderResult.data.orderNumber);
      console.log('💰 Total Amount:', orderResult.data.totalAmount);
    } else {
      console.error('❌ Order creation failed:', orderResult.message);
      console.error('Error details:', orderResult.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testOrderCreation();
