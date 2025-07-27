import mongoose, { Schema } from "mongoose";
import { IUser } from "@/interfaces/User";

const userSchema = new Schema<IUser>(
  {
    md5: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
