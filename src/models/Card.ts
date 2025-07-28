import mongoose, { Schema } from "mongoose";

const CardSchema = new Schema({
  uuid: { type: String, required: true, unique: true, index: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, default: 'text', required: true },
  content: {
    text: { type: String, required: true },
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
