import mongoose from 'mongoose';

const votePairSchema = new mongoose.Schema({
  card1Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  card2Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.VotePair || mongoose.model('VotePair', votePairSchema);

