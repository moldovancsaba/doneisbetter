import mongoose from 'mongoose';

/**
 * MongoDB connection handler with robust error management and logging
 * Establishes connection to MongoDB instance using environment variables
 */
export async function connect(): Promise<typeof mongoose> {
  try {
    // Use environment variable for connection string
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MongoDB connection URI not found in environment variables');
    }

    if (mongoose.connection.readyState === 1) {
      console.info('MongoDB: Reusing existing connection');
      return mongoose;
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.info(`MongoDB: Successfully connected to ${conn.connection.host}`);
    
    // Set up connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB: Connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB: Disconnected from database');
    });

    mongoose.connection.on('reconnected', () => {
      console.info('MongoDB: Reconnected to database');
    });

    return conn;
  } catch (error) {
    console.error('MongoDB: Connection failed:', error);
    // Re-throw to allow handling by caller
    throw error;
  }
}
