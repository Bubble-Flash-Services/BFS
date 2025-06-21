import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for Google users
  image: { type: String }, // Google image or null
  provider: { type: String, default: 'local' }, // 'local' or 'google'
  googleId: { type: String },
});

export default mongoose.model('User', UserSchema);
