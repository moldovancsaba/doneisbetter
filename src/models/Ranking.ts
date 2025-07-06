import mongoose from 'mongoose';
import { connectDB } from '../lib/db';

// Define base interfaces for tracking
export interface ISwipeHistoryEntry {
  cardId: mongoose.Types.ObjectId;
  direction: 'left' | 'right';
  timestamp: string;  // ISO 8601 UTC with ms
  sessionId: string;
}

export interface IVoteHistoryEntry {
  winnerId: mongoose.Types.ObjectId;
  loserId: mongoose.Types.ObjectId;
  timestamp: string;  // ISO 8601 UTC with ms
  sessionId: string;
}

export interface IBattleHistoryEntry {
  opponent: mongoose.Types.ObjectId;
  outcome: 'won' | 'lost';
  ratingChange: number;
  timestamp: string;  // ISO 8601 UTC with ms
}

export interface IDeviceInfo {
  type: string;
  os: string;
  browser: string;
}

// Define Ranking interface
export interface IRanking {
  _id: mongoose.Types.ObjectId;
  cardId: mongoose.Types.ObjectId | any;  // Reference to Card
  votes: {
    left: number;
    right: number;
    total: number;
  };
  battles: {
    won: number;
    lost: number;
    total: number;
    history: IBattleHistoryEntry[];
  };
  rating: number;  // ELO-based rating
  createdAt: string;  // ISO 8601 UTC with ms
  swipeHistory: ISwipeHistoryEntry[];
  voteHistory: IVoteHistoryEntry[];
  userAgent: string;
  deviceInfo: IDeviceInfo;
  sessionDuration: number;
}

// Define schema with proper typing
const rankingSchema = new mongoose.Schema<IRanking>({
  cardId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Card' },
  votes: {
    left: { type: Number, required: true, default: 0 },
    right: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 }
  },
  battles: {
    won: { type: Number, required: true, default: 0 },
    lost: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    history: [{
      opponent: { type: mongoose.Schema.Types.ObjectId, required: true },
      outcome: { type: String, enum: ['won', 'lost'], required: true },
      ratingChange: { type: Number, required: true },
      timestamp: { type: String, required: true }  // ISO 8601 UTC with ms
    }]
  },
  rating: { type: Number, required: true, default: 1400 },  // Initial ELO rating
  createdAt: { type: String, required: true },  // ISO 8601 UTC with ms
  swipeHistory: [{
    cardId: { type: mongoose.Schema.Types.ObjectId, required: true },
    direction: { type: String, enum: ['left', 'right'], required: true },
    timestamp: { type: String, required: true },  // ISO 8601 UTC with ms
    sessionId: { type: String, required: true }
  }],
  voteHistory: [{
    winnerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    loserId: { type: mongoose.Schema.Types.ObjectId, required: true },
    timestamp: { type: String, required: true },  // ISO 8601 UTC with ms
    sessionId: { type: String, required: true }
  }],
  userAgent: { type: String, required: true },
  deviceInfo: {
    type: { type: String, required: true },
    os: { type: String, required: true },
    browser: { type: String, required: true }
  },
  sessionDuration: { type: Number, required: true, default: 0 }
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
