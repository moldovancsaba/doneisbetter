import mongoose from 'mongoose';

const votePairSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false
  },
  sessionId: {
    type: String,
    required: true
  },
  card1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  card2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  timestamp: {
    type: Date,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: {
    currentTime: () => new Date().toISOString()
  }
});

// Ensure proper ISO 8601 format with milliseconds
votePairSchema.pre('save', function(next) {
  if (this.isNew) {
    this.votedAt = new Date().toISOString();
  }
  next();
});

// Create indexes for faster queries
votePairSchema.index({ userId: 1 });
votePairSchema.index({ votedAt: -1 });
votePairSchema.index({ card1: 1, card2: 1 });

const VotePair = mongoose.models.VotePair || mongoose.model('VotePair', votePairSchema);

export default VotePair;

