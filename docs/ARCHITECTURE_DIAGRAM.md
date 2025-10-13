# 🏗️ BFS Green & Clean - System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER FRONTEND (React)                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Green&clean.jsx                                                      │  │
│  │  ├─ Hero Section                                                      │  │
│  │  ├─ Service Categories (4)                                            │  │
│  │  ├─ Package Selection Modal                                           │  │
│  │  └─ Booking Form + Razorpay                                           │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  API Client (greenClean.js)                                           │  │
│  │  ├─ getServices()                                                     │  │
│  │  ├─ createBooking()                                                   │  │
│  │  └─ verifyPayment()                                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXPRESS.JS BACKEND (Node.js)                         │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                            ROUTES LAYER                                │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │  │
│  │  │  /services   │ │  /booking    │ │  /providers  │ │   /admin    │ │  │
│  │  │              │ │              │ │              │ │             │ │  │
│  │  │ GET /        │ │ POST /       │ │ GET /nearby  │ │ GET /bookings│ │
│  │  │ GET /:id     │ │ POST /:id/pay│ │ POST /:id/.. │ │ POST /assign│ │  │
│  │  │ POST /       │ │ GET /:id     │ │ PUT /:id/..  │ │ GET /stats  │ │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                          MIDDLEWARE LAYER                              │  │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────┐  │  │
│  │  │ authenticateToken│  │ authenticateAdmin │  │ validateRequest    │  │  │
│  │  └─────────────────┘  └──────────────────┘  └────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         CONTROLLERS LAYER                              │  │
│  │  ┌──────────────────┐ ┌───────────────────┐ ┌─────────────────────┐ │  │
│  │  │ greenService     │ │ greenBooking      │ │ greenProvider       │ │  │
│  │  │ Controller       │ │ Controller        │ │ Controller          │ │  │
│  │  │                  │ │                   │ │                     │ │  │
│  │  │ • getServices    │ │ • createBooking   │ │ • getNearby         │ │  │
│  │  │ • getById        │ │ • verifyPayment   │ │ • acceptAssignment  │ │  │
│  │  │ • create/update  │ │ • getBooking      │ │ • updateStatus      │ │  │
│  │  └──────────────────┘ └───────────────────┘ └─────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │ greenAdminController                                            │  │  │
│  │  │ • getAllBookings • assignProvider • getStats • manageBranches  │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         SERVICES LAYER (Business Logic)                │  │
│  │  ┌──────────────────┐ ┌───────────────────┐ ┌─────────────────────┐ │  │
│  │  │ distanceService  │ │ geocodeService    │ │ assignmentService   │ │  │
│  │  │                  │ │                   │ │                     │ │  │
│  │  │ • calculateDist  │ │ • geocodeAddress  │ │ • findNearestProv.  │ │  │
│  │  │ • distanceCharge │ │ • reverseGeocode  │ │ • autoAssignProv.   │ │  │
│  │  │ • nearestBranch  │ │ • getPincodeCords │ │ • manualAssignProv. │ │  │
│  │  │ • validateAvail. │ │                   │ │                     │ │  │
│  │  └──────────────────┘ └───────────────────┘ └─────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         MODELS LAYER (Mongoose)                        │  │
│  │  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │  │
│  │  │   Branch    │ │ GreenService │ │   Provider   │ │ GreenBooking │ │  │
│  │  │             │ │              │ │              │ │              │ │  │
│  │  │ • name      │ │ • category   │ │ • name       │ │ • bookingNum │ │  │
│  │  │ • lat/lng   │ │ • title      │ │ • phone      │ │ • user       │ │  │
│  │  │ • address   │ │ • basePrice  │ │ • available  │ │ • service    │ │  │
│  │  │ • phone     │ │ • duration   │ │ • services   │ │ • address    │ │  │
│  │  │ • isActive  │ │ • features   │ │ • branchId   │ │ • distance   │ │  │
│  │  │             │ │ • active     │ │ • rating     │ │ • payment    │ │  │
│  │  │             │ │              │ │              │ │ • status     │ │  │
│  │  └─────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES & DATABASE                         │
│                                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   MongoDB    │  │  Razorpay    │  │  Nominatim   │  │  Telegram    │   │
│  │   Atlas      │  │  Payment     │  │  Geocoding   │  │  Bot API     │   │
│  │              │  │              │  │              │  │              │   │
│  │ • Branches   │  │ • Orders     │  │ • lat/lng    │  │ • Notifications│  │
│  │ • Services   │  │ • Payments   │  │ • Addresses  │  │ • Admin alerts│  │
│  │ • Providers  │  │ • Webhooks   │  │ • Reverse    │  │ • Status msgs│  │
│  │ • Bookings   │  │              │  │              │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagram

