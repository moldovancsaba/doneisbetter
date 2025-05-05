import mongoose, { Schema, Document, Model } from 'mongoose';
import { CardStatus } from '@/app/types/card'; // Assuming CardStatus type is defined here

// Enum for card statuses
export enum CardStatusEnum {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

// Extend mongoose Document
export interface CardDocument extends Document {
  content: string;
  status: CardStatus;
  order: number;
  importance: boolean;
  urgency: boolean;
  // Removed user field
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

const CardSchema = new Schema<CardDocument>(
  {
    content: {
      type: String,
      required: [true, 'Card content is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(CardStatusEnum), // Use enum values from CardStatusEnum
      default: CardStatusEnum.TODO,
      required: true,
    },
    order: {
      type: Number,
      default: 0, // Default order
    },
    importance: {
      type: Boolean,
      default: false,
      required: true,
    },
    urgency: {
      type: Boolean,
      default: false,
      required: true,
    },
    // Removed user reference:
    // user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true, // Index for querying deleted cards
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for sorting by order and creation date
CardSchema.index({ order: 1, createdAt: -1 });
// Index for sorting deleted items
CardSchema.index({ deletedAt: -1 });

// Prevent recompilation of the model if it already exists
const CardModel = (mongoose.models.Card as Model<CardDocument>) || mongoose.model<CardDocument>('Card', CardSchema);

// Helper function to ensure the model is available
export async function getCardModel(): Promise<typeof CardModel> {
  // Database connection is expected to be handled elsewhere (e.g., in connectDB)
  return CardModel;
}

export default CardModel;
