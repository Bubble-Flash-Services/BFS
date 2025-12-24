import mongoose from 'mongoose';

const phoneBrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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

phoneBrandSchema.index({ name: 1 });
phoneBrandSchema.index({ isActive: 1 });

const PhoneBrand = mongoose.model('PhoneBrand', phoneBrandSchema);

export default PhoneBrand;
