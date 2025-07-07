# Bubble Flash Backend API

Complete backend implementation for the Bubble Flash service booking platform supporting car wash, bike wash, and laundry services.

## 🚀 Features

- **Complete CRUD Operations** for all entities
- **JWT Authentication** with Google OAuth support
- **Cart Management** with complex item structures
- **Order Processing** with status tracking
- **Payment Integration** ready (supports multiple payment methods)
- **Coupon System** with validation and discount calculation
- **Admin Dashboard** with comprehensive statistics
- **Employee Management** with role-based access
- **Address Management** with geolocation support
- **Review and Rating System**
- **Real-time Order Tracking**

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the server directory:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/bubbleflash
   
   # JWT Secret (generate a strong random string)
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Email Configuration (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Twilio (for SMS notifications)
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   ```

4. **Database Setup**
   
   Make sure MongoDB is running, then seed the database:
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📊 Database Schema

The application uses MongoDB with the following collections:

- **users** - Customer accounts and authentication
- **addresses** - User delivery/service addresses
- **servicecategories** - Service categories (Car, Bike, Laundry)
- **services** - Available services within categories
- **packages** - Predefined service bundles
- **addons** - Optional extras for services
- **carts** - User shopping carts
- **orders** - Confirmed bookings and order tracking
- **coupons** - Discount codes and promotions
- **employees** - Staff management and assignments

For detailed schema information, see [database-schema-visual.md](../database-schema-visual.md)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `POST /api/auth/forgot-password` - Password reset

### Services
- `GET /api/services/categories` - Get service categories
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service details
- `GET /api/services/:id/packages` - Get service packages
- `GET /api/services/addons` - Get available add-ons

### Cart Management
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Order Management
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/review` - Submit review

### Address Management
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Coupons
- `GET /api/coupons` - Get available coupons
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons/apply` - Apply coupon

### Admin Panel
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/orders` - All orders management
- `POST /api/admin/services` - Create service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service

For complete API documentation, see [api-documentation.md](../api-documentation.md)

## 👤 Default Admin Account

After seeding the database, you can access the admin panel with:

- **Email:** admin@bubbleflash.in
- **Password:** admin123

## 🎟️ Sample Coupons

The seeded database includes these test coupons:

- **WELCOME20** - 20% off first order (min ₹199)
- **SAVE50** - Flat ₹50 off orders above ₹300
- **WEEKEND25** - 25% off weekend bookings (min ₹250)

## 🏗️ Project Structure

```
server/
├── controllers/          # Business logic controllers
│   ├── authController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── serviceController.js
│   ├── addressController.js
│   ├── couponController.js
│   └── adminController.js
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Address.js
│   ├── ServiceCategory.js
│   ├── Service.js
│   ├── Package.js
│   ├── AddOn.js
│   ├── Cart.js
│   ├── Order.js
│   ├── Coupon.js
│   └── Employee.js
├── routes/              # API route definitions
│   ├── auth.js
│   ├── cart.js
│   ├── orders.js
│   ├── services.js
│   ├── addresses.js
│   ├── coupons.js
│   └── admin.js
├── middleware/          # Authentication & validation
│   └── auth.js
├── app.js              # Express app configuration
├── seedDatabase.js     # Database seeding script
└── package.json
```

## 🔐 Authentication & Security

- **JWT Tokens** for secure authentication
- **Password Hashing** using bcrypt
- **Role-based Access Control** (Admin, Manager, Technician)
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for frontend integration

## 💳 Payment Integration

The backend is prepared for payment integration with:

- **UPI** (GPay, PhonePe, Paytm)
- **Credit/Debit Cards**
- **Digital Wallets**
- **Cash on Delivery**

Payment webhooks are supported for real-time status updates.

## 📱 Notification System

Support for multiple notification channels:

- **Email Notifications** using Nodemailer
- **SMS Notifications** using Twilio
- **Push Notifications** (integration ready)

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bubbleflash
JWT_SECRET=your_production_jwt_secret
PORT=5000
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### PM2 Deployment

```bash
npm install -g pm2
pm2 start app.js --name "bubbleflash-api"
pm2 startup
pm2 save
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📝 API Testing

Use the provided Postman collection or test with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get service categories
curl http://localhost:5000/api/services/categories

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bubbleflash.in","password":"admin123"}'
```

## 🔧 Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Seed database with sample data
npm run seed

# Start production server
npm start
```

## 📊 Monitoring & Logging

- Console logging for development
- File-based logging for production
- Error tracking and monitoring
- Performance metrics collection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- **Email:** support@bubbleflash.in
- **Phone:** +91 9980123452
- **Documentation:** [api-documentation.md](../api-documentation.md)

## 🔄 Version History

- **v1.0.0** - Initial release with full CRUD functionality
- **v1.1.0** - Added payment integration support
- **v1.2.0** - Enhanced admin dashboard
- **v1.3.0** - Added notification system

---

Built with ❤️ for Bubble Flash Services
- `POST /api/auth/signup` — Signup with email/password
- `POST /api/auth/signin` — Signin with email/password
- `GET /api/auth/google` — Start Google OAuth
- `GET /api/auth/google/callback` — Google OAuth callback
- `GET /api/user/me` — Get current user profile (JWT required)

## Setup
1. Install dependencies:
   ```sh
   npm install express mongoose cors dotenv bcryptjs jsonwebtoken passport passport-google-oauth20 express-session
   ```
2. Set up your `.env` file (see `.env` in this folder).
3. Start MongoDB locally or use MongoDB Atlas.
4. Run the server:
   ```sh
   npm start
   ```
9591572775