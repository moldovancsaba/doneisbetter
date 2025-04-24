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
 */
export async function connectDB(): Promise<Mongoose> {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const uri = getMongoURI();

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
    const connection = await global.mongoose.promise;
    global.mongoose.conn = connection;
    return connection;
  } catch (error) {
    global.mongoose.promise = null;
    throw error;
  }
}

/**
 * Disconnects from MongoDB
 */
export async function disconnectDB(): Promise<void> {
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

