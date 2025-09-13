import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    // UI display fields (not required to resolve DB service):
    name: { type: String }, // alias for serviceName for FE compatibility
    serviceName: { type: String },
    image: { type: String },
    packageName: { type: String },
    packageDetails: { type: mongoose.Schema.Types.Mixed }, // carries basePrice, addons, features, etc.
    includedFeatures: [{ type: String }],
    // Classification fields to keep grouping consistent on FE
    type: { type: String }, // e.g., 'car-wash', 'bike-wash', 'helmet-wash', 'monthly_plan', 'accessory'
    category: { type: String }, // e.g., 'Sedans', 'Hatchbacks', 'Helmet Wash'
    // Non-DB add-ons coming from UI (no AddOnId)
    uiAddOns: [{
      name: { type: String },
      price: { type: Number, min: 0 },
      quantity: { type: Number, min: 1, default: 1 }
    }],
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    addOns: [{
      addOnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddOn',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    // For laundry items
    laundryItems: [{
      itemType: {
        type: String,
        enum: ['shirt', 'pant', 'dress', 'jacket', 'sweater', 'other']
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      pricePerItem: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    vehicleType: {
      type: String,
  enum: ['all', 'car', 'bike', 'suv', 'hatchback', 'sedan', 'commuter', 'cruiser', 'sports', 'scooter', 'motorbike']
    },
    specialInstructions: {
      type: String,
      maxlength: 500
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  totalItems: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  // Tax / GST fields
  subtotalAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 0.18 // 18% GST
  },
  taxAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  let totalAmount = 0;
  let totalItems = 0;

  this.items.forEach(item => {
    let itemTotal = item.price * item.quantity;
    
    // Add add-ons cost
    if (item.addOns && item.addOns.length > 0) {
      item.addOns.forEach(addOn => {
        itemTotal += addOn.price * addOn.quantity;
      });
    }

    // Add laundry items cost
    if (item.laundryItems && item.laundryItems.length > 0) {
      item.laundryItems.forEach(laundryItem => {
        itemTotal += laundryItem.pricePerItem * laundryItem.quantity;
      });
    }

    // Add UI-only add-ons cost
    if (item.uiAddOns && item.uiAddOns.length > 0) {
      item.uiAddOns.forEach(ui => {
        itemTotal += (ui.price || 0) * (ui.quantity || 1);
      });
    }

    totalAmount += itemTotal;
    totalItems += item.quantity;
  });

  // Store raw subtotal before tax
  this.subtotalAmount = totalAmount;
  this.totalItems = totalItems;

  // Compute tax & grand total
  const taxRate = typeof this.taxRate === 'number' ? this.taxRate : 0.18;
  const taxAmount = parseFloat((this.subtotalAmount * taxRate).toFixed(2));
  this.taxAmount = taxAmount;
  this.totalAmount = parseFloat((this.subtotalAmount + taxAmount).toFixed(2));
  next();
});

export default mongoose.model('Cart', cartSchema);
