# 🔐 Razorpay Integration Setup Guide

## Step 1: Create Razorpay Account

### 1.1 Sign Up
1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Click on "Sign Up" 
3. Choose "Get Started for Free"
4. Fill in your business details:
   - Business Name: "Bubble Flash Services"
   - Business Type: "Service Provider"
   - Industry: "Home Services"
   - Business PAN (if available)

### 1.2 Account Verification
1. Verify your email address
2. Complete phone number verification
3. Submit business documents (if required for live mode)

## Step 2: Dashboard Setup

### 2.1 Access Dashboard
1. Login to [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)
2. Complete the onboarding process
3. Navigate to the main dashboard

### 2.2 Business Profile Setup
1. Go to **Settings** → **Business Profile**
2. Fill in complete business information:
   - Business Name: "Bubble Flash Services"
   - Business Description: "Professional cleaning services for cars, bikes, laundry, and home"
   - Business Address: Your complete address
   - Contact Information

## Step 3: API Keys Setup

### 3.1 Get Test API Keys (For Development)
1. In dashboard, go to **Settings** → **API Keys**
2. Generate test keys:
   - Key ID (starts with `rzp_test_`)
   - Key Secret (keep this secret!)

### 3.2 Get Live API Keys (For Production)
1. Complete account activation (submit required documents)
2. After approval, generate live keys:
   - Key ID (starts with `rzp_live_`)
   - Key Secret (keep this secret!)

## Step 4: Environment Variables Setup

### 4.1 Backend Environment (.env file)
Add these variables to your `server/.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### 4.2 Frontend Environment (.env file)
Add these variables to your `root/.env` file:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxx
```

## Step 5: Webhook Configuration

### 5.1 Development Setup with ngrok
**Important**: Razorpay doesn't accept localhost URLs. Use ngrok for development:

1. **Install ngrok** (if not already installed):
   ```bash
   npm install -g ngrok
   ```

2. **Start your server** (in one terminal):
   ```bash
   cd server
   npm start
   # Server runs on http://localhost:5000
   ```

3. **Create ngrok tunnel** (in another terminal):
   ```bash
   ngrok http 5000
   ```

4. **Copy the public URL** from ngrok output:
   ```
   Forwarding  https://abc123.ngrok.io -> http://localhost:5000
   ```

### 5.2 Create Webhook in Razorpay
1. In Razorpay dashboard, go to **Settings** → **Webhooks**
2. Click **Create New Webhook**
3. Configure webhook:
   - **URL**: https://abc123.ngrok.io/api/payments/webhook/razorpay`` (use your ngrok URL)
   - **Secret**: Generate a random secret (save this in your .env)
   - **Events to Track**:
     - ✅ payment.captured
     - ✅ payment.failed
     - ✅ order.paid

### 5.3 Production Webhook Setup
For production, use your actual domain:
- **URL**: `https://yourdomain.com/api/payments/webhook/razorpay`

### 5.4 Webhook Events
Select these specific events:
- `payment.captured` - When payment is successful
- `payment.failed` - When payment fails
- `order.paid` - When order is fully paid

## Step 6: Payment Methods Configuration

### 6.1 Enable UPI
1. Go to **Settings** → **Payment Methods**
2. Enable **UPI** payments:
   - ✅ UPI ID/VPA
   - ✅ UPI Apps (PhonePe, GooglePay, Paytm, etc.)
   - ✅ UPI Intent
   - ✅ UPI QR Code

### 6.2 Configure Other Methods (Optional)
- ✅ Wallets (PhonePe, GooglePay, Paytm)
- ❌ Cards (Disabled as per requirement)
- ❌ Net Banking (Disabled as per requirement)

## Step 7: Business Settings

### 7.1 Settlement Configuration
1. Go to **Settings** → **Settlements**
2. Configure auto-settlement:
   - Settlement frequency: Daily/Weekly
   - Settlement account: Add your bank account
   - Settlement time: Choose preferred time

### 7.2 Refund Settings
1. Go to **Settings** → **Refunds**
2. Configure refund policies:
   - Auto-refund: Enable/Disable
   - Refund processing time: Instant/Standard

## Step 8: Testing Setup

