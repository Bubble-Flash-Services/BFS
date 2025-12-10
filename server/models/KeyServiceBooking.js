import mongoose from 'mongoose';

const keyServiceBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Service Type
  serviceType: {
    type: String,
    enum: ['key-duplication', 'lock-services', 'advanced-services', 'specialized-keys'],
    required: true
  },
  
  // Specific Service
  specificService: {
    type: String,
    required: true
    // Examples: 'house-key', 'bike-key', 'emergency-lock-opening', etc.
  },
  
  // Key Type Details
  keyType: {
    name: String,
    description: String
  },
  
  // Quantity
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Emergency or Regular
  isEmergency: {
    type: Boolean,
    default: false
  },
  
  // Time Preference
  nightService: {
    type: Boolean,
    default: false // True if service needed between 10PM-6AM
  },
  
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
  preferredTime: {
    type: Date
  },
  
  // Photo Upload
  keyPhoto: {
    url: String,
    publicId: String
  },
  
  // Special Instructions
  specialInstructions: String,
  
  // Pricing
  pricing: {
    basePrice: Number,
    nightSurcharge: Number, // For 10PM-6AM services
    totalPrice: Number
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
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
  
  // Security Verification
  verificationCode: {
    type: String
  },
  ownershipVerified: {
    type: Boolean,
    default: false
  },
  idProof: {
    type: String // Type of ID provided
  },
  
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
  review: String
}, {
  timestamps: true
});

// Indexes for efficient queries
keyServiceBookingSchema.index({ userId: 1, createdAt: -1 });
keyServiceBookingSchema.index({ status: 1 });
keyServiceBookingSchema.index({ isEmergency: 1, createdAt: -1 });
keyServiceBookingSchema.index({ assignedTechnician: 1 });

const KeyServiceBooking = mongoose.model('KeyServiceBooking', keyServiceBookingSchema);

export default KeyServiceBooking;
