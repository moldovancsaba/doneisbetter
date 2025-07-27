import mongoose, { Schema } from "mongoose";

const CardSchema = new Schema({
  uuid: { type: String, required: true, unique: true, index: true },
  type: { type: String, enum: ['text', 'media'], required: true },
  content: {
    text: { type: String, required: function() { return this.type === 'text'; } },
    mediaUrl: { type: String, required: function() { return this.type === 'media'; } }
  },
  title: { type: String, default: '' },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

// Compound Index for performance
CardSchema.index({ isActive: 1, createdAt: -1 });

export const Card = mongoose.models.Card || mongoose.model("Card", CardSchema);
