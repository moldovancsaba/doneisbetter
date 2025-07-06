import mongoose from 'mongoose';
import { connectDB } from '../lib/db';

// Define Ranking interface
export interface IRanking {
  _id: mongoose.Types.ObjectId;
  cardId: mongoose.Types.ObjectId | any;  // Reference to Card
  votes: {
    left: number;
    right: number;
    total: number;
  };
  createdAt: string;  // ISO 8601 UTC with ms
}

// Define schema with proper typing
const rankingSchema = new mongoose.Schema<IRanking>({
  cardId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Card' },
  votes: {
    left: { type: Number, required: true, default: 0 },
    right: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 }
  },
  createdAt: { type: String, required: true }  // ISO 8601 UTC with ms
});

// Apply robust model registration pattern
export const getRankingModel = async () => {
  // No need to connect here as it's handled in the route
  return mongoose.models.Ranking || mongoose.model<IRanking>('Ranking', rankingSchema, 'rankings');
};

export const Ranking = () => {
  if (!mongoose.models.Ranking) {
    return mongoose.model<IRanking>('Ranking', rankingSchema, 'rankings');
  }
  return mongoose.models.Ranking;
};
