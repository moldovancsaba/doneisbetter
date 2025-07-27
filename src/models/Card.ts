import mongoose, { Schema } from "mongoose";
import { ICard } from "@/interfaces/Card";

const cardSchema = new Schema<ICard>(
  {
    md5: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, enum: ['image', 'text'], required: true },
    content: { type: String, required: true },
    translations: [
      {
        language: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    parentId: { type: String },
    projectId: { type: String },
    metadata: {
      aspectRatio: { type: Number },
      originalUrl: { type: String },
      language: { type: String },
    },
    swipe: { type: Number, default: null },
    ranking: { type: Number, default: null },
    swipeTimestamps: { type: [Date], default: [] },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Card = mongoose.models.Card || mongoose.model<ICard>("Card", cardSchema);
