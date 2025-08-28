import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testCartSync() {
  try {
    console.log('🧪 Testing Cart Sync Functionality\n');
    
    // Step 1: Login as a regular user
    console.log('🔐 Logging in as user...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'testcart@example.com',
        password: 'test123'
      })
    });

    const loginData = await loginResponse.json();
    
    console.log('Login response status:', loginResponse.status);
    
    if (!loginData.token) {
      console.log('❌ User login failed:', loginData.message || 'No token received');
      return;
    }
    
    console.log('✅ User login successful');
    console.log('User:', loginData.user.name, loginData.user.email);
    const token = loginData.token;

    // Step 2: Test sync endpoint with mock localStorage cart data
    console.log('\n📦 Testing cart sync with mock localStorage data...');
    
    const mockCartItems = [
      {
        id: '68af4f7ccb727f3b7e63686d',
        serviceId: '68af4f7ccb727f3b7e63686d',
        packageId: '68af4f7ccb727f3b7e636874',
        name: 'Basic Car Wash',
        price: 199,
        quantity: 2,
        vehicleType: 'sedan',
        addOns: [],
        specialInstructions: 'Please be careful with the paint'
      },
      {
        id: '68af4f7ccb727f3b7e63686e',
        serviceId: '68af4f7ccb727f3b7e63686e', 
        packageId: '68af4f7ccb727f3b7e636875',
        name: 'Premium Car Wash',
        price: 399,
        quantity: 1,
        vehicleType: 'suv',
        addOns: [],
        specialInstructions: ''
      }
    ];

    const syncResponse = await fetch(`${API_BASE}/cart/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items: mockCartItems })
    });

    const syncData = await syncResponse.json();
    console.log('Sync response status:', syncResponse.status);
    
    if (syncData.success) {
      console.log('✅ Cart synced successfully:', syncData.message);
      console.log('Synced items count:', syncData.data.items?.length || 0);
    } else {
      console.log('❌ Cart sync failed:', syncData.message);
    }

    // Step 3: Verify by retrieving the cart
    console.log('\n📋 Retrieving cart to verify sync...');
    
    const getCartResponse = await fetch(`${API_BASE}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const cartData = await getCartResponse.json();
    
    if (cartData.success) {
      console.log('✅ Cart retrieved successfully');
      console.log('Items in cart:', cartData.data.items?.length || 0);
      cartData.data.items?.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.serviceId?.name || 'Unknown Service'} x${item.quantity} - ₹${item.price}`);
      });
    } else {
      console.log('❌ Failed to retrieve cart:', cartData.message);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

testCartSync();
