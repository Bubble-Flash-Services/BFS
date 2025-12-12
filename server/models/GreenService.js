import mongoose from 'mongoose';

const greenServiceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['home-cleaning', 'sofa-carpet', 'bathroom-kitchen', 'office-cleaning'],
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  serviceName: {
    type: String,
    maxlength: 200,
    default: 'green&clean'
  },
  description: {
    type: String,
    maxlength: 1000
  },
  durationMinutes: {
    type: Number,
    required: true,
    min: 0
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  extras: [{
    name: {
      type: String,
      required: true,
      maxlength: 100
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  active: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String,
    maxlength: 500
  }],
  features: [{
    type: String,
    maxlength: 255
  }],
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for faster queries
greenServiceSchema.index({ category: 1, active: 1 });
greenServiceSchema.index({ sortOrder: 1 });

export default mongoose.model('GreenService', greenServiceSchema);
