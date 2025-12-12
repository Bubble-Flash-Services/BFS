import mongoose from 'mongoose';

const vehicleAccessorySchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['car', 'bike', 'common'],
    required: true
  },
  subcategory: {
    type: String,
    required: true,
    maxlength: 100
  },
  name: {
    type: String,
    required: true,
    maxlength: 200
  },
  serviceName: {
    type: String,
    maxlength: 200,
    default: 'accessories'
  },
  description: {
    type: String,
    maxlength: 1000
  },
  shortDescription: {
    type: String,
    maxlength: 255
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 100,
    min: 0
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [{
    type: String,
    maxlength: 500
  }],
  features: [{
    type: String,
    maxlength: 255
  }],
  specifications: {
    type: Map,
    of: String
  },
  variants: [{
    name: String,
    priceModifier: Number,
    inStock: {
      type: Boolean,
      default: true
    }
  }],
  tags: [{
    type: String,
    maxlength: 50
  }],
  isNew: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
vehicleAccessorySchema.index({ category: 1, isActive: 1 });
vehicleAccessorySchema.index({ name: 'text', description: 'text' });

export default mongoose.model('VehicleAccessory', vehicleAccessorySchema);
