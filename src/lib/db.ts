import mongoose, { Mongoose } from 'mongoose';

/**
 * Global connection object that maintains the mongoose connection across requests
 */
declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

// Initialize global connection object if not exists
// This prevents multiple connections during development with hot-reloading
if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null
  };
}

/**
 * Connection options for MongoDB
 */
const options: mongoose.ConnectOptions = {
  bufferCommands: true,
};

/**
 * Validates that the MongoDB connection string is set in environment variables
 * @returns The MongoDB connection string
 * @throws Error if MONGODB_URI is not set
 */
function getMongoURI(): string {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }
  
  return uri;
}

/**
 * Connects to MongoDB and caches the connection
 * @returns A Promise that resolves to the mongoose connection
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // If we already have a connection, return it
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  // If a connection is in progress, wait for it
  if (!global.mongoose.promise) {
    const uri = getMongoURI();

    // Create new connection
    global.mongoose.promise = mongoose
      .connect(uri, options)
      .then((connection) => {
        console.log('Connected to MongoDB');
        return connection;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        global.mongoose.promise = null;
        throw error;
      });
  }

  try {
    // Wait for the connection to complete
    const connection = await global.mongoose.promise;
    global.mongoose.conn = connection;
    return connection;
  } catch (error) {
    // Reset promise so we can retry on next request
    global.mongoose.promise = null;
    throw error;
  }
}

/**
 * Disconnects from MongoDB
 * Useful for tests and cleanup
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (global.mongoose.conn) {
    await mongoose.disconnect();
    global.mongoose.conn = null;
    global.mongoose.promise = null;
    console.log('Disconnected from MongoDB');
  }
}

/**
 * Helper to determine if we're connected to the database
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

