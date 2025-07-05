import mongoose from 'mongoose';

const RankingSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Card'
  },
  sessionId: {
    type: String,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true,
    default: 1.0
  },
  timestamp: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v),
      message: 'Timestamp must be in ISO 8601 format with milliseconds (YYYY-MM-DDTHH:mm:ss.sssZ)'
    }
  }
});

RankingSchema.pre('save', function(next) {
  if (!this.timestamp) {
    this.timestamp = new Date().toISOString();
  }
  next();
});

// Index for efficient ranking queries
RankingSchema.index({ sessionId: 1, rank: 1 });
RankingSchema.index({ cardId: 1, weight: -1 });

export default mongoose.models.Ranking || mongoose.model('Ranking', RankingSchema);
