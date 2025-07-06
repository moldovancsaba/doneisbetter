import mongoose from 'mongoose';

// Track connection status
let isConnected = false;

/**
 * Establishes a connection to MongoDB using environment variables.
 * Reuses existing connection if already established.
 */
export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  // Check for MongoDB URI
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = !!db.connections[0].readyState;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

/**
 * Validates database connection and ensures required models are registered.
 * This should be called before any database operations to ensure safety.
 */
export const validateConnection = async () => {
  if (!isConnected) {
    await connectDB();
  }
  
  // Verify models are registered
  try {
    const Card = mongoose.models.Card;
    const Ranking = mongoose.models.Ranking;
    if (!Card || !Ranking) {
      throw new Error('Required models not registered');
    }
  } catch (error) {
    console.error('Model validation failed:', error);
    throw error;
  }
};

/**
 * Gracefully closes the database connection.
 * Should be called when shutting down the application.
 */
export const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
};

// Export connection status checker
export const getIsConnected = () => isConnected;
