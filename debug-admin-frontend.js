// Debug script to check localStorage and admin authentication
// Run this in the browser console on the admin page

console.log('🔍 Admin Authentication Debug');
console.log('================================');

// Check localStorage
const adminToken = localStorage.getItem('adminToken');
const adminUser = localStorage.getItem('adminUser');

console.log('📦 LocalStorage Contents:');
console.log('adminToken:', adminToken ? 'Present' : 'Missing');
if (adminToken) {
  console.log('Token length:', adminToken.length);
  console.log('Token starts with:', adminToken.substring(0, 20) + '...');
}

console.log('adminUser:', adminUser ? 'Present' : 'Missing');
if (adminUser) {
  try {
    const user = JSON.parse(adminUser);
    console.log('Admin user:', {
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    });
  } catch (e) {
    console.log('Invalid user data in localStorage');
  }
}

// Test API call
if (adminToken) {
  console.log('\n🧪 Testing API Call:');
  fetch('/api/adminNew/bookings', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  })
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    return response.text();
  })
  .then(text => {
    console.log('Response body:', text);
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON:', json);
    } catch (e) {
      console.log('Not valid JSON');
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
} else {
  console.log('❌ No admin token found - user needs to log in');
}
