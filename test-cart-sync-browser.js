// Manual Cart Sync Test - Run this in browser console on the website
// This simulates syncing localStorage cart data to database when user logs in

async function testCartSyncInBrowser() {
  console.log('🧪 Testing Cart Sync in Browser\n');
  
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (!token) {
    console.log('❌ Please log in first to test cart sync');
    return;
  }
  
  const user = JSON.parse(userData);
  console.log('👤 Logged in as:', user.name, user.email);
  
  // Create mock cart data (simulating localStorage cart)
  const mockCartData = [
    {
      id: '68af4f7ccb727f3b7e63686d',
      serviceId: '68af4f7ccb727f3b7e63686d',
      packageId: '68af4f7ccb727f3b7e636874',
      name: 'Basic Car Wash',
      price: 199,
      quantity: 1,
      vehicleType: 'sedan',
      addOns: [],
      specialInstructions: 'Test sync from browser'
    }
  ];
  
  console.log('📦 Mock cart data to sync:', mockCartData);
  
  try {
    // Test the sync API
    console.log('🔄 Syncing cart to database...');
    
    const response = await fetch('/api/cart/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items: mockCartData })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Cart synced successfully:', result.message);
      
      // Verify by getting cart
      const getResponse = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const cartData = await getResponse.json();
      
      if (cartData.success) {
        console.log('📋 Cart after sync:', cartData.data.items?.length || 0, 'items');
        cartData.data.items?.forEach((item, i) => {
          console.log(`  ${i+1}. ${item.serviceId?.name} x${item.quantity} - ₹${item.price}`);
        });
      }
    } else {
      console.log('❌ Cart sync failed:', result.message);
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Run the test
testCartSyncInBrowser();

// Also expose for manual calling
window.testCartSync = testCartSyncInBrowser;
