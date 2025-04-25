import mongoose, { Schema, Document, Model } from 'mongoose';
import { CardStatus } from '@/app/types/card'; // Assuming CardStatus type is defined here

// Extend mongoose Document
export interface CardDocument extends Document {
  content: string;
  status: CardStatus;
  order: number;
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
      enum: Object.values(CardStatus), // Use enum values from CardStatus type
      default: CardStatus.TODO,
      required: true,
    },
    order: {
      type: Number,
      default: 0, // Default order
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
