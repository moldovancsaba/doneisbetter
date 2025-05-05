import mongoose from 'mongoose';
import { DatabaseError, DatabaseErrorType } from './errors/DatabaseError';

/**
 * Simple and reliable MongoDB connection manager.
 * Handles connection pooling, error management, and transactions.
 */

// Connection state
let isConnecting = false;
let cachedConnection: typeof mongoose | null = null;

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
    throw new DatabaseError({
      message: 'Missing MONGODB_URI environment variable',
      type: DatabaseErrorType.CONNECTION,
      statusCode: 500
    });
  }
  return uri;
}

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return existing connection if valid
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // Prevent concurrent connections
  if (isConnecting) {
    throw new DatabaseError({
      message: 'Connection already in progress',
      type: DatabaseErrorType.CONNECTION,
      statusCode: 500
    });
  }

  try {
    isConnecting = true;
    const db = await mongoose.connect(getMongoURI(), OPTIONS);
    cachedConnection = db;
    return db;
  } catch (error) {
    throw error instanceof DatabaseError 
      ? error 
      : DatabaseError.fromMongoError(error);
  } finally {
    isConnecting = false;
  }
}

/**
 * Close database connection
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      cachedConnection = null;
    } catch (error) {
      throw DatabaseError.fromMongoError(error);
    }
  }
}

/**
 * Get connection status
 */
export function getConnectionStatus() {
  return {
    isConnected: mongoose.connection.readyState === 1,
    isConnecting,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port
  };
}

/**
 * Execute database operation with automatic connection
 */
export async function withDatabase<T>(operation: () => Promise<T>): Promise<T> {
  await connectToDatabase();
  try {
    return await operation();
  } catch (error) {
    throw error instanceof DatabaseError 
      ? error 
      : DatabaseError.fromMongoError(error);
  }
}

/**
 * Execute operation in a transaction
 */
export async function withTransaction<T>(
  operation: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> {
  const connection = await connectToDatabase();
  const session = await connection.startSession();

  try {
    session.startTransaction();
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error instanceof DatabaseError 
      ? error 
      : DatabaseError.fromMongoError(error);
  } finally {
    await session.endSession();
  }
}

// Export mongoose instance for direct access if needed
export default mongoose;
