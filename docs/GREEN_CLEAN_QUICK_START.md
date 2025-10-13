# Green & Clean Services - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Seed the Database
```bash
cd server
node seedGreenClean.js
```

### 2. Start the Server
```bash
npm start
```

### 3. Test the API
Visit: `http://localhost:5000/api/green/services`

## 📋 What's Been Created

### ✅ Backend Structure
- **4 Models**: Branch, GreenService, Provider, GreenBooking
- **4 Controllers**: greenService, greenBooking, greenProvider, greenAdmin
- **4 Routes**: /api/green/services, /booking, /providers, /admin
- **3 Services**: distance, geocode, assignment
- **1 Seed Script**: Creates 5 branches, 12 services, 3 providers

### ✅ Frontend Integration
- **API Client**: `src/api/greenClean.js`
- **Updated Page**: `src/pages/Green&clean.jsx` with real API calls
- **Razorpay**: Integrated payment gateway

## 🎯 Key Features Implemented

### 1. Distance Calculation
- Haversine formula for accurate distance
- Auto-find nearest branch
- Smart distance-based pricing
- Bangalore pincode validation

### 2. Razorpay Payment
- Create order on booking
- Frontend payment modal
- Server-side signature verification
- Webhook support ready

### 3. Provider Assignment
- Auto-assign nearest available provider
- Manual admin override
- Provider availability tracking
- Performance metrics

### 4. Telegram Notifications
- New booking alerts
- Payment confirmations
- Provider assignments
- Status updates

## 📦 Sample Data Created

### Branches (5)
1. Koramangala (12.9352, 77.6245)
2. Indiranagar (12.9784, 77.6408)
3. Whitefield (12.9698, 77.7499)
4. Jayanagar (12.9250, 77.5838)
5. HSR Layout (12.9116, 77.6473)

### Services (12)
**Home Cleaning**
- 1BHK Basic Clean - ₹599
- 2BHK Deep Clean - ₹999
- 3BHK Premium Clean - ₹1499

**Sofa & Carpet**
- 3-Seater Sofa - ₹499
- Carpet Small - ₹699
- Sofa + Carpet Combo - ₹999

**Bathroom & Kitchen**
- Bathroom Deep Clean - ₹399
- Kitchen Deep Clean - ₹599
- Kitchen + Bathroom - ₹899

**Office Cleaning**
- Small Office (500 sq ft) - ₹799
- Medium Office (1000 sq ft) - ₹1299
- Large Office (2000+ sq ft) - ₹2499

### Providers (3)
1. Rajesh Kumar (Home Cleaning specialist)
2. Priya Sharma (Sofa & Carpet expert)
3. Suresh Reddy (Kitchen & Bathroom specialist)

## 🔧 API Endpoints Reference

### Public Endpoints
```bash
# Get all services
GET /api/green/services

# Get services by category
GET /api/green/services?category=home-cleaning

# Create booking
POST /api/green/booking
{
  "serviceName": "2BHK Deep Clean",
  "serviceId": "...",
  "userName": "John Doe",
  "userPhone": "+919999999999",
  "address": "123 Main St, Koramangala",
  "pincode": "560034",
  "basePrice": 999
}

# Verify payment
POST /api/green/booking/:id/pay
{
  "razorpay_order_id": "...",
  "razorpay_payment_id": "...",
  "razorpay_signature": "..."
}

# Get booking
GET /api/green/booking/:id

# Get user bookings
GET /api/green/booking/phone/+919999999999
```

### Admin Endpoints (Require Auth)
```bash
# Get all bookings
GET /api/green/admin/bookings

# Get dashboard stats
GET /api/green/admin/stats

# Manual provider assignment
POST /api/green/admin/assign
{
  "bookingId": "...",
  "providerId": "..."
}

# Get branches
GET /api/green/admin/branches

# Create branch
POST /api/green/admin/branches
{
  "name": "New Branch",
  "lat": 12.9716,
  "lng": 77.5946,
  "address": "MG Road, Bengaluru",
  "city": "Bengaluru",
  "phone": "+919591572780"
}
```

## 🎨 Frontend Usage

### Book a Service
```javascript
import { greenAPI } from '../api/greenClean';

// 1. Load services
const services = await greenAPI.getServices();

// 2. Create booking
const booking = await greenAPI.createBooking({
  serviceName: "2BHK Deep Clean",
  serviceId: serviceId,
  userName: "John Doe",
  userPhone: "+919999999999",
  address: "123 Street, Koramangala",
  pincode: "560034",
  basePrice: 999
});

// 3. Open Razorpay
const razorpay = new Razorpay({
  key: booking.data.razorpay.key,
  order_id: booking.data.razorpay.orderId,
  handler: async (response) => {
    // 4. Verify payment
    await greenAPI.verifyPayment(
      booking.data.booking.id,
      response
    );
  }
});
razorpay.open();
```

## 💡 Testing Tips

### Test Booking Flow
1. Visit `http://localhost:3000/green&clean`
2. Click on any service category
3. Select a package
4. Fill booking form with:
   - Name: Test User
   - Phone: +919999999999
   - Address: 100 Feet Road, Indiranagar
   - Pincode: 560038
5. Click "Confirm Booking"
6. Use Razorpay test cards:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date

### Check Database
```javascript
// In MongoDB Compass or CLI
use bubble-flash

// View bookings
db.greenbookings.find().pretty()

// View branches
db.branches.find().pretty()

// View services
db.greenservices.find().pretty()

// View providers
db.providers.find().pretty()
```

### Monitor Logs
```bash
# Server logs show:
- New booking creation
- Geocoding results
- Distance calculations
- Payment verifications
- Provider assignments
- Telegram notifications
```

## 🔐 Environment Setup

### Required Variables
```env
# Database
MONGO_URI=mongodb+srv://...

# Razorpay (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Telegram (Optional - Get from @BotFather)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_ADMIN_CHAT_IDS=123456789

# Server
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

## 📊 Admin Dashboard (Coming Soon)

Features to implement:
- [ ] Real-time booking dashboard
- [ ] Provider management panel
- [ ] Service catalog editor
- [ ] Revenue analytics
- [ ] Customer management
- [ ] Branch performance metrics

## 🐛 Troubleshooting

### Issue: "Service not available"
**Solution**: Check if pincode is in Bangalore range (560001-560107)

### Issue: "No branches found"
**Solution**: Run `node seedGreenClean.js` to create branches

### Issue: "Geocoding failed"
**Solution**: Ensure internet connection for Nominatim API

### Issue: "Payment verification failed"
**Solution**: Check RAZORPAY_KEY_SECRET in .env

### Issue: "Provider assignment failed"
**Solution**: Create providers or enable manual assignment

## 📞 Support

- **Backend Issues**: Check `server/GREEN_CLEAN_BACKEND.md`
- **API Testing**: Use Postman collection (create one!)
- **Database**: MongoDB Compass for visual inspection
- **Payments**: Razorpay dashboard for transaction logs

## 🎉 Next Steps

1. ✅ Backend fully functional
2. ✅ Frontend integrated
3. ✅ Payment gateway live
4. 🔲 Create admin dashboard
5. 🔲 Build provider mobile app
6. 🔲 Add SMS notifications
7. 🔲 Implement rating system
8. 🔲 Add promotional coupons
9. 🔲 Enable subscription plans
10. 🔲 Deploy to production

---

**Happy Coding! 🚀**
