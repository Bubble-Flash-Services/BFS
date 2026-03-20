# Movers & Packers Service - Rebuild Prompt

Rebuild this service as a standalone full-stack web application.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Styling**: Tailwind CSS + custom CSS

## Service Overview
Bubble Flash Movers & Packers - A relocation service platform offering:
- Within-city home shifting (1BHK to Villa)
- Inter-city home shifting
- Vehicle shifting (Car, Bike, Scooter)
- Real-time price estimation

## Requirements

### Frontend Features
1. **Service Selection** - Choose move type (within-city/inter-city) and property size
2. **Dynamic Pricing Calculator** - Real-time price estimation based on selections
3. **Vehicle Shifting Option** - Add vehicle shifting to booking
4. **Date & Time Scheduling** - Pick move date and time
5. **Address Collection** - Pickup and delivery addresses
6. **Special Instructions** - Additional notes for movers
7. **Booking Confirmation** - Summary before submission
8. **Order Tracking** - Status tracking post-booking
9. **Responsive Design** - Mobile-first

### Admin Panel Features
1. **Booking Management** - View, filter, search all moving bookings
2. **Employee Assignment** - Assign moving teams
3. **Status Tracking** - Update booking status
4. **Admin Notes** - Internal notes on bookings
5. **Search Functionality** - Find by order ID, phone, address
6. **Pagination** - Handle large booking lists

### Backend APIs
- `POST /api/movers-packers/booking` - Create new booking
- `GET /api/movers-packers/price` - Get price estimate
- `GET /api/admin/movers-packers/bookings` - Admin: list all bookings (with filters)
- `PUT /api/admin/movers-packers/bookings/:id/status` - Update status
- `PUT /api/admin/movers-packers/bookings/:id/assign` - Assign employee
- `PUT /api/admin/movers-packers/bookings/:id/note` - Add admin note

### Database Model (MoversPackers)
- userId, name, phone, email
- moveType: within-city | inter-city
- propertyType: 1BHK | 2BHK | 3BHK | 4BHK | Villa
- pickupAddress, deliveryAddress
- moveDate, moveTime
- vehicleShifting: boolean
- vehicleType: Car | Bike | Scooter | Others
- totalPrice (auto-calculated)
- status: pending | confirmed | assigned | in_progress | completed | cancelled
- assignedEmployee, adminNote, specialInstructions

### Pricing Structure
**Within-City Moving:**
- 1BHK: ₹3,500
- 2BHK: ₹5,500
- 3BHK: ₹7,500
- 4BHK: ₹10,000
- Villa: ₹15,000

**Inter-City Moving:**
- 1BHK: ₹8,000
- 2BHK: ₹12,000
- 3BHK: ₹16,000
- 4BHK: ₹22,000
- Villa: ₹35,000

**Vehicle Shifting (Within-City):**
- Car: ₹1,500
- Bike: ₹800
- Scooter: ₹700
- Others: ₹1,000

**Vehicle Shifting (Inter-City):**
- Car: ₹4,000
- Bike: ₹2,000
- Scooter: ₹1,800
- Others: ₹2,500

### Folder Structure
```
movers-packers/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── MoversPackersPage.jsx (main booking page)
│   │   │   └── admin/MoversPackersManagement.jsx
│   │   └── components/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── routes/
    │   ├── moversPackers.js
    │   └── moversPackersAdmin.js
    ├── models/
    │   └── MoversPackers.js
    ├── app.js
    └── package.json
```

### Environment Variables
```env
MONGO_URI=mongodb://...
JWT_SECRET=your_jwt_secret
PORT=5000
VITE_API_URL=http://localhost:5000
```

## Expected Output
Fully working standalone Movers & Packers service website with dynamic pricing calculator, complete booking flow, admin panel, and all move type options.
