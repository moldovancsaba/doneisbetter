import mongoose from 'mongoose';

const voteRankSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  rank: {
    type: Number,
    required: true,
    default: 0
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure each card has only one rank entry
voteRankSchema.index({ cardId: 1 }, { unique: true });

export default mongoose.models.VoteRank || mongoose.model('VoteRank', voteRankSchema);

