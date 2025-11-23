import mongoose from 'mongoose';

const moversPackersSchema = new mongoose.Schema({
  itemType: {
    type: String,
    required: true,
    enum: ['bike', 'scooty', 'fridge', 'washing-machine', 'sofa', 'tv', 'mattress', 'cupboard', 'table'],
    index: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 200
  },
  icon: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  baseDistance: {
    type: Number,
    default: 5, // 0-5 km base distance
    min: 0
  },
  includes: [{
    type: String,
    maxlength: 255
  }],
  notIncludes: [{
    type: String,
    maxlength: 255
  }],
  howItsDone: {
    type: String,
    maxlength: 500
  },
  distanceCharges: [{
    rangeStart: {
      type: Number,
      required: true
    },
    rangeEnd: {
      type: Number,
      required: true
    },
    charge: {
      type: Number,
      required: true
    }
  }],
  active: {
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

// Indexes for faster queries
moversPackersSchema.index({ itemType: 1, active: 1 });
moversPackersSchema.index({ sortOrder: 1 });

export default mongoose.model('MoversPackers', moversPackersSchema);
