import mongoose from 'mongoose';

const mobileFixPricingSchema = new mongoose.Schema({
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhoneModel',
    required: true
  },
  serviceType: {
    type: String,
    enum: [
      'screen-replacement',
      'battery-replacement',
      'charging-port-replacement',
      'speaker-microphone-replacement',
      'camera-glass-replacement',
      'phone-cleaning-diagnostics'
    ],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  estimatedTime: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

mobileFixPricingSchema.index({ modelId: 1, serviceType: 1 }, { unique: true });
mobileFixPricingSchema.index({ isActive: 1 });

const MobileFixPricing = mongoose.model('MobileFixPricing', mobileFixPricingSchema);

export default MobileFixPricing;
