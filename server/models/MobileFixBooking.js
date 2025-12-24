import mongoose from 'mongoose';

const mobileFixBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  serviceName: {
    type: String,
    default: 'mobilefix'
  },
  
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhoneBrand',
    required: true
  },
  
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhoneModel',
    required: true
  },
  
  serviceType: {
    type: String,
    enum: [
      'screen-replacement',
      'battery-replacement',
      'charging-port-replacement',
      'speaker-microphone-replacement',
      'camera-glass-replacement',
      'phone-cleaning-diagnostics'
    ],
    required: true
  },
  
  serviceLocation: {
    fullAddress: { type: String, required: true },
    city: String,
    state: String,
    pincode: String,
    latitude: Number,
    longitude: Number
  },
  
  contactPhone: {
    type: String,
    required: true
  },
  alternateContact: String,
  
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTimeSlot: {
    type: String,
    required: true
  },
  
  specialInstructions: String,
  
  pricing: {
    basePrice: {
      type: Number,
      min: 0
    },
    discount: {
      type: Number,
      min: 0
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    finalPrice: {
      type: Number,
      min: 0
    },
    isFirstOrder: Boolean
  },
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  
  technicianETA: Date,
  serviceStartTime: Date,
  serviceEndTime: Date,
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  
  adminNotes: String,
  
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String,
  
  whatsappNotificationSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

mobileFixBookingSchema.index({ userId: 1, createdAt: -1 });
mobileFixBookingSchema.index({ status: 1 });
mobileFixBookingSchema.index({ assignedTechnician: 1 });

const MobileFixBooking = mongoose.model('MobileFixBooking', mobileFixBookingSchema);

export default MobileFixBooking;
