import mongoose from 'mongoose';

/**
 * App-specific MongoDB connection manager.
 * Extends the core database functionality for app-specific needs.
 */

// Connection state tracking
let isConnecting = false;
let cachedConnection: typeof mongoose | null = null;
let connectionPromise: Promise<void> | null = null;
let connectionTimestamp: number | null = null;

// Connection options
const OPTIONS: mongoose.ConnectOptions = {
  bufferCommands: true,
  maxPoolSize: 10,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 10000
};

/**
 * Get MongoDB URI from environment
 */
function getMongoURI(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
  return uri;
}

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return existing connection if valid
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Prevent concurrent connections
  if (isConnecting && connectionPromise) {
    try {
      await connectionPromise;
      return mongoose;
    } catch (error) {
      // Connection failed, will try again below
      console.error('Error waiting for existing connection:', error);
    }
  }

  try {
    isConnecting = true;
    const uri = getMongoURI();

    connectionPromise = mongoose
      .connect(uri, OPTIONS)
      .then(() => {
        connectionTimestamp = Date.now();
        cachedConnection = mongoose;
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      });

    await connectionPromise;
    return mongoose;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  } finally {
    isConnecting = false;
    connectionPromise = null;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      cachedConnection = null;
      connectionTimestamp = null;
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
}

/**
 * Check if there is an active database connection
 */
export function isConnected(): boolean {
  return Boolean(cachedConnection) && mongoose.connection.readyState === 1;
}

export default mongoose;
