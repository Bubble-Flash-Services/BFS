import mongoose from 'mongoose';

const serviceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  image: {
    type: String,
    maxlength: 500
  },
  icon: {
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
  }
}, {
  timestamps: true
});

export default mongoose.model('ServiceCategory', serviceCategorySchema);
