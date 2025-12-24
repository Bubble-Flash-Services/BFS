import mongoose from 'mongoose';

const phoneModelSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhoneBrand',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

phoneModelSchema.index({ brandId: 1, name: 1 });
phoneModelSchema.index({ isActive: 1 });

const PhoneModel = mongoose.model('PhoneModel', phoneModelSchema);

export default PhoneModel;
