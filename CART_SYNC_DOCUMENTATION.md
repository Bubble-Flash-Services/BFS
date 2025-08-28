# Cart Synchronization System

## Overview

The cart synchronization system allows users to maintain their shopping cart data across sessions and devices by storing cart information in both localStorage (for immediate access) and the database (for persistence).

## Features

✅ **Automatic Sync on Login**: When a user logs in, any localStorage cart data is automatically synced to the database
✅ **Real-time Operations**: All cart operations (add, remove, update) are performed on both localStorage and database
✅ **Offline Support**: Cart works offline using localStorage, syncs when connection is restored
✅ **Cross-device Consistency**: Cart data follows the user across different devices
✅ **Guest Cart Migration**: Guest cart items are migrated to user account upon login

## Architecture

### Frontend (React)
- **CartContext.jsx**: Main cart state management with sync capabilities
- **Local Storage**: Immediate cart persistence for quick access
- **API Integration**: Real-time sync with backend database

### Backend (Node.js/Express)
- **Cart Model**: MongoDB schema for persistent cart storage
- **Cart Controller**: CRUD operations and sync logic
- **Cart Routes**: API endpoints for cart management

## API Endpoints

### `/api/cart` (GET)
Get user's cart from database
```javascript
Response: {
  success: true,
  data: {
    items: [...],
    totalAmount: 0,
    totalItems: 0
  }
}
```

### `/api/cart` (POST)
Add item to cart
```javascript
Request: {
  serviceId: "68af4f7c...",
  packageId: "68af4f7c...",
  quantity: 1,
  price: 199,
  vehicleType: "sedan",
  addOns: [],
  specialInstructions: ""
}
```

### `/api/cart/sync` (POST)
Sync localStorage cart to database
```javascript
Request: {
  items: [
    {
      id: "item_id",
      serviceId: "service_id",
      quantity: 1,
      price: 199,
      // ... other item data
    }
  ]
}
```

### `/api/cart/:itemId` (PUT)
Update cart item
```javascript
Request: {
  quantity: 2,
  specialInstructions: "Updated instructions"
}
```

### `/api/cart/:itemId` (DELETE)
Remove item from cart

### `/api/cart` (DELETE)
Clear entire cart

## Usage Examples

### Frontend Cart Operations

```javascript
import { useCart } from './components/CartContext';

function MyComponent() {
  const { cartItems, addToCart, removeFromCart, syncCartToDatabase } = useCart();

  // Add item to cart (automatically syncs to database if user is logged in)
  const handleAddToCart = () => {
    addToCart({
      id: 'service_id',
      serviceId: 'service_id',
      name: 'Car Wash',
      price: 199,
      quantity: 1
    });
  };

  // Manual sync (usually not needed as it's automatic)
  const handleSync = () => {
    syncCartToDatabase();
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handleSync}>Sync Cart</button>
      <p>Cart Items: {cartItems.length}</p>
    </div>
  );
}
```

### Backend Testing

```javascript
// Test cart sync endpoint
const response = await fetch('/api/cart/sync', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    items: [
      {
        id: 'item1',
        serviceId: 'service_id',
        quantity: 1,
        price: 199
      }
    ]
  })
});
```

## Data Flow

1. **Guest User**: Cart stored only in localStorage
2. **User Login**: localStorage cart automatically synced to database
3. **Logged-in User Operations**: Real-time sync between localStorage and database
4. **Cross-device Access**: Cart data loaded from database on new device login

## Benefits

1. **User Experience**: Seamless cart persistence across sessions
2. **Performance**: Local storage provides instant cart access
3. **Reliability**: Database backup ensures data persistence
4. **Scalability**: Efficient sync operations minimize server load
5. **Flexibility**: Works for both guest and registered users

## Testing

### Backend Test
```bash
cd server
node test-cart-sync.js
```

### Frontend Test
Copy the contents of `test-cart-sync-browser.js` and run in browser console on the website.

## Implementation Status

✅ **Backend API**: All cart endpoints implemented and tested
✅ **Database Model**: Cart schema with user relationships
✅ **Frontend Integration**: CartContext with sync capabilities  
✅ **Automatic Sync**: Login triggers localStorage to database sync
✅ **Real-time Operations**: All cart operations sync to database
✅ **Error Handling**: Fallback to localStorage on API failures

The cart synchronization system is fully operational and ready for production use!
