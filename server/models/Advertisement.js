import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['car', 'bike', 'helmet', 'laundry'],
    lowercase: true
  },
  // Advertisement media options
  mediaType: {
    type: String,
    required: true,
    enum: ['image', 'color'],
    default: 'color'
  },
  // For image type
  imageUrl: {
    type: String,
    required: function() {
      return this.mediaType === 'image';
    }
  },
  // For color type
  backgroundColor: {
    type: String,
    required: function() {
      return this.mediaType === 'color';
    },
    default: '#4F46E5'
  },
  gradientColors: {
    from: {
      type: String,
      default: '#4F46E5'
    },
    to: {
      type: String,
      default: '#7C3AED'
    }
  },
  // Advertisement content styling
  textColor: {
    type: String,
    default: '#FFFFFF'
  },
  // Advertisement links and actions
  actionType: {
    type: String,
    enum: ['link', 'phone', 'email', 'whatsapp'],
    default: 'link'
  },
  actionValue: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: 'Learn More'
  },
  // Display settings
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
advertisementSchema.index({ serviceType: 1, isActive: 1, priority: -1 });
advertisementSchema.index({ startDate: 1, endDate: 1 });

// Virtual for checking if ad is currently active
advertisementSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.isActive && this.startDate <= now && this.endDate >= now;
});

export default mongoose.model('Advertisement', advertisementSchema);