import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: [160, 'Card text must be 160 characters or less']
  },
  createdBy: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: {
    currentTime: () => new Date().toISOString()
  }
});

// Ensure proper ISO 8601 format with milliseconds
cardSchema.pre('save', function(next) {
  if (this.isNew) {
    this.createdAt = new Date().toISOString();
  }
  next();
});

// Create indexes for faster queries
cardSchema.index({ createdBy: 1 });
cardSchema.index({ createdAt: -1 });
cardSchema.index({ text: 'text' });

const Card = mongoose.models.Card || mongoose.model('Card', cardSchema);

export default Card;
