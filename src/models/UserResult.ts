import mongoose, { Schema } from "mongoose";
import { IUserResult } from "@/interfaces/UserResult";

const userResultSchema = new Schema<IUserResult>(
  {
    user_md5: { type: String, required: true },
    session_id: { type: String, required: true },
    swipe_log: [
      {
        card_id: { type: String, required: true },
        action: { type: String, enum: ['left', 'right'], required: true },
        timestamp: { type: Date, required: true },
      },
    ],
    vote_log: [
      {
        left_card_id: { type: String, required: true },
        right_card_id: { type: String, required: true },
        winner: { type: String, required: true },
        timestamp: { type: Date, required: true },
      },
    ],
    final_ranking: [{ type: String }],
    device_info: {
      user_agent: { type: String },
      screen_width: { type: Number },
      screen_height: { type: Number },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'completed_at' },
  }
);

export const UserResult = mongoose.models.UserResult || mongoose.model<IUserResult>("UserResult", userResultSchema);
