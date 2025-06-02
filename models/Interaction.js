import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  // Support both userId (for authenticated users) and sessionId (for anonymous users)
  userId: {
    type: String,
    required: false // Changed to false since we might use sessionId instead
  },
  sessionId: {
    type: String,
    required: false // Required if userId is not provided
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  type: {
    type: String,
    enum: ['swipe', 'vote'],
    required: true
  },
  action: {
    type: String,
    enum: ['left', 'right', 'up', 'down', 'win', 'lose'], // Added win/lose for voting outcomes
    required: true
  },
  // For vote interactions, can reference the opposing card
  againstCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: false
  },
  createdAt: {
    type: Date,
    default: () => new Date().toISOString(), // ISO 8601 with milliseconds: 2025-04-13T12:34:56.789Z
    get: (date) => date.toISOString() // Format when retrieving
  }
}, {
  timestamps: true // Automatically add updatedAt
});

// Add validation to ensure either userId or sessionId is provided
interactionSchema.pre('validate', function(next) {
  if (!this.userId && !this.sessionId) {
    next(new Error('Either userId or sessionId is required'));
  } else {
    next();
  }
});

// Format timestamps to ISO 8601 with milliseconds
interactionSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.createdAt) ret.createdAt = new Date(ret.createdAt).toISOString();
    if (ret.updatedAt) ret.updatedAt = new Date(ret.updatedAt).toISOString();
    return ret;
  }
});

const Interaction = mongoose.models.Interaction || mongoose.model('Interaction', interactionSchema);

export { Interaction };
export default Interaction;
