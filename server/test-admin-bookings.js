import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testAdminLogin() {
  try {
    console.log('🔐 Testing admin login...');
    
    const response = await fetch(`${API_BASE}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@bubbleflash.com',
        password: 'admin123'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Admin login successful');
      console.log('Token:', data.token ? 'Generated' : 'Missing');
      return data.token;
    } else {
      console.log('❌ Admin login failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('💥 Admin login error:', error.message);
    return null;
  }
}

async function testBookingsEndpoint(token) {
  try {
    console.log('\n📋 Testing bookings endpoint...');
    
    const response = await fetch(`${API_BASE}/adminNew/bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Bookings retrieved successfully');
      console.log('Total bookings:', data.data.bookings.length);
      console.log('Pagination:', data.data.pagination);
      
      if (data.data.bookings.length > 0) {
        console.log('\nFirst booking sample:');
        console.log('Order Number:', data.data.bookings[0].orderNumber);
        console.log('User:', data.data.bookings[0].userId?.name || 'No user data');
        console.log('Cart Items:', data.data.bookings[0].cartItems?.length || 0);
        console.log('Status:', data.data.bookings[0].status);
      }
    } else {
      console.log('❌ Bookings retrieval failed:', data.message);
    }
    
    return data;
  } catch (error) {
    console.error('💥 Bookings endpoint error:', error.message);
    return null;
  }
}

async function runTest() {
  console.log('🧪 Testing Admin Bookings Flow\n');
  
  const token = await testAdminLogin();
  if (token) {
    await testBookingsEndpoint(token);
  }
}

runTest();
