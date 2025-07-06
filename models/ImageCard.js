const mongoose = require('mongoose');

/**
 * ImageCard Schema
 * Represents an image card in the system with voting capability
 * - url: The URL of the image
 * - createdAt: Timestamp of when the card was created (ISO 8601 with milliseconds)
 * - votes: Virtual field that will be populated from the Vote collection
 */
const imageCardSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: () => new Date().toISOString(),
    required: true
  }
}, {
  // Enable virtuals
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for votes
imageCardSchema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'imageId'
});

const ImageCard = mongoose.model('ImageCard', imageCardSchema);

module.exports = ImageCard;
