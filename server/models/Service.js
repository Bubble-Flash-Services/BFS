import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 1000
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  image: {
    type: String,
    maxlength: 500
  },
  features: [{
    type: String,
    maxlength: 255
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Service', serviceSchema);
