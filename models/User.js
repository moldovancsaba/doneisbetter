import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [200, 'Username is too long']
  },
  createdAt: {
    type: Date,
    default: () => new Date().toISOString()
  },
  lastLogin: {
    type: Date,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: {
    currentTime: () => new Date().toISOString()
  }
});

// Ensure proper ISO 8601 format with milliseconds
userSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.lastLogin = new Date().toISOString();
  }
  if (this.isNew) {
    this.createdAt = new Date().toISOString();
  }
  next();
});

// Indexes for performance
userSchema.index({ createdAt: -1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
