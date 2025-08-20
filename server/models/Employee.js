import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  address: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true,
    enum: ['car', 'bike', 'laundry', 'all']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  profileImage: String,
  
  // Employment Details
  salary: {
    type: Number,
    default: 0
  },
  commissionRate: {
    type: Number,
    default: 15 // 15% commission
  },
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  
  // Bank Details
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolder: String
  },
  
  // Documents
  documents: {
    aadharVerified: { type: Boolean, default: false },
    panVerified: { type: Boolean, default: false },
    licenseVerified: { type: Boolean, default: false },
    aadharNumber: String,
    panNumber: String,
    licenseNumber: String
  },
  
  // Performance Metrics
  stats: {
    totalAssignments: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    onTimeCompletion: { type: Number, default: 0 },
    customerSatisfaction: { type: Number, default: 0 }
  },
  
  // Authentication
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Admin who created this employee
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Indexes for better performance (only for fields without unique: true)
EmployeeSchema.index({ specialization: 1 });
EmployeeSchema.index({ isActive: 1 });

// Virtual for checking if account is locked
EmployeeSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
EmployeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate unique employee ID
EmployeeSchema.pre('save', async function(next) {
  if (this.isNew && !this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `BF-EMP-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Method to compare password
EmployeeSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to handle login attempts
EmployeeSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
EmployeeSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Method to update stats
EmployeeSchema.methods.updateStats = function(updates) {
  return this.updateOne({ $set: { stats: { ...this.stats, ...updates } } });
};

export default mongoose.model('Employee', EmployeeSchema);