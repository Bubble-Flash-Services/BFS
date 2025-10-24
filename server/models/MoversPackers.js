import mongoose from 'mongoose';

const moversPackersSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Basic Information
  moveType: {
    type: String,
    enum: ['within-city', 'intercity'],
    required: true
  },
  homeSize: {
    type: String,
    enum: ['1BHK', '2BHK', '3BHK', '4BHK', 'Villa'],
    required: true
  },
  
  // Location Details
  sourceCity: {
    fullAddress: { type: String, required: true },
    city: String,
    state: String,
    pincode: String,
    latitude: Number,
    longitude: Number
  },
  destinationCity: {
    fullAddress: { type: String, required: true },
    city: String,
    state: String,
    pincode: String,
    latitude: Number,
    longitude: Number
  },
  
  // Moving Details
  movingDate: {
    type: Date,
    required: true
  },
  
  // Vehicle Shifting
  vehicleShifting: {
    required: { type: Boolean, default: false },
    vehicles: [{
      type: {
        type: String,
        enum: ['Car', 'Bike', 'Scooter', 'Others']
      },
      count: { type: Number, default: 1 },
      details: String
    }]
  },
  
  // Extra Services
  extraServices: {
    painting: {
      required: { type: Boolean, default: false },
      services: {
        interiorPainting: { type: Boolean, default: false },
        exteriorPainting: { type: Boolean, default: false },
        woodPolishing: { type: Boolean, default: false }
      }
    }
  },
  
  // Contact Information
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: String,
  
  // Pricing
  estimatedPrice: {
    basePrice: Number,
    vehicleShiftingCost: Number,
    paintingCost: Number,
    totalPrice: Number
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Admin Notes
  adminNotes: String,
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  
  // Additional Notes
  customerNotes: String
}, {
  timestamps: true
});

// Index for efficient queries
moversPackersSchema.index({ userId: 1, createdAt: -1 });
moversPackersSchema.index({ status: 1 });
moversPackersSchema.index({ movingDate: 1 });

const MoversPackers = mongoose.model('MoversPackers', moversPackersSchema);

export default MoversPackers;
