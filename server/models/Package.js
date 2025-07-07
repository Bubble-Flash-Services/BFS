import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 1000
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  duration: {
    type: Number, // in minutes
    min: 0
  },
  features: [{
    type: String,
    maxlength: 255
  }],
  packageType: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'deluxe'],
    default: 'basic'
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'suv', 'truck', 'all'],
    default: 'all'
  },
  image: {
    type: String,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  // For laundry services - specific item types and quantities
  laundryItems: [{
    itemType: {
      type: String,
      required: true
    },
    maxQuantity: {
      type: Number,
      default: 1
    },
    pricePerItem: {
      type: Number,
      min: 0
    }
  }],
  // Discount information
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Add-ons included in package
  includedAddOns: [{
    addOnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AddOn'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  // Terms and conditions specific to this package
  terms: [{
    type: String,
    maxlength: 500
  }],
  // Availability settings
  availability: {
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    timeSlots: [{
      startTime: String,
      endTime: String
    }]
  }
}, {
  timestamps: true
});

// Index for better query performance
packageSchema.index({ service: 1, isActive: 1 });
packageSchema.index({ packageType: 1, vehicleType: 1 });

// Virtual for discount amount
packageSchema.virtual('discountAmount').get(function() {
  if (this.originalPrice && this.price < this.originalPrice) {
    return this.originalPrice - this.price;
  }
  return 0;
});

// Virtual for savings percentage
packageSchema.virtual('savingsPercentage').get(function() {
  if (this.originalPrice && this.price < this.originalPrice) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

export default mongoose.model('Package', packageSchema);
