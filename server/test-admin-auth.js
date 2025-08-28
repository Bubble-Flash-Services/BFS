import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testAdminFlow() {
  try {
    console.log('🔐 Testing admin login and token...');
    
    // Step 1: Login
    const loginResponse = await fetch(`${API_BASE}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@bubbleflash.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.log('❌ Admin login failed:', loginData.message);
      return;
    }
    
    console.log('✅ Admin login successful');
    console.log('Token received:', loginData.token ? 'Yes' : 'No');
    console.log('Admin info:', {
      name: loginData.admin?.name,
      email: loginData.admin?.email,
      role: loginData.admin?.role,
      permissions: loginData.admin?.permissions
    });

    // Step 2: Test bookings with token
    console.log('\n📋 Testing bookings with admin token...');
    
    const bookingsResponse = await fetch(`${API_BASE}/adminNew/bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Bookings response status:', bookingsResponse.status);
    
    if (bookingsResponse.status === 401) {
      console.log('❌ Token authentication failed');
      const errorText = await bookingsResponse.text();
      console.log('Error response:', errorText);
    } else if (bookingsResponse.status === 200) {
      console.log('✅ Token authentication successful');
      const bookingsData = await bookingsResponse.json();
      console.log('Bookings count:', bookingsData.data?.bookings?.length || 0);
    } else {
      console.log('⚠️  Unexpected response status');
      const responseText = await bookingsResponse.text();
      console.log('Response:', responseText);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

testAdminFlow();
