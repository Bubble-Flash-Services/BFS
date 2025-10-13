import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  lat: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  lng: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  address: {
    type: String,
    required: true,
    maxlength: 500
  },
  city: {
    type: String,
    required: true,
    maxlength: 100,
    default: 'Bengaluru'
  },
  phone: {
    type: String,
    required: true,
    maxlength: 15
  },
  isActive: {
    type: Boolean,
    default: true
  },
  operatingHours: {
    open: {
      type: String,
      default: '09:00'
    },
    close: {
      type: String,
      default: '20:00'
    }
  }
}, {
  timestamps: true
});

// Index for geospatial queries
branchSchema.index({ lat: 1, lng: 1 });

export default mongoose.model('Branch', branchSchema);
