import mongoose, { Schema } from "mongoose";

const cardSchema = new Schema(
  {
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Card = mongoose.models.Card || mongoose.model("Card", cardSchema);
