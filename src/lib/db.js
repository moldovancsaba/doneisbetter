import mongoose from 'mongoose';

let isConnected = false; // Track connection status

export async function connectDB() {
  // If connection is already established, return early
  if (isConnected) {
    console.log('MongoDB is already connected.');
    return;
  }

  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set.');
    throw new Error('Database configuration error.');
  }

  try {
    // Attempt to connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Re-throw a more generic error for the action handler
    throw new Error('Failed to connect to database');
  }
}

