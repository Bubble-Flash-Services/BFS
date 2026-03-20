import mongoose from 'mongoose';

const greenBookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    name: {
      type: String,
      required: true,
      maxlength: 100
    },
    phone: {
      type: String,
      required: true,
      maxlength: 15
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GreenService',
    required: true
  },
  serviceName: {
    type: String,
    required: true,
    default: 'green&clean'
  },
  serviceCategory: {
    type: String,
    required: true
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  },
  address: {
    full: {
      type: String,
      required: true,
      maxlength: 500
    },
    lat: {
      type: Number,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      min: -180,
      max: 180
    },
    pincode: {
      type: String,
      required: true,
      maxlength: 10
    },
    city: {
      type: String,
      default: 'Bengaluru'
    }
  },
  distanceKm: {
    type: Number,
    min: 0
  },
  distanceCharge: {
    type: Number,
    min: 0,
    default: 0
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['created', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'created',
    index: true
  },
  scheduledAt: {
    type: Date,
    default: Date.now
  },
  payment: {
    method: {
      type: String,
      enum: ['razorpay', 'cash', 'upi'],
      default: 'razorpay'
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
  },
  beforeImages: [{
    type: String,
    maxlength: 500
  }],
  afterImages: [{
    type: String,
    maxlength: 500
  }],
  notes: {
    type: String,
    maxlength: 1000
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes for faster queries
greenBookingSchema.index({ status: 1, createdAt: -1 });
greenBookingSchema.index({ 'user.phone': 1 });
greenBookingSchema.index({ providerId: 1, status: 1 });
greenBookingSchema.index({ branchId: 1, status: 1 });
greenBookingSchema.index({ scheduledAt: 1 });

// Note: bookingNumber is now generated in the controller (like Order model)
// This ensures it's set before validation runs

export default mongoose.model('GreenBooking', greenBookingSchema);
