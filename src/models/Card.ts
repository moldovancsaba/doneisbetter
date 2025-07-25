import mongoose, { Schema, Document } from "mongoose";

interface ICard extends Document {
  md5: string;
  slug: string;
  type: 'image' | 'text';
  content: string;
  translations?: { language: string; content: string }[];
  parentId?: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    aspectRatio?: number;
    originalUrl?: string;
    language?: string;
  };
}

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
  },
  {
    timestamps: true,
  }
);

export const Card = mongoose.models.Card || mongoose.model<ICard>("Card", cardSchema);
