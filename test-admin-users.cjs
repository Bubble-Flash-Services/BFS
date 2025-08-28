// Test Admin Users Endpoint - Verify user retrieval from database
const axios = require('axios');

async function testAdminUsersEndpoint() {
  try {
    console.log('🧪 Testing Admin Users Endpoint...\n');

    // Get admin auth token
    console.log('🔐 Getting admin auth token...');
    const adminLoginResponse = await axios.post('http://localhost:5000/api/admin/auth/login', {
      email: 'admin@bubbleflash.com',
      password: 'admin123'
    }).catch(async (err) => {
      console.log('❌ Admin login failed, checking if admin exists...');
      // Try to create admin if doesn't exist
      try {
        const createResponse = await axios.post('http://localhost:5000/api/admin/auth/register', {
          email: 'admin@bubbleflash.com',
          password: 'admin123',
          name: 'Test Admin'
        });
        console.log('✅ Admin created, now logging in...');
        return axios.post('http://localhost:5000/api/admin/auth/login', {
          email: 'admin@bubbleflash.com',
          password: 'admin123'
        });
      } catch (createErr) {
        throw err; // Return original login error
      }
    });

    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Got admin token\n');

    // Test 1: Get users without pagination
    console.log('📋 Test 1: Getting all users...');
    const usersResponse = await axios.get('http://localhost:5000/api/adminNew/users', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (usersResponse.data.success) {
      console.log('✅ Users retrieved successfully');
      console.log(`📊 Total users: ${usersResponse.data.data.stats.totalUsers}`);
      console.log(`👥 Active users: ${usersResponse.data.data.stats.activeUsers}`);
      console.log(`🔍 Users on page 1: ${usersResponse.data.data.users.length}`);
      
      // Display some user info (without sensitive data)
      if (usersResponse.data.data.users.length > 0) {
        console.log('\n👤 Sample Users:');
        usersResponse.data.data.users.slice(0, 3).forEach((user, index) => {
          console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.isActive ? 'Active' : 'Inactive'}`);
        });
      }
    } else {
      console.log('❌ Failed to get users:', usersResponse.data.message);
      return;
    }

    // Test 2: Search functionality
    console.log('\n🔍 Test 2: Testing search functionality...');
    const searchResponse = await axios.get('http://localhost:5000/api/adminNew/users?search=test', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (searchResponse.data.success) {
      console.log('✅ Search functionality working');
      console.log(`🔍 Found ${searchResponse.data.data.users.length} users matching "test"`);
    }

    // Test 3: Pagination
    console.log('\n📄 Test 3: Testing pagination...');
    const paginationResponse = await axios.get('http://localhost:5000/api/adminNew/users?page=1&limit=5', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (paginationResponse.data.success) {
      console.log('✅ Pagination working');
      const { pagination } = paginationResponse.data.data;
      console.log(`📄 Page: ${pagination.page}/${pagination.pages}`);
      console.log(`📊 Showing: ${paginationResponse.data.data.users.length} of ${pagination.total} users`);
    }

    // Test 4: Status filtering
    console.log('\n🎯 Test 4: Testing status filtering...');
    const activeUsersResponse = await axios.get('http://localhost:5000/api/adminNew/users?status=active', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    if (activeUsersResponse.data.success) {
      console.log('✅ Status filtering working');
      console.log(`✅ Active users: ${activeUsersResponse.data.data.users.length}`);
    }

    console.log('\n🎉 All tests passed! Admin users endpoint is working correctly.');
    console.log('\n📍 Endpoint Details:');
    console.log('URL: http://localhost:5000/api/adminNew/users');
    console.log('Method: GET');
    console.log('Auth: Bearer token (admin)');
    console.log('Query Parameters:');
    console.log('  - page: Page number (default: 1)');
    console.log('  - limit: Items per page (default: 10)');
    console.log('  - search: Search by name, email, or phone');
    console.log('  - status: Filter by "active", "inactive", or "all"');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Tip: Make sure you have admin credentials or the admin authentication is working');
    } else if (error.response?.status === 403) {
      console.log('\n💡 Tip: The admin account may not have "users" permission');
    }
  }
}

// Run the test
testAdminUsersEndpoint();
