import mongoose from 'mongoose';
import { connectDB } from '../lib/db';

export interface ICard {
  _id: mongoose.Types.ObjectId;
  title: string;      // Card title
  description: string; // Card description
  imageUrl: string;   // Image URL
  rank?: number;      // Card's current rank
  battlesWon?: number;  // Number of battles won
  battlesLost?: number; // Number of battles lost
  createdAt: string;  // ISO 8601 UTC with ms
}

const cardSchema = new mongoose.Schema<ICard>({
  title: {
    type: String,
    required: true,
    default: () => 'Card ' + new Date().toISOString(),
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
  rank: {
    type: Number,
    required: false,
  },
  battlesWon: {
    type: Number,
    required: false,
    default: 0
  },
  battlesLost: {
    type: Number,
    required: false,
    default: 0
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => {
        // Validate imgbb.com URLs only
        return v.startsWith('https://i.ibb.co/') || v.startsWith('https://image.ibb.co/');
      },
      message: 'Only imgbb.com URLs are allowed'
    }
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
    required: true,
    validate: {
      validator: (v: string) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v),
      message: 'Timestamp must be in ISO 8601 format with milliseconds (YYYY-MM-DDTHH:mm:ss.sssZ)'
    }
  }
});

// Ensure createdAt is always in ISO 8601 format with milliseconds
cardSchema.pre('save', function(next) {
  if (this.createdAt) {
    this.createdAt = new Date(this.createdAt).toISOString();
  }
  next();
});

// Robust model registration
export const getCardModel = async () => {
  await connectDB();
  return mongoose.models.Card || mongoose.model<ICard>('Card', cardSchema, 'cards');
};

// Helper function for direct model access when connection is guaranteed
export const Card = () => {
  if (!mongoose.models.Card) {
    return mongoose.model<ICard>('Card', cardSchema, 'cards');
  }
  return mongoose.models.Card;
};
