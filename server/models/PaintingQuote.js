import mongoose from 'mongoose';

const paintingQuoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Service Name
  serviceName: {
    type: String,
    default: 'painting'
  },
  
  // Personal Information
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  
  // Property Details
  propertyType: {
    type: String,
    enum: ['apartment', 'villa', 'independent-house', 'office', 'shop'],
    required: true
  },
  area: {
    type: Number,
    required: true,
    min: 1
  },
  address: {
    type: String,
    required: true
  },
  
  // Service Requirements
  serviceType: {
    type: String,
    enum: ['new-wall', 'repainting', 'texture', 'designer', 'touch-up', 'full-home'],
    required: true
  },
  paintBrand: {
    type: String,
    enum: ['asian-paints', 'berger', 'dulux', 'nerolac', 'no-preference'],
    default: 'no-preference'
  },
  colorPreferences: String,
  additionalRequirements: String,
  
  // Painting Assistance Partner - Size Evaluation (Charged Service)
  sizeEvaluationAssistance: {
    required: { type: Boolean, default: false },
    charge: { type: Number, default: 500 } // ₹500 charge for professional size evaluation
  },
  
  // Accessories
  accessories: [{
    name: String,
    quantity: { type: Number, default: 1 },
    price: Number
  }],
  
  // Photos
  photos: [{
    url: String,
    publicId: String
  }],
  
  // Inspection Booking
  inspectionDate: Date,
  inspectionTime: String,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'contacted', 'quoted', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Quote Details (filled by admin)
  quotedAmount: Number,
  quotedDetails: String,
  
  // Admin Notes
  adminNotes: String,
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'advance-paid', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  
  // Service completion
  completionDate: Date,
  customerFeedback: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Index for efficient queries
paintingQuoteSchema.index({ userId: 1, createdAt: -1 });
paintingQuoteSchema.index({ status: 1 });
paintingQuoteSchema.index({ inspectionDate: 1 });

const PaintingQuote = mongoose.model('PaintingQuote', paintingQuoteSchema);

export default PaintingQuote;
