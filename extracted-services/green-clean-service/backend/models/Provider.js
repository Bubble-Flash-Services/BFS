import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    maxlength: 15
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    maxlength: 100
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
  verified: {
    type: Boolean,
    default: false
  },
  servicesOffered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GreenService'
  }],
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 5
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  documents: {
    idProof: {
      type: String,
      maxlength: 500
    },
    photo: {
      type: String,
      maxlength: 500
    }
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
providerSchema.index({ phone: 1 });
providerSchema.index({ available: 1, isActive: 1 });
providerSchema.index({ lat: 1, lng: 1 });

export default mongoose.model('Provider', providerSchema);
