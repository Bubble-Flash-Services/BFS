# Green & Clean Service - Rebuild Prompt

Rebuild this service as a standalone full-stack web application.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Payment**: Razorpay integration
- **Styling**: Tailwind CSS + custom CSS

## Service Overview
Green & Clean - A professional home and office cleaning service platform offering:
- Instant cleaning services (1BHK, 2BHK, 3BHK)
- Deep cleaning services (Kitchen, Bathroom, Windows, Carpet, Sofa)
- Commercial cleaning (Office, Retail, Post-Construction)

## Requirements

### Frontend Features
1. **Hero Section** - Service banner with key selling points
2. **Services Grid** - Browse instant and deep clean options by category
3. **Deep Clean Section** - Detailed deep cleaning service breakdown
4. **Category Modal** - Filter services by category (Instant/Deep Clean/Commercial)
5. **Why Choose Us Section** - Value propositions
6. **Call-to-Action Section** - Contact/booking prompts
7. **Service Detail Page** - Individual service details and booking
8. **Category Browsing** - Filter services by category
9. **Cart System** - Isolated cart for green&clean (separate from main cart)
10. **Checkout Flow** - Address, schedule, provider selection

### Admin Panel Features
1. **Booking Management** - View all bookings (from GreenBooking + Order models)
2. **Provider Assignment** - Assign cleaning providers/staff
3. **Status Management** - Track booking progression
4. **Payment Tracking** - Monitor payment status
5. **Search & Filter** - Find bookings by customer, date, status

### Backend APIs
- `GET /api/green/services` - List all green services
- `POST /api/green/services` - Create new service (admin)
- `GET /api/green/booking` - List bookings
- `POST /api/green/booking` - Create booking
- `PUT /api/green/booking/:id` - Update booking
- `GET /api/green/providers` - List providers
- `POST /api/green/providers` - Add provider
- `GET /api/green/admin/bookings` - Admin booking list with filters
- `PUT /api/green/admin/bookings/:id/assign` - Assign provider

### Database Models
**GreenService Model**:
- title, description, price, duration, category
- features (array), isActive

**GreenBooking Model**:
- userId, serviceId, providerId
- status: pending | confirmed | assigned | in_progress | completed | cancelled
- scheduledDate, scheduledTime, address
- totalAmount, paymentStatus, adminNote

**Provider Model**:
- name, phone, email, specializations
- availability, rating, completedJobs

### Service Pricing (Instant)
- 1BHK Basic Clean: ₹599 (120 min)
- 2BHK Deep Clean: ₹999 (180 min)  
- 3BHK Premium Clean: ₹1,499 (240 min)

### Service Pricing (Deep Clean)
- Kitchen Deep Cleaning: Variable pricing
- Bathroom Deep Cleaning: Variable pricing
- Window Cleaning: Variable pricing
- Carpet Cleaning: Variable pricing
- Sofa Cleaning: Variable pricing

### Folder Structure
```
green-clean-service/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── green&clean/
│   │   │   │   ├── Green&Clean.jsx (main page)
│   │   │   │   ├── ServicePage.jsx
│   │   │   │   └── ServiceByCategory.jsx
│   │   │   ├── GreenCleanCart.jsx
│   │   │   └── admin/GreenCleanManagement.jsx
│   │   ├── components/
│   │   │   └── green&clean/
│   │   │       ├── HeroSection.jsx
│   │   │       ├── ServicesSection.jsx
│   │   │       ├── DeepCleanSection.jsx
│   │   │       ├── CategoryModal.jsx
│   │   │       ├── CTASection.jsx
│   │   │       └── WhyChooseUs.jsx
│   │   └── data/
│   │       └── services.json
│   ├── public/
│   │   ├── clean-home.jpg
│   │   └── cleaning-bg.jpg
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── routes/
    │   ├── greenServices.js
    │   ├── greenBookings.js
    │   ├── greenProviders.js
    │   ├── greenAdmin.js
    │   └── cart-clean.js
    ├── controllers/
    │   ├── greenServiceController.js
    │   ├── greenBookingController.js
    │   ├── greenProviderController.js
    │   └── greenAdminController.js
    ├── models/
    │   ├── GreenService.js
    │   ├── GreenBooking.js
    │   └── Provider.js
    ├── seedGreenClean.js
    ├── seedGreenFull.js
    ├── app.js
    └── package.json
```

### Assets
- `/assets/clean-home.jpg` - Main hero/service image
- `/assets/cleaning-bg.jpg` - Background image

### Cart System
Uses a dedicated CartProviderForGreenandClean context (separate from the main app cart) to support multi-service cart management. Replicate the CartContext pattern.

### Environment Variables
```env
MONGO_URI=mongodb://...
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
PORT=5000
VITE_API_URL=http://localhost:5000
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## Expected Output
Fully working standalone Green & Clean service website with complete booking flow, provider management, admin panel, and all service categories.