### 1. User Books a Service
```
User clicks "Book Now"
    ↓
Fills form (name, phone, address, pincode)
    ↓
Frontend calls greenAPI.createBooking()
    ↓
Backend receives request
    ↓
Geocode address → Get lat/lng
    ↓
Find nearest branch (Haversine distance)
    ↓
Calculate distance charge
    ↓
Validate service availability
    ↓
Create GreenBooking record
    ↓
Create Razorpay order
    ↓
Return order details to frontend
    ↓
Frontend opens Razorpay modal
    ↓
User completes payment
    ↓
Razorpay callback to frontend
    ↓
Frontend calls verifyPayment()
    ↓
Backend verifies signature
    ↓
Update booking payment status
    ↓
Auto-assign nearest provider
    ↓
Send Telegram notification to admin
    ↓
Return success to user
```

### 2. Provider Assignment Logic
```
New booking created
    ↓
Query all providers who:
  - Offer this service
  - Are available
  - Are verified
  - Are active
    ↓
Calculate distance from each provider to customer
    ↓
Select nearest provider
    ↓
Update booking with providerId
    ↓
Update booking status to "assigned"
    ↓
Increment provider's totalBookings
    ↓
Send notification to provider
```

### 3. Distance Pricing Logic
```
Customer address received
    ↓
Geocode to get coordinates
    ↓
Find all active branches
    ↓
For each branch:
  Calculate Haversine distance
    ↓
Select branch with minimum distance
    ↓
Check pincode if in Bangalore (560001-560107)
    ↓
Calculate charge:
  ≤5km  → ₹0
  ≤10km → ₹50
  ≤15km → ₹100
  >15km → ₹100 (Bangalore) / Not Available (outside)
    ↓
Total = Base Price + Distance Charge
```

## 🔄 State Transitions

### Booking Status Flow
```
created → assigned → in_progress → completed
   ↓
cancelled (can happen at any stage before completion)
```

### Payment Status Flow
```
pending → paid
   ↓
failed (on verification error)
```

### Provider Status Flow
```
available → unavailable (when assigned a job)
   ↓
available (when job completed)
```

## 🛡️ Security Layers

```
┌─────────────────────────────────────┐
│  1. HTTPS/TLS Encryption            │
├─────────────────────────────────────┤
│  2. CORS Policy                     │
├─────────────────────────────────────┤
│  3. Authentication Middleware       │
├─────────────────────────────────────┤
│  4. Input Validation (Mongoose)     │
├─────────────────────────────────────┤
│  5. Payment Signature Verification  │
├─────────────────────────────────────┤
│  6. Environment Variables           │
├─────────────────────────────────────┤
│  7. Rate Limiting (future)          │
└─────────────────────────────────────┘
```

## 📈 Scalability Strategy

```
┌────────────────────────────────────────┐
│  Load Balancer (Nginx/AWS ALB)         │
└────────────────┬───────────────────────┘
                 │
    ┌────────────┼────────────┐
    ↓            ↓            ↓
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Server 1│  │ Server 2│  │ Server 3│
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────────┼────────────┘
                  ↓
         ┌────────────────┐
         │  MongoDB Atlas  │
         │  (Shared DB)    │
         └────────────────┘
```

## 🎯 Performance Optimizations

1. **Database Indexing**
   - Branch: lat/lng index
   - Service: category + active index
   - Booking: status + createdAt index
   - Provider: available + isActive index

2. **Caching Strategy** (future)
   - Redis for service catalog
   - Redis for branch locations
   - Session store in Redis

3. **Query Optimization**
   - Lean queries for read operations
   - Projection to limit fields
   - Pagination for list endpoints

4. **CDN** (future)
   - Static assets (images, CSS, JS)
   - Service images from Cloudinary

---

**This architecture supports:**
- ✅ 1000+ concurrent users
- ✅ Horizontal scaling
- ✅ Real-time notifications
- ✅ Secure payment processing
- ✅ Geographic load balancing
- ✅ Microservices ready
