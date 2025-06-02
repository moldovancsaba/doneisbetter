import mongoose from 'mongoose';

const voteRankSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  userId: {
    type: String,
    required: false
  },
  rank: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Date,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: {
    currentTime: () => new Date().toISOString()
  }
});

// Ensure proper ISO 8601 format with milliseconds
voteRankSchema.pre('save', function(next) {
  if (this.isModified('rank')) {
    this.updatedAt = new Date().toISOString();
  }
  next();
});

// Create indexes for faster queries
voteRankSchema.index({ cardId: 1 }, { unique: true });
voteRankSchema.index({ userId: 1 });
voteRankSchema.index({ rank: -1 });
voteRankSchema.index({ updatedAt: -1 });

const VoteRank = mongoose.models.VoteRank || mongoose.model('VoteRank', voteRankSchema);

export default VoteRank;
