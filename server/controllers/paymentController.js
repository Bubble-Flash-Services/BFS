import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import User from '../models/User.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Verify the order exists and belongs to the user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('🔍 Payment verification - Order userId:', order.userId.toString());
    console.log('🔍 Payment verification - Request user id:', req.user.id.toString());

    if (order.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to order'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: currency,
      receipt: `ord_${Date.now()}`, // Shortened to stay under 40 characters
      notes: {
        orderId: orderId,
        userId: req.user.id.toString(),
        userEmail: req.user.email
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update order with Razorpay order ID
    await Order.findByIdAndUpdate(orderId, {
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending'
    });

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Find and update the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify payment with Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status === 'captured') {
      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'completed',
        status: 'confirmed',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
        paymentDetails: {
          method: payment.method,
          bank: payment.bank,
          wallet: payment.wallet,
          vpa: payment.vpa,
          email: payment.email,
          contact: payment.contact
        }
      });

      // Send success response
      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: orderId,
          paymentId: razorpay_payment_id,
          status: 'completed'
        }
      });

      // Optional: Send confirmation email/SMS here
      console.log(`✅ Payment successful for order ${orderId}`);
      
    } else {
      // Payment failed
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed',
        status: 'payment_failed'
      });

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Handle payment failure
export const handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, error } = req.body;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'failed',
      status: 'payment_failed',
      paymentError: error
    });

    res.json({
      success: true,
      message: 'Payment failure recorded'
    });
  } catch (error) {
    console.error('Error handling payment failure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment failure'
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    res.json({
      success: true,
      data: {
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId
      }
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status'
    });
  }
};

// Webhook handler for Razorpay events
export const handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailedEvent(event.payload.payment.entity);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Helper function to handle payment captured event
const handlePaymentCaptured = async (payment) => {
  try {
    const order = await Order.findOne({ 
      razorpayOrderId: payment.order_id 
    });
    
    if (order && order.paymentStatus !== 'completed') {
      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: 'completed',
        status: 'confirmed',
        razorpayPaymentId: payment.id,
        paidAt: new Date()
      });
      
      console.log(`✅ Webhook: Payment completed for order ${order._id}`);
    }
  } catch (error) {
    console.error('Error handling payment captured webhook:', error);
  }
};

// Helper function to handle payment failed event
const handlePaymentFailedEvent = async (payment) => {
  try {
    const order = await Order.findOne({ 
      razorpayOrderId: payment.order_id 
    });
    
    if (order) {
      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: 'failed',
        status: 'payment_failed',
        paymentError: payment.error_description
      });
      
      console.log(`❌ Webhook: Payment failed for order ${order._id}`);
    }
  } catch (error) {
    console.error('Error handling payment failed webhook:', error);
  }
};
