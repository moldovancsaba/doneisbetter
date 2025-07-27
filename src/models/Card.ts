import mongoose, { Schema } from "mongoose";
import { ICard } from "@/interfaces/Card";

const cardSchema = new Schema<ICard>(
  {
    md5: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, enum: ['text', 'media'], required: true },
    content: { type: String, required: true },
    created_by: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

export const Card = mongoose.models.Card || mongoose.model<ICard>("Card", cardSchema);
