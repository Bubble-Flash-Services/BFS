# Movers & Packers Module

## Overview
The Movers & Packers module is a complete booking system integrated into the Bubble Flash Services platform. It allows customers to book professional relocation services with transparent pricing and comprehensive options.

## Features

### Customer Features
- **Move Type Selection**: Choose between Within City or Intercity moves
- **Home Size Options**: Select from 1BHK, 2BHK, 3BHK, 4BHK, or Villa
- **Address Input**: Google Maps autocomplete integration for accurate addresses
- **Vehicle Shifting**: Optional service to shift Car, Bike, Scooter, or other vehicles
- **Painting Services**: Add Interior Painting, Exterior Painting, or Wood Polishing
- **Real-time Price Quotes**: Instant price estimation based on selections
- **Moving Date Selection**: Calendar picker with validation
- **Booking Management**: View, track, and cancel bookings

### Admin Features
- **Booking Management**: View and manage all bookings
- **Status Updates**: Update booking status (pending, confirmed, in-progress, completed, cancelled)
- **Employee Assignment**: Assign employees to specific bookings
- **Statistics**: View booking stats and revenue
- **Search & Filter**: Search by phone, email, or address; filter by status

## API Endpoints

### Customer Endpoints

#### POST /api/movers-packers/booking
Create a new moving booking.
- **Authentication**: Required (Bearer token)
- **Body**:
  ```json
  {
    "moveType": "within-city" | "intercity",
    "homeSize": "1BHK" | "2BHK" | "3BHK" | "4BHK" | "Villa",
    "sourceCity": {
      "fullAddress": "string",
      "city": "string",
      "state": "string",
      "pincode": "string"
    },
    "destinationCity": { /* same structure */ },
    "movingDate": "ISO date string",
    "vehicleShifting": {
      "required": boolean,
      "vehicles": [{ "type": "Car" | "Bike" | "Scooter" | "Others", "count": number }]
    },
    "extraServices": {
      "painting": {
        "required": boolean,
        "services": {
          "interiorPainting": boolean,
          "exteriorPainting": boolean,
          "woodPolishing": boolean
        }
      }
    },
    "contactPhone": "string",
    "contactEmail": "string" (optional),
    "customerNotes": "string" (optional)
  }
  ```

#### POST /api/movers-packers/quote
Get a price estimate without creating a booking.
- **Authentication**: Not required
- **Body**:
  ```json
  {
    "moveType": "within-city" | "intercity",
    "homeSize": "1BHK" | "2BHK" | "3BHK" | "4BHK" | "Villa",
    "vehicleShifting": { /* optional */ },
    "extraServices": { /* optional */ }
  }
  ```

#### GET /api/movers-packers/my-bookings
Get all bookings for the authenticated user.
- **Authentication**: Required

#### GET /api/movers-packers/booking/:id
Get details of a specific booking.
- **Authentication**: Required

#### PATCH /api/movers-packers/booking/:id/cancel
Cancel a booking.
- **Authentication**: Required

### Admin Endpoints

#### GET /api/admin/movers-packers/bookings
Get all bookings with filtering and pagination.
- **Authentication**: Admin required
- **Query Parameters**:
  - `status`: Filter by status
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20, max: 100)
  - `search`: Search in phone, email, or addresses

#### GET /api/admin/movers-packers/stats
Get booking statistics.
- **Authentication**: Admin required

#### PATCH /api/admin/movers-packers/booking/:id/status
Update booking status.
- **Authentication**: Admin required
- **Body**:
  ```json
  {
    "status": "pending" | "confirmed" | "in-progress" | "completed" | "cancelled",
    "adminNotes": "string" (optional)
  }
  ```

#### PATCH /api/admin/movers-packers/booking/:id/assign
Assign employee to booking.
- **Authentication**: Admin required
- **Body**:
  ```json
  {
    "employeeId": "string"
  }
  ```

#### DELETE /api/admin/movers-packers/booking/:id
Delete a booking.
- **Authentication**: Admin required

## Pricing Structure

### Base Prices

#### Within City
- 1BHK: ₹3,500
- 2BHK: ₹5,500
- 3BHK: ₹7,500
- 4BHK: ₹10,000
- Villa: ₹15,000

#### Intercity
- 1BHK: ₹8,000
- 2BHK: ₹12,000
- 3BHK: ₹16,000
- 4BHK: ₹22,000
- Villa: ₹35,000

### Vehicle Shifting (Additional)

#### Within City
- Car: ₹1,500
- Bike: ₹800
- Scooter: ₹700
- Others: ₹1,000

#### Intercity
- Car: ₹4,000
- Bike: ₹2,000
- Scooter: ₹1,800
- Others: ₹2,500

### Painting Services (Additional)

#### Interior Painting
- 1BHK: ₹8,000
- 2BHK: ₹12,000
- 3BHK: ₹16,000
- 4BHK: ₹20,000
- Villa: ₹30,000

#### Exterior Painting
- 1BHK: ₹5,000
- 2BHK: ₹7,000
- 3BHK: ₹9,000
- 4BHK: ₹12,000
- Villa: ₹18,000

#### Wood Polishing
- Flat rate: ₹3,000

## Frontend Integration

### Route
`/movers-packers` - Main booking page

### Component
`src/pages/MoversPackersPage.jsx`

### Features
- Responsive design matching Bubble Flash style
- Real-time price calculation
- Form validation
- Toast notifications
- Google Maps autocomplete integration
- Mobile-friendly interface

## Database Schema

### MoversPackers Model
```javascript
{
  userId: ObjectId (ref: User),
  moveType: String (enum),
  homeSize: String (enum),
  sourceCity: {
    fullAddress: String,
    city: String,
    state: String,
    pincode: String,
    latitude: Number,
    longitude: Number
  },
  destinationCity: { /* same structure */ },
  movingDate: Date,
  vehicleShifting: {
    required: Boolean,
    vehicles: [{ type: String, count: Number, details: String }]
  },
  extraServices: {
    painting: {
      required: Boolean,
      services: {
        interiorPainting: Boolean,
        exteriorPainting: Boolean,
        woodPolishing: Boolean
      }
    }
  },
  contactPhone: String,
  contactEmail: String,
  estimatedPrice: {
    basePrice: Number,
    vehicleShiftingCost: Number,
    paintingCost: Number,
    totalPrice: Number
  },
  status: String (enum),
  paymentStatus: String (enum),
  adminNotes: String,
  assignedEmployee: ObjectId (ref: Employee),
  customerNotes: String,
  timestamps: true
}
```

## Security

### Input Validation
- All enum fields (moveType, homeSize, status) are validated against whitelists
- Search queries are sanitized to prevent regex injection
- Date validation ensures moving date is in the future
- Pagination parameters are validated and limited

### Authentication
- Customer endpoints require valid JWT token
- Admin endpoints require admin authentication
- User data is isolated per user account

## Setup

### Environment Variables
Add to `server/.env`:
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Installation
```bash
# Install dependencies (already done if you've set up the project)
cd /path/to/BFS
npm install

cd server
npm install
```

### Usage
1. Navigate to `/movers-packers` in the application
2. Select move type and home size
3. Enter source and destination addresses
4. Select moving date
5. Optionally add vehicle shifting and painting services
6. View real-time price estimate
7. Submit booking

## Notes
- Prices shown are estimates and may vary based on actual requirements
- Google Maps API key is required for address autocomplete
- Moving date must be at least tomorrow
- Booking requires user authentication
