# Bubble Flash - Complete Database Schema & ER Diagram

## Database Overview

This document provides a comprehensive overview of the Bubble Flash application database schema, including all entities, relationships, and their purposes.

## Entity Relationship Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│     Users       │    │    Addresses     │    │     Orders      │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ _id (ObjectId)  │◄───┤ userId           │    │ _id (ObjectId)  │
│ name            │    │ type             │    │ orderNumber     │
│ email           │    │ fullAddress      │    │ userId          │◄─┐
│ phone           │    │ latitude         │    │ items[]         │  │
│ password        │    │ longitude        │    │ serviceAddress  │  │
│ profileImage    │    │ city             │    │ scheduledDate   │  │
│ provider        │    │ state            │    │ totalAmount     │  │
│ googleId        │    │ pincode          │    │ paymentStatus   │  │
│ emailVerified   │    │ landmark         │    │ orderStatus     │  │
│ phoneVerified   │    │ isDefault        │    │ orderStatus     │  │
│ status          │    │ createdAt        │    │ rating          │  │
│ preferences     │    │ updatedAt        │    │ review          │  │
│ totalOrders     │    └──────────────────┘    │ createdAt       │  │
│ totalSpent      │                            │ updatedAt       │  │
│ createdAt       │                            └─────────────────┘  │
│ updatedAt       │                                                 │
└─────────────────┘                                                 │
         │                                                          │ │
         │                                                          │ │
         ▼                                                          │ │
┌─────────────────┐    ┌──────────────────┐                        │ │
│      Cart       │    │   ServiceCategory│                        │ │
├─────────────────┤    ├──────────────────┤                        │ │
│ _id (ObjectId)  │    │ _id (ObjectId)   │◄─┐                     │ │
│ userId          │◄───┤ name             │  │                     │ │
│ items[]         │    │ description      │  │                     │ │
│ totalAmount     │    │ image            │  │                     │ │
│ totalItems      │    │ icon             │  │                     │ │
│ createdAt       │    │ isActive         │  │                     │ │
│ updatedAt       │    │ sortOrder        │  │                     │ │
└─────────────────┘    │ createdAt        │  │                     │ │
                       │ updatedAt        │  │                     │ │
                       └──────────────────┘  │                     │ │
                                             │                     │ │
                       ┌──────────────────┐  │                     │ │
                       │    Services      │  │                     │ │
                       ├──────────────────┤  │                     │ │
                       │ _id (ObjectId)   │  │                     │ │
                       │ categoryId       │──┘                     │ │
                       │ name             │                        │ │
                       │ description      │                        │ │
                       │ basePrice        │                        │ │
                       │ estimatedDuration│                        │ │
                       │ image            │                        │ │
                       │ features[]       │                        │ │
                       │ isActive         │                        │ │
                       │ sortOrder        │                        │ │
                       │ createdAt        │                        │ │
                       │ updatedAt        │                        │ │
                       └──────────────────┘                        │ │
                                │                                  │ │
                                │                                  │ │
                                ▼                                  │ │
                       ┌──────────────────┐                        │ │
                       │    Packages      │                        │ │
                       ├──────────────────┤                        │ │
                       │ _id (ObjectId)   │                        │ │
                       │ serviceId        │◄───────────────────────┘ │
                       │ name             │                          │
                       │ description      │                          │
                       │ price            │                          │
                       │ originalPrice    │                          │
                       │ discountPercent  │                          │
                       │ duration         │                          │
                       │ features[]       │                          │
                       │ packageType      │                          │
                       │ vehicleTypes[]   │                          │
                       │ isActive         │                          │
                       │ sortOrder        │                          │
                       │ createdAt        │                          │
                       │ updatedAt        │                          │
                       └──────────────────┘                          │
                                                                     │
┌─────────────────┐    ┌──────────────────┐                        │
│     AddOns      │    │     Coupons      │                        │
├─────────────────┤    ├──────────────────┤                        │
│ _id (ObjectId)  │    │ _id (ObjectId)   │                        │
│ name            │    │ code             │                        │
│ description     │    │ name             │                        │
│ price           │    │ description      │                        │
│ duration        │    │ discountType     │                        │
│ categoryId      │    │ discountValue    │                        │
│ applicableServs │    │ minimumOrderAmt  │                        │
│ image           │    │ maximumDiscountAmt│                       │
│ isActive        │    │ validFrom        │                        │
│ sortOrder       │    │ validUntil       │                        │
│ createdAt       │    │ usageLimit       │                        │
│ updatedAt       │    │ usedCount        │                        │
└─────────────────┘    │ userUsageLimit   │                        │
                       │ applicableCategs │                        │
                       │ applicableServs  │                        │
                       │ isActive         │                        │
                       │ createdAt        │
                       │ updatedAt        │
                       └──────────────────┘
