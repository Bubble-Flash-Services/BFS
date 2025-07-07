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
      enum: ['car', 'bike', 'suv', 'hatchback', 'sedan']
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

    totalAmount += itemTotal;
    totalItems += item.quantity;
  });

  this.totalAmount = totalAmount;
  this.totalItems = totalItems;
  next();
});

export default mongoose.model('Cart', cartSchema);
