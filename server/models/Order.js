import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package'
    },
    serviceName: {
      type: String,
      required: true
    },
    packageName: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    addOns: [{
      addOnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddOn'
      },
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    laundryItems: [{
      itemType: String,
      quantity: Number,
      pricePerItem: Number
    }],
    vehicleType: String,
    specialInstructions: String
  }],
  serviceAddress: {
    fullAddress: {
      type: String,
      required: true
    },
    latitude: Number,
    longitude: Number,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTimeSlot: {
    type: String,
    required: true
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  couponCode: String,
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'wallet', 'cash', 'gpay', 'phonepe', 'paytm'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  
  // Razorpay specific fields
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paidAt: Date,
  paymentError: String,
  paymentDetails: {
    method: String,
    bank: String,
    wallet: String,
    vpa: String,
    email: String,
    contact: String
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  customerNotes: String,
  estimatedDuration: {
    type: Number, // in minutes
    default: 60
  },
  actualStartTime: Date,
  actualEndTime: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String,
  isReviewSubmitted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `BFS${timestamp.slice(-6)}${random}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