```

## Entity Details

### 1. Users Collection
**Purpose**: Store customer information and authentication data

**Key Fields**:
- `_id`: Unique identifier
- `email`, `phone`: Login credentials (unique)
- `provider`: Authentication method ('local' or 'google')
- `preferences`: User settings and default address

**Relationships**:
- One-to-Many with Addresses
- One-to-Many with Orders
- One-to-One with Cart

### 2. Addresses Collection
**Purpose**: Store multiple delivery/service addresses per user

**Key Fields**:
- `userId`: Reference to Users collection
- `type`: Address category (home, work, other)
- `isDefault`: Primary address flag
- `latitude`, `longitude`: GPS coordinates for mapping

**Business Rules**:
- Each user can have multiple addresses
- Only one default address per user
- Automatic geocoding for location services

### 3. ServiceCategory Collection
**Purpose**: Organize services into categories (Car, Bike, Laundry)

**Key Fields**:
- `name`: Category name
- `sortOrder`: Display order
- `isActive`: Enable/disable category

### 4. Services Collection
**Purpose**: Define available services within each category

**Key Fields**:
- `categoryId`: Reference to ServiceCategory
- `basePrice`: Starting price
- `estimatedDuration`: Service time in minutes
- `features[]`: List of service features

### 5. Packages Collection
**Purpose**: Predefined service bundles with specific pricing

**Key Fields**:
- `serviceId`: Reference to Services
- `vehicleTypes[]`: Applicable vehicle types
- `packageType`: basic, standard, premium, custom
- `discountPercentage`: Savings calculation

### 6. AddOns Collection
**Purpose**: Optional extras that can be added to services

**Key Fields**:
- `applicableServices[]`: Which services can use this add-on
- `categoryId`: Service category reference
- `duration`: Additional time required

### 7. Cart Collection
**Purpose**: Temporary storage for items before checkout

**Key Fields**:
- `userId`: Cart owner
- `items[]`: Array of cart items with nested structure
  - `addOns[]`: Selected add-ons per item
  - `laundryItems[]`: Laundry-specific items with quantities
- `totalAmount`, `totalItems`: Calculated totals

**Business Logic**:
- Pre-save middleware calculates totals automatically
- Supports complex item structures (services + packages + add-ons)

### 8. Orders Collection
**Purpose**: Store confirmed bookings and track order lifecycle

**Key Fields**:
- `orderNumber`: Auto-generated unique identifier
- `items[]`: Snapshot of ordered items
- `serviceAddress`: Delivery/service location
- `scheduledDate`, `scheduledTimeSlot`: When service will occur
- `paymentStatus`: pending, processing, completed, failed, refunded
- `orderStatus`: pending, confirmed, assigned, in_progress, completed, cancelled

**Business Features**:
- Order number auto-generation
- Payment and order status tracking
- Review and rating system

### 9. Coupons Collection
**Purpose**: Discount codes and promotional offers

**Key Fields**:
- `code`: Unique coupon identifier
- `discountType`: percentage or fixed amount
- `usageLimit`: Total usage limit
- `userUsageLimit`: Per-user usage limit
- `minimumOrderAmount`: Minimum spend requirement

**Business Logic**:
- Built-in validation methods
- Automatic discount calculation
- Category/service specific coupons

## Data Relationships

### Primary Relationships
1. **Users → Addresses**: One-to-Many
2. **Users → Orders**: One-to-Many
3. **Users → Cart**: One-to-One
4. **ServiceCategory → Services**: One-to-Many
5. **Services → Packages**: One-to-Many

### Complex Relationships
1. **Cart Items**: References Services, Packages, and AddOns
2. **Order Items**: Denormalized data for historical accuracy
3. **Coupons**: Can be category or service specific

## Indexes and Performance

### Recommended Indexes
```javascript
// Users
db.users.createIndex({ "email": 1 }, { unique: true, sparse: true })
db.users.createIndex({ "phone": 1 }, { unique: true, sparse: true })
db.users.createIndex({ "googleId": 1 }, { unique: true, sparse: true })

// Orders
db.orders.createIndex({ "userId": 1, "createdAt": -1 })
db.orders.createIndex({ "orderNumber": 1 }, { unique: true })
db.orders.createIndex({ "orderStatus": 1 })

// Services
db.services.createIndex({ "categoryId": 1, "isActive": 1 })
db.packages.createIndex({ "serviceId": 1, "isActive": 1 })

// Cart
db.carts.createIndex({ "userId": 1 }, { unique: true })

// Coupons
db.coupons.createIndex({ "code": 1 }, { unique: true })
db.coupons.createIndex({ "isActive": 1, "validFrom": 1, "validUntil": 1 })
```

## Business Logic Features

### 1. Cart Management
- Automatic total calculation
- Item merging and quantity updates
- Add-on and laundry item support

### 2. Order Processing
- Order number generation
- Status workflow management
- Payment integration hooks

### 3. Pricing and Discounts
- Dynamic pricing based on packages
- Coupon validation and application

### 4. Service Management
- Category-based organization
- Vehicle-specific packages
- Duration and feature management

### 5. User Management
- Multi-provider authentication
- Address management
- Preference settings

This schema supports all CRUD operations and provides a scalable foundation for the Bubble Flash service booking application.
