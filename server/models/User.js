import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    maxlength: 255
  },
  email: { 
    type: String, 
    required: false, 
    unique: true, 
    sparse: true
  },
  phone: { 
    type: String, 
    required: false, 
    unique: true, 
    sparse: true
  },
  password: { 
    type: String 
  }, // Not required for Google users
  profileImage: { 
    type: String,
    maxlength: 500
  },
  provider: { 
    type: String, 
    default: 'local',
    enum: ['local', 'google']
  },
  googleId: { 
    type: String,
    unique: true,
    sparse: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  // Forgot password fields
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  // OTP fields
  emailOTP: { type: String },
  emailOTPExpires: { type: Date },
  phoneOTP: { type: String },
  phoneOTPExpires: { type: Date },
  // Basic address field for quick access
  address: { 
    type: String,
    maxlength: 500
  },
  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
    }
  },
  // Analytics
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before save if modified
UserSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
