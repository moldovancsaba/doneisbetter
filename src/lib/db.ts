// src/lib/db.ts
// Connects to MongoDB using Mongoose and ensures a stable reusable connection

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

/**
 * Connects to the MongoDB database using Mongoose
 * Avoids duplicate connections in dev mode
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  if (!MONGO_URI) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "doneisbetter",
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};
