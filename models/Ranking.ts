import { Schema, model, models, Document, Model } from 'mongoose';

// Define the interface for Ranking document
export interface IRanking extends Document {
  cardId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  score: number;
  level: number;
  category: string;
  achievements: string[];
  progressiveStats: {
    winStreak: number;
    totalWins: number;
    totalBattles: number;
    rankProgress: number; // Progress to next rank (0-100)
    skillRating: number; // ELO-like rating
    consistency: number; // Performance consistency (0-100)
  };
  rankHistory: Array<{
    rank: number;
    date: Date;
    reason: string;
  }>;
  seasonalStats: {
    season: string;
    highestRank: number;
    totalPoints: number;
    achievements: string[];
  };
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Ranking schema
const RankingSchema = new Schema<IRanking>(
  {
    cardId: {
      type: Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    category: {
      type: String,
      required: true,
    },
    achievements: [{
      type: String,
    }],
    progressiveStats: {
      winStreak: {
        type: Number,
        default: 0,
        min: 0
      },
      totalWins: {
        type: Number,
        default: 0,
        min: 0
      },
      totalBattles: {
        type: Number,
        default: 0,
        min: 0
      },
      rankProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      skillRating: {
        type: Number,
        default: 1000, // Starting ELO rating
        min: 0
      },
      consistency: {
        type: Number,
        default: 50,
        min: 0,
        max: 100
      }
    },
    rankHistory: [{
      rank: Number,
      date: Date,
      reason: String
    }],
    seasonalStats: {
      season: {
        type: String,
        required: true
      },
      highestRank: {
        type: Number,
        default: 0
      },
      totalPoints: {
        type: Number,
        default: 0
      },
      achievements: [String]
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
RankingSchema.index({ score: -1 }); // Descending index on score
RankingSchema.index({ category: 1, score: -1 }); // Compound index for category-based rankings
RankingSchema.index({ 'progressiveStats.skillRating': -1 }); // Index for skill-based matchmaking
RankingSchema.index({ 'seasonalStats.season': 1, 'seasonalStats.totalPoints': -1 }); // Index for seasonal leaderboards

// Function to get or create the Ranking model
export const getRankingModel = async (): Promise<Model<IRanking>> => {
  return models.Ranking || model<IRanking>('Ranking', RankingSchema);
};
