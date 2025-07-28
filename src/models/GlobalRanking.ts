import mongoose, { Schema } from "mongoose";

const GlobalRankingSchema = new Schema({
  cardId: { type: String, required: true, unique: true, index: true },
  totalScore: { type: Number, default: 0, index: -1 }, // Descending for leaderboard
  appearanceCount: { type: Number, default: 0 },
  averageRank: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now, index: true }
});

export const GlobalRanking = mongoose.models.GlobalRanking || mongoose.model("GlobalRanking", GlobalRankingSchema);
