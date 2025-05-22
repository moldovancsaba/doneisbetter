import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const connectionOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,    // Shorter server selection timeout
      socketTimeoutMS: 45000,            // Increase socket timeout
      maxPoolSize: 10,                   // Limit max pool size
      heartbeatFrequencyMS: 2000,        // Reduce heartbeat interval
      retryWrites: true,                 // Enable retryable writes
      w: 'majority',                     // Write concern
    };

    cached.promise = mongoose.connect(MONGODB_URI, connectionOptions)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Failed to establish MongoDB connection:', error);
    throw new Error('Database connection failed');
  }
}

export default dbConnect;
