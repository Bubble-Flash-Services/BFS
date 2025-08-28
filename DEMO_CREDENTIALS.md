# 🔐 Demo Credentials for BFS Application

This file contains demo login credentials for testing the application. **Do not deploy this file to production.**

## 👨‍💼 Admin Login
**URL**: `/admin/login`
- **Email**: `admin@bubbleflash.com`
- **Password**: `admin123`

**Admin Features**:
- View all orders and manage order status
- Manage services, packages, and add-ons
- User management and analytics
- Coupon management
- Employee management

## 👷‍♂️ Employee Login
**URL**: `/employee/login`
- **Email**: `ravi.kumar@bubbleflash.com`
- **Password**: `employee123`

**Other Employee Accounts** (available in seed data):
- `priya.sharma@bubbleflash.com` - employee123
- `amit.singh@bubbleflash.com` - employee123
- `sneha.patel@bubbleflash.com` - employee123

**Employee Features**:
- View assigned orders
- Update order status and progress
- View customer details
- Manage service schedules

## 🧑‍💻 Customer Registration
**URL**: `/auth` or `/register`
- Customers can register with any email
- Google OAuth login is also available
- Use any valid email format for testing

## 🛠️ Development Notes

### Database Seeding
To populate the database with demo data, run:
```bash
cd server
node seedDatabase.js        # Creates services, packages, and add-ons
node seedAdminEmployee.js   # Creates admin and employee accounts
```

### Environment Setup
Make sure these environment variables are set:
- `JWT_SECRET` - For authentication tokens
- `MONGO_URI` - Database connection
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - For OAuth
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` - For payments

### Security Notice
- **Never commit this file to public repositories**
- **Change all passwords before going live**
- **Use environment variables for production credentials**
- **Enable proper authentication and authorization**

## 🧪 Testing Scenarios

### Order Management Testing
1. **Customer Flow**: Register → Add services to cart → Place order → Make payment
2. **Employee Flow**: Login → View assigned orders → Update status
3. **Admin Flow**: Login → View all orders → Manage services → Analytics

### Payment Testing
Use Razorpay test credentials from `RAZORPAY_SETUP_GUIDE.md`:
- **Test UPI**: `success@razorpay`
- **Test Phone**: `9999999999@upi`
- **For Failures**: `failure@razorpay`

### Address Testing
Test addresses are available in major Indian cities:
- Bangalore, Mumbai, Delhi, Chennai, Hyderabad
- Use real pin codes for accurate testing

---

**Last Updated**: August 2025
**Version**: 1.0.0
