# BFS Green & Clean Services - Backend Documentation

## Overview
Complete backend implementation for Bubble Flash Services' Green & Clean home services platform. Includes booking management, payment processing, provider assignment, and admin dashboard.

## Architecture

### Tech Stack
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Payment**: Razorpay
- **Geocoding**: Nominatim (OpenStreetMap)
- **Notifications**: Telegram Bot API

### Database Models

#### 1. Branch
Stores service center locations across Bangalore.
```javascript
{
  name: String,
  lat: Number,
  lng: Number,
  address: String,
  city: String,
  phone: String,
  isActive: Boolean,
  operatingHours: { open, close }
}
```

#### 2. GreenService
Catalog of cleaning services offered.
```javascript
{
  category: Enum['home-cleaning', 'sofa-carpet', 'bathroom-kitchen', 'office-cleaning'],
  title: String,
  description: String,
  durationMinutes: Number,
  basePrice: Number,
  extras: [{ name, price }],
  active: Boolean,
  images: [String],
  features: [String]
}
```

#### 3. Provider
Service providers/cleaners.
```javascript
{
  name: String,
  phone: String (unique),
  email: String,
  lat: Number,
  lng: Number,
  verified: Boolean,
  servicesOffered: [ObjectId],
  available: Boolean,
  rating: Number,
  totalBookings: Number,
  branchId: ObjectId
}
```

#### 4. GreenBooking
Customer bookings.
```javascript
{
  bookingNumber: String (auto: BFSG00001),
  user: { name, phone, userId },
  serviceId: ObjectId,
  serviceName: String,
  serviceCategory: String,
  branchId: ObjectId,
  providerId: ObjectId,
  address: { full, lat, lng, pincode, city },
  distanceKm: Number,
  distanceCharge: Number,
  basePrice: Number,
  totalAmount: Number,
  status: Enum['created', 'assigned', 'in_progress', 'completed', 'cancelled'],
  scheduledAt: Date,
  payment: {
    method: Enum['razorpay', 'cash', 'upi'],
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: Enum['pending', 'paid', 'failed']
  },
  beforeImages: [String],
  afterImages: [String],
  notes: String
}
```

## API Endpoints

### Services
```
GET    /api/green/services              # Get all services
GET    /api/green/services?category=X   # Filter by category
GET    /api/green/services/:id          # Get single service
POST   /api/green/services              # Create service (Admin)
PUT    /api/green/services/:id          # Update service (Admin)
DELETE /api/green/services/:id          # Delete service (Admin)
```

### Bookings
```
POST   /api/green/booking               # Create booking + Razorpay order
POST   /api/green/booking/:id/pay       # Verify payment
GET    /api/green/booking/:id           # Get booking details
GET    /api/green/booking/phone/:phone  # Get user's bookings
PUT    /api/green/booking/:id/status    # Update status (Admin)
```

### Providers
```
GET    /api/green/providers/nearby      # Find nearby providers
POST   /api/green/providers/:id/accept  # Accept assignment
PUT    /api/green/providers/:id/status  # Update availability
GET    /api/green/providers             # Get all (Admin)
POST   /api/green/providers             # Create provider (Admin)
```

### Admin
```
GET    /api/green/admin/bookings        # Get all bookings
POST   /api/green/admin/assign          # Manual provider assignment
GET    /api/green/admin/stats           # Dashboard statistics
GET    /api/green/admin/branches        # Get all branches
POST   /api/green/admin/branches        # Create branch
PUT    /api/green/admin/branches/:id    # Update branch
```

## Business Logic

### Distance Calculation (Haversine Formula)
```javascript
distanceKm = calculateDistance(lat1, lng1, lat2, lng2)
```

### Distance Charges
```
≤ 5 km      → ₹0
> 5-10 km   → ₹50
> 10-15 km  → ₹100
> 15 km     → ₹100 (Bangalore only), else Not Available
```

### Provider Assignment
1. **Auto-assignment**: Find nearest available provider
   - Filter by service offered
   - Filter by availability & verification
   - Calculate distance from customer
   - Assign nearest provider

2. **Manual assignment**: Admin can override
   - Select provider from available list
   - Update booking status to 'assigned'

### Booking Flow
1. Customer submits booking → Geocode address
2. Find nearest branch → Calculate distance
3. Validate service availability
4. Calculate total amount (base + distance charge)
5. Create Razorpay order
6. Customer pays → Verify signature
7. Auto-assign provider (or queue for manual assignment)
8. Send Telegram notification to admin
9. Provider accepts → Status: in_progress
10. Provider completes → Upload before/after images
11. Mark completed → Customer notification

## Payment Integration (Razorpay)

### Create Order
```javascript
const razorpayOrder = await razorpay.orders.create({
  amount: totalAmount * 100, // paise
  currency: 'INR',
  receipt: bookingNumber,
  notes: { bookingId, service }
});
```

### Verify Payment
```javascript
const signature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(`${orderId}|${paymentId}`)
  .digest('hex');

if (signature === razorpay_signature) {
  // Payment verified
}
```

## Telegram Notifications

### New Booking
```
🆕 New Green & Clean Booking
📋 Booking: #BFSG00123
👤 Customer: John Doe
📱 Phone: +919999999999
🧹 Service: 2BHK Deep Clean
💰 Amount: ₹1099 (Base: ₹999 + Distance: ₹100)
📍 Address: Koramangala, 560034
📏 Distance: 7.2 km from Koramangala Branch
📅 Scheduled: Today 3:00 PM
```

### Payment Confirmed
```
✅ Payment Confirmed
📋 Booking: #BFSG00123
💳 Payment ID: pay_xxxxx
💰 Amount: ₹1099
👷 Assigned to: Rajesh Kumar
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables
Create `.env` file:
```env
MONGO_URI=mongodb://...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ADMIN_CHAT_IDS=123456789,987654321
JWT_SECRET=...
PORT=5000
```

### 3. Seed Database
```bash
node seedGreenClean.js
```
This creates:
- 5 Branches (Koramangala, Indiranagar, Whitefield, Jayanagar, HSR)
- 12 Services (3 packages × 4 categories)
- 3 Sample providers

### 4. Start Server
```bash
npm start
```

### 5. Test Endpoints
```bash
# Get services
curl http://localhost:5000/api/green/services

# Create booking
curl -X POST http://localhost:5000/api/green/booking \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "2BHK Deep Clean",
    "serviceId": "...",
    "userName": "Test User",
    "userPhone": "+919999999999",
    "address": "123 Main St, Koramangala",
    "pincode": "560034",
    "basePrice": 999
  }'
```

## Service Utilities

### geocodeService.js
- `geocodeAddress(address)` - Get coordinates from address
- `reverseGeocode(lat, lng)` - Get address from coordinates
- `getPincodeCoordinates(pincode)` - Get location from pincode

### distanceService.js
- `calculateDistance(lat1, lng1, lat2, lng2)` - Haversine distance
- `calculateDistanceCharge(distanceKm, isInsideBangalore)` - Pricing
- `findNearestBranch(branches, lat, lng)` - Find closest branch
- `isInsideBangalore(pincode)` - Validate Bangalore pincode
- `validateServiceAvailability(distanceKm, pincode)` - Check if serviceable

### assignmentService.js
- `findNearestProvider(serviceId, lat, lng, branchId)` - Find provider
- `autoAssignProvider(booking)` - Auto-assign to nearest
- `manualAssignProvider(bookingId, providerId)` - Admin assignment

## Error Handling

All controllers return consistent JSON:
```javascript
{
  success: Boolean,
  message: String,
  data: Object,
  error: String (dev only)
}
```

## Security

- Admin routes protected with `authenticateAdmin` middleware
- Payment signature verification prevents tampering
- Input validation on all endpoints
- Mongoose schema validation
- Environment secrets in `.env`

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use live Razorpay keys
- [ ] Configure Telegram bot
- [ ] Set up MongoDB Atlas with proper indexing
- [ ] Enable CORS for production domain
- [ ] Set secure cookies (`secure: true`)
- [ ] Add rate limiting
- [ ] Set up logging (Winston/Morgan)
- [ ] Configure backup strategy
- [ ] Set up monitoring (uptime, errors)

## Testing

### Manual Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Get services
curl http://localhost:5000/api/green/services

# Get stats (requires admin auth)
curl http://localhost:5000/api/green/admin/stats \
  -H "Cookie: connect.sid=..."
```

### Integration Tests
Create test files for:
- Booking creation flow
- Payment verification
- Provider assignment
- Distance calculation
- Geocoding service

## Support

For issues or questions:
- Backend: Check server logs
- Database: Use MongoDB Compass
- Payments: Check Razorpay dashboard
- Notifications: Test Telegram bot directly

---

**Version**: 1.0.0  
**Last Updated**: October 2025
