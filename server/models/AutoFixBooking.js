import mongoose from 'mongoose';

const autoFixBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Service Name
  serviceName: {
    type: String,
    default: 'autofix'
  },
  
  // Service Type
  serviceType: {
    type: String,
    enum: ['minor-dent-repair', 'scratch-repair', 'bumper-repair', 'rubbing-polishing'],
    required: true
  },
  
  // Car Category
  carCategory: {
    type: String,
    enum: ['hatchback', 'sedan', 'mid-suv', 'suv', 'luxury'],
    required: true
  },
  
  // Polishing Type (for rubbing-polishing service)
  polishingType: {
    type: String,
    enum: ['single-panel', 'full-rubbing', 'full-polishing']
  },
  
  // Damage Photos
  damagePhotos: [{
    url: String,
    publicId: String
  }],
  
  // Location Details
  serviceLocation: {
    fullAddress: { type: String, required: true },
    city: String,
    state: String,
    pincode: String,
    latitude: Number,
    longitude: Number
  },
  
  // Contact Information
  contactPhone: {
    type: String,
    required: true
  },
  alternateContact: String,
  
  // Booking Time
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTimeSlot: {
    type: String,
    required: true
  },
  
  // Special Instructions
  specialInstructions: String,
  
  // Pricing
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
  
  // Admin approved pricing
  adminApprovedPrice: {
    type: Number,
    min: 0
  },
  isPriceApproved: {
    type: Boolean,
    default: false
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending-review', 'price-sent', 'confirmed', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending-review'
  },
  
  // Technician Assignment
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  
  // Tracking
  technicianETA: Date,
  serviceStartTime: Date,
  serviceEndTime: Date,
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  
  // Admin Notes
  adminNotes: String,
  
  // Customer Review
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String,
  
  // WhatsApp notification sent
  whatsappNotificationSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
autoFixBookingSchema.index({ userId: 1, createdAt: -1 });
autoFixBookingSchema.index({ status: 1 });
autoFixBookingSchema.index({ isPriceApproved: 1 });
autoFixBookingSchema.index({ assignedTechnician: 1 });

const AutoFixBooking = mongoose.model('AutoFixBooking', autoFixBookingSchema);

export default AutoFixBooking;
