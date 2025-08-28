import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testSimpleBookings(token) {
  try {
    console.log('🔍 Testing simple bookings retrieval...');
    
    const response = await fetch(`${API_BASE}/adminNew/bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
      console.log('Response data:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Raw response:', text);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getToken() {
  const response = await fetch(`${API_BASE}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@bubbleflash.com',
      password: 'admin123'
    })
  });
  
  const data = await response.json();
  return data.token;
}

async function main() {
  const token = await getToken();
  if (token) {
    await testSimpleBookings(token);
  }
}

main();
