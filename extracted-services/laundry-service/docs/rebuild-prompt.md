# Laundry Service - Rebuild Prompt

Rebuild this service as a standalone full-stack web application.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Payment**: Razorpay integration
- **Styling**: Tailwind CSS + custom CSS

## Service Overview
Bubble Flash Services Laundry - A comprehensive laundry service platform offering:
- Men's & Women's wash
- Sarees & Rolling
- Kids clothing
- Blazers, Coats & Winter Wear
- Shoe Cleaning
- Home Linen
- Dry Cleaning
- Ironing

## Requirements

### Frontend Features
1. **Home/Landing Page** - Hero section with service highlights, pricing categories
2. **Category Browsing** - Browse by laundry type (wash & fold, dry clean, ironing, shoe clean, bedsheet)
3. **Item Selection** - Select items per category with quantity pickers and pricing
4. **Cart System** - Add/remove items, view total, apply coupons
5. **Checkout Flow** - Address selection, schedule pickup/delivery time
6. **Order Tracking** - Real-time status updates (pending → confirmed → assigned → in_progress → completed)
7. **Deals Page** - Category-specific offers and promotions (/laundry-deals/:category)
8. **Responsive Design** - Mobile-first approach

### Admin Panel Features
1. **Booking Management** - View, filter, search all laundry bookings
2. **Status Updates** - Update booking status (pending/confirmed/assigned/in_progress/completed/cancelled)
3. **Employee Assignment** - Assign staff to bookings
4. **Statistics Dashboard** - Revenue, booking counts by status
5. **Admin Notes** - Add notes to bookings

### Backend APIs
- `GET /api/admin/laundry/bookings` - Fetch all laundry bookings (with filters)
- `PUT /api/admin/laundry/bookings/:id/status` - Update booking status
- `PUT /api/admin/laundry/bookings/:id/assign` - Assign employee
- `POST /api/orders` - Create laundry order (uses Order model with laundry items)

### Database Models
**Order Model** (for laundry bookings):
- userId, items (array with name, category, price, quantity), totalAmount
- status: pending | confirmed | assigned | in_progress | completed | cancelled
- scheduledDate, pickupTime, deliveryTime
- address, adminNote, assignedEmployee

### Folder Structure
```
laundry-service/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LaundryPage.jsx (main service page)
│   │   │   ├── LaundryDeals.jsx (deals & pricing)
│   │   │   └── admin/LaundryManagement.jsx
│   │   ├── data/
│   │   │   └── laundryData.js (categories & items)
│   │   └── components/
│   ├── public/
│   │   └── laundry/ (all laundry images)
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── routes/
    │   └── laundryAdmin.js
    ├── models/
    │   └── Order.js
    ├── app.js
    └── package.json
```

### Assets
All images in `/assets/laundry/` folder including:
- Category item images (dry clean, shoe clean, wash & fold, bedsheet, ironing subcategories)
- Hero/banner images (laundry.gif, laundry1.png, laundry2.png, laundry3.png)
- Home thumbnail (home.png)

### Environment Variables
```env
MONGO_URI=mongodb://...
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
PORT=5000
VITE_API_URL=http://localhost:5000
```

## Expected Output
Fully working standalone laundry service website identical to original Bubble Flash Services implementation, with complete booking flow, admin panel, and all laundry categories.
