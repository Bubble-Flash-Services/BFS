import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, unique: false }, // unique removed
  phone: { type: String, required: false, unique: true, sparse: true }, // add phone unique
  password: { type: String }, // Not required for Google users
  image: { type: String }, // Google image or null
  provider: { type: String, default: 'local' }, // 'local' or 'google'
  googleId: { type: String },
  // Forgot password fields
  resetToken: { type: String },
  resetTokenExpires: { type: Date }
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
