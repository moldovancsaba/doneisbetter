import mongoose, { Mongoose } from 'mongoose';
import { DatabaseError, DatabaseErrorType } from './errors/DatabaseError';

/**
 * Global connection object that maintains the mongoose connection across requests
 */
declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
    connectionTimestamp?: number;
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
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
  serverSelectionTimeoutMS: 10000, // 10 seconds
};

/**
 * Validates that the MongoDB connection string is set in environment variables
 */
function getMongoURI(): string {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new DatabaseError({
      message: 'Please define the MONGODB_URI environment variable inside .env.local',
      type: DatabaseErrorType.CONNECTION,
      statusCode: 500
    });
  }
  
  return uri;
}

/**
 * Connects to MongoDB and caches the connection
 */
export async function connectDB(): Promise<Mongoose> {
  try {
    // Return existing connection if available
    if (global.mongoose.conn) {
      // Check if connection is still valid (occasionally check if stale)
      const now = Date.now();
      const connectionTime = global.mongoose.connectionTimestamp || 0;
      const FOUR_HOURS = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      
      // If connection is older than 4 hours, check connection status
      if (now - connectionTime > FOUR_HOURS && mongoose.connection.readyState !== 1) {
        console.log('Connection is stale, reconnecting...');
        await disconnectDB();
      } else {
        return global.mongoose.conn;
      }
    }

    // If no connection in progress, start a new one
    if (!global.mongoose.promise) {
      const uri = getMongoURI();

      global.mongoose.promise = mongoose
        .connect(uri, options)
        .then((connection) => {
          console.log('Connected to MongoDB');
          global.mongoose.connectionTimestamp = Date.now();
          return connection;
        })
        .catch((error) => {
          console.error('Error connecting to MongoDB:', error);
          global.mongoose.promise = null;
          
          // Convert to DatabaseError for consistent error handling
          throw DatabaseError.fromMongoError(error);
        });
    }

    // Wait for connection and return it
    const connection = await global.mongoose.promise;
    global.mongoose.conn = connection;
    return connection;
  } catch (error) {
    // Reset promise on error
    global.mongoose.promise = null;
    
    // Convert to DatabaseError if it's not already
    if (!(error instanceof DatabaseError)) {
      throw DatabaseError.fromMongoError(error);
    }
    
    throw error;
  }
}

/**
 * Disconnects from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  try {
    if (global.mongoose.conn) {
      await mongoose.disconnect();
      global.mongoose.conn = null;
      global.mongoose.promise = null;
      global.mongoose.connectionTimestamp = undefined;
      console.log('Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    // Force reset connection objects
    global.mongoose.conn = null;
    global.mongoose.promise = null;
    global.mongoose.connectionTimestamp = undefined;
    
    // Convert to DatabaseError
    throw DatabaseError.fromMongoError(error);
  }
}

/**
 * Helper to determine if we're connected to the database
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Executes a database operation with automatic connection and error handling
 * @param operation Function that performs a database operation
 * @returns Result of the database operation
 */
export async function withDatabase<T>(operation: () => Promise<T>): Promise<T> {
  try {
    // Ensure database is connected
    await connectDB();
    
    // Execute the database operation
    return await operation();
  } catch (error) {
    // Convert to DatabaseError for consistent error handling
    if (!(error instanceof DatabaseError)) {
      throw DatabaseError.fromMongoError(error);
    }
    throw error;
  }
}

/**
 * Safe transaction wrapper for MongoDB operations
 * Requires MongoDB 4.0+ and a replica set for transactions to work
 */
export async function withTransaction<T>(operations: (session: mongoose.ClientSession) => Promise<T>): Promise<T> {
  const connection = await connectDB();
  const session = await connection.startSession();
  
  try {
    session.startTransaction();
    const result = await operations(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    
    // Convert to DatabaseError
    if (!(error instanceof DatabaseError)) {
      throw DatabaseError.fromMongoError(error);
    }
    throw error;
  } finally {
    // End session regardless of outcome
    session.endSession();
  }
}

