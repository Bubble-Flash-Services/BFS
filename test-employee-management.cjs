const fetch = require('node-fetch');

async function testEmployeeManagement() {
  try {
    console.log('🧪 Testing Employee Management API...\n');

    // You'll need to replace this with a real admin token
    const adminToken = 'your_admin_token_here';
    
    console.log('📋 1. Fetching employees...');
    const employeesResponse = await fetch('http://localhost:5000/api/adminNew/employees', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    const employeesResult = await employeesResponse.json();
    console.log('📊 Employees Response:', employeesResult.success ? 'SUCCESS' : 'FAILED');
    if (employeesResult.success) {
      console.log(`   - Found ${employeesResult.data.employees.length} employees`);
      console.log(`   - Stats: ${JSON.stringify(employeesResult.data.stats, null, 2)}`);
    }

    console.log('\n📋 2. Fetching unassigned bookings...');
    const bookingsResponse = await fetch('http://localhost:5000/api/adminNew/bookings/unassigned', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    const bookingsResult = await bookingsResponse.json();
    console.log('📊 Unassigned Bookings Response:', bookingsResult.success ? 'SUCCESS' : 'FAILED');
    if (bookingsResult.success) {
      console.log(`   - Found ${bookingsResult.data.bookings.length} unassigned bookings`);
      if (bookingsResult.data.bookings.length > 0) {
        const sample = bookingsResult.data.bookings[0];
        console.log('   - Sample booking:', {
          id: sample._id,
          orderNumber: sample.orderNumber,
          customerName: sample.userId?.name,
          totalAmount: sample.totalAmount,
          status: sample.orderStatus
        });
      }
    }

    console.log('\n✅ Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

console.log('⚠️  Note: Update the adminToken variable with a real admin token');
console.log('   You can get this by logging into the admin panel and checking localStorage.getItem("adminToken")');

testEmployeeManagement();
