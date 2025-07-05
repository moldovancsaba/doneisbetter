import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['swipe_left', 'swipe_right', 'vote_win', 'vote_lose', 'view_ranking']
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Card'
  },
  sessionId: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v),
      message: 'Timestamp must be in ISO 8601 format with milliseconds (YYYY-MM-DDTHH:mm:ss.sssZ)'
    }
  },
  source: {
    type: String,
    required: true
  }
});

ActivitySchema.pre('save', function(next) {
  if (!this.timestamp) {
    this.timestamp = new Date().toISOString();
  }
  next();
});

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
