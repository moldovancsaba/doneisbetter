import mongoose, { Schema } from "mongoose";

const SessionSchema = new Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  status: {
    type: String,
    enum: ['active', 'idle', 'completed', 'expired'],
    default: 'active',
    index: true
  },
  deck: [{ type: String, ref: 'Card' }], // Array of card UUIDs
  createdAt: { type: Date, default: Date.now, index: true },
  lastActivity: { type: Date, default: Date.now, index: true },
  completedAt: { type: Date, default: null },
  expiresAt: { type: Date, required: true, index: true },

  swipes: [{
    cardId: { type: String, required: true },
    direction: { type: String, enum: ['left', 'right'], required: true },
    timestamp: { type: Date, default: Date.now }
  }],

  votes: [{
    cardA: { type: String, required: true },
    cardB: { type: String, required: true },
    winner: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],

  personalRanking: [{ type: String }] // Ordered array of card UUIDs
});

// TTL Index for automatic cleanup
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.models.Session || mongoose.model("Session", SessionSchema);
