const mongoose = require('mongoose');

/**
 * Vote Schema
 * Represents a vote cast on an image card
 * - imageId: Reference to the ImageCard being voted on
 * - vote: The vote value (+1 or -1)
 * - createdAt: Timestamp of when the vote was cast (ISO 8601 with milliseconds)
 */
const voteSchema = new mongoose.Schema({
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImageCard',
    required: true
  },
  vote: {
    type: Number,
    required: true,
    enum: [1, -1], // Only allow +1 or -1 votes
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  createdAt: {
    type: Date,
    default: () => new Date().toISOString(),
    required: true
  }
});

// Index for efficient lookups and aggregation
voteSchema.index({ imageId: 1, createdAt: -1 });

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
