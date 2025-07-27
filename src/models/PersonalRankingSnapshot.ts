import mongoose, { Schema } from "mongoose";

const PersonalRankingSchema = new Schema({
  sessionId: { type: String, required: true, index: true },
  ranking: [{ type: String }], // Top 10 cards only for global calculation
  completedAt: { type: Date, default: Date.now, index: true },
  contributedToGlobal: { type: Boolean, default: false, index: true }
});

// Compound index for global ranking calculations
PersonalRankingSchema.index({ contributedToGlobal: 1, completedAt: -1 });

export const PersonalRankingSnapshot = mongoose.models.PersonalRankingSnapshot || mongoose.model("PersonalRankingSnapshot", PersonalRankingSchema);