### 8.1 Test Payments
Use these test details for UPI payments:
- **Test VPA**: `success@razorpay`
- **Test UPI**: `9999999999@upi`
- **For Failures**: `failure@razorpay`

### 8.2 Test Orders
1. Place test orders in your application
2. Use test payment credentials
3. Verify webhook callbacks
4. Check order status updates

## Step 9: Security Configuration

### 9.1 IP Whitelisting (Production)
1. Go to **Settings** → **Security**
2. Add your server IPs to whitelist
3. Enable API restrictions if needed

### 9.2 Webhook Security
1. Always verify webhook signatures
2. Use HTTPS for webhook URLs
3. Implement proper error handling

## Step 10: Go Live Checklist

### 10.1 Before Going Live
- [ ] Complete business verification
- [ ] Submit all required documents
- [ ] Test all payment flows thoroughly
- [ ] Configure live webhook URLs
- [ ] Update environment variables with live keys
- [ ] Test with small amounts first

### 10.2 Go Live Process
1. **Account Activation**:
   - Submit business documents
   - Wait for approval (1-3 business days)
   - Receive activation confirmation

2. **Switch to Live Mode**:
   - Update API keys in environment
   - Update webhook URLs
   - Test with live transactions

## Step 11: Monitoring & Analytics

### 11.1 Payment Tracking
1. Monitor payments in **Dashboard** → **Payments**
2. Check success/failure rates
3. Monitor settlement reports

### 11.2 Analytics Setup
1. Go to **Reports** → **Analytics**
2. Monitor key metrics:
   - Payment success rate
   - UPI vs other methods usage
   - Customer payment preferences

## Important Notes

### Security Best Practices
- ✅ Never expose secret keys in frontend
- ✅ Always verify payment signatures
- ✅ Use HTTPS for all transactions
- ✅ Implement proper error handling
- ✅ Log all payment events

### Compliance Requirements
- ✅ Follow RBI guidelines for digital payments
- ✅ Maintain proper records for settlements
- ✅ Implement proper refund policies
- ✅ Display clear pricing and terms

## Troubleshooting

### Common Issues

#### 1. "URL: private ip found for host: localhost" Error
**Problem**: Razorpay doesn't accept localhost URLs for webhooks.

**Solutions**:
- **For Development**: Use ngrok tunnel (see Step 5.1)
- **For Production**: Use your actual domain name
- **Alternative**: Use a development server with public IP

**Quick Fix with ngrok**:
```bash
# Terminal 1: Start your server
cd server && npm start

# Terminal 2: Create ngrok tunnel
ngrok http 5000

# Use the https://xxx.ngrok.io URL in Razorpay webhook configuration
```

#### 2. Webhook Not Receiving Events
**Problem**: Webhook URL not accessible from Razorpay servers.

**Solutions**:
- Ensure ngrok tunnel is active
- Check if webhook URL is publicly accessible
- Verify webhook secret matches environment variable
- Check server logs for webhook requests

#### 3. Payment Verification Failed
**Problem**: Signature verification fails.

**Solutions**:
- Ensure RAZORPAY_KEY_SECRET is correct in .env
- Check if webhook secret matches
- Verify signature calculation logic

#### 4. Order Not Found Error
**Problem**: Order ID mismatch between frontend and backend.

**Solutions**:
- Check order creation response
- Verify order ID is passed correctly to payment component
- Ensure user has permission to access the order

### Support Contacts
- **Razorpay Support**: [support@razorpay.com](mailto:support@razorpay.com)
- **Developer Docs**: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **API Reference**: [https://razorpay.com/docs/api/](https://razorpay.com/docs/api/)

## Final Implementation Status

After completing this setup:

### ✅ Backend Features Implemented
- Razorpay order creation
- Payment verification with signature validation
- Webhook handling for payment status updates
- Order status management
- Payment failure handling

### ✅ Frontend Features Implemented
- Razorpay payment component
- UPI payment integration
- Payment success/failure handling
- Order status tracking
- User-friendly payment interface

### ✅ Admin Dashboard Updates
- Payment status visibility
- Razorpay transaction details
- Order management with payment info

Your Razorpay integration is now complete and ready for production use! 🚀
