const fetch = require('node-fetch');

async function testUserOrders() {
  try {
    console.log('🧪 Testing User Orders API...\n');

    // First, try to get a user token (you'll need to update this with a real token)
    const testToken = 'your_test_token_here';
    
    console.log('📋 Fetching user orders...');
    const response = await fetch('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ User orders API working correctly!');
      console.log(`📦 Found ${result.data.orders.length} orders`);
      
      if (result.data.orders.length > 0) {
        console.log('📋 Sample order structure:');
        const sampleOrder = result.data.orders[0];
        console.log({
          orderId: sampleOrder._id,
          orderNumber: sampleOrder.orderNumber,
          status: sampleOrder.orderStatus,
          totalAmount: sampleOrder.totalAmount,
          createdAt: sampleOrder.createdAt,
          itemsCount: sampleOrder.items?.length || 0
        });
      }
    } else {
      console.log('❌ Orders API failed:', result.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Note: You'll need to replace 'your_test_token_here' with a real user token
// You can get this by logging into the frontend and checking localStorage
console.log('⚠️  Note: Update the testToken variable with a real user token from localStorage');
console.log('   You can get this by logging into the frontend and running: localStorage.getItem("token")');

testUserOrders();
