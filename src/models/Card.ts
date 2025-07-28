import mongoose, { Schema } from "mongoose";

const CardSchema = new Schema({
  uuid: { type: String, required: true, unique: true, index: true },
  type: { type: String, enum: ['text', 'media'], required: true },
  content: {
    text: { type: String },
    mediaUrl: { type: String }
  },
  title: { type: String, default: '' },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

CardSchema.pre('save', function(next) {
  if (this.content && this.type === 'text' && !this.content.text) {
    next(new Error('Text content is required for text cards'));
  } else if (this.content && this.type === 'media' && !this.content.mediaUrl) {
    next(new Error('Media URL is required for media cards'));
  } else {
    next();
  }
});

// Compound Index for performance
CardSchema.index({ isActive: 1, createdAt: -1 });

export const Card = mongoose.models.Card || mongoose.model("Card", CardSchema);
