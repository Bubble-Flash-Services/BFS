import mongoose from 'mongoose';

const flowerBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Service Type
  serviceType: {
    type: String,
    enum: ['bouquet', 'gift-box', 'decoration', 'bulk-event'],
    required: true
  },
  
  // Specific Service
  specificService: {
    type: String,
    required: true
  },
  
  // Service Name
  serviceName: {
    type: String,
    default: 'flowers'
  },
  
  // Category Details
  category: {
    type: String,
    enum: ['classic-bouquet', 'love-couple-bouquet', 'premium-bouquet', 'gift-box', 'photo-gift', 'love-surprise-box', 'birthday-decoration', 'couple-decoration', 'party-decoration', 'bulk-event'],
    required: true
  },
  
  // Item Details
  itemName: {
    type: String,
    required: true
  },
  
  // Quantity
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Customization
  customization: {
    message: String,
    recipientName: String,
    photoUrl: String,
    photoPublicId: String,
    theme: String,
    specialInstructions: String
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
  
  // Delivery Details
  deliveryDate: {
    type: Date,
    required: true
  },
  deliveryTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'late-night', 'anytime'],
    default: 'anytime'
  },
  isLateNightDelivery: {
    type: Boolean,
    default: false
  },
  
  // Seasonal Availability
  isSeasonalItem: {
    type: Boolean,
    default: false
  },
  seasonalNotes: String,
  
  // Pricing
  pricing: {
    basePrice: Number,
    lateNightSurcharge: Number,
    customizationCharge: Number,
    totalPrice: Number
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Delivery Staff Assignment
  assignedDeliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  
  // Tracking
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  
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
  
  // Photos
  deliveryProof: {
    url: String,
    publicId: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
flowerBookingSchema.index({ userId: 1, createdAt: -1 });
flowerBookingSchema.index({ status: 1 });
flowerBookingSchema.index({ deliveryDate: 1 });
flowerBookingSchema.index({ assignedDeliveryPerson: 1 });
flowerBookingSchema.index({ category: 1 });

const FlowerBooking = mongoose.model('FlowerBooking', flowerBookingSchema);

export default FlowerBooking;
