import mongoose from 'mongoose';

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<void> | null;
  connectionTimestamp?: number;
  isConnecting?: boolean;
  lastErrorTime?: number;
  reconnectAttempts?: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: GlobalMongoose;
}

// Export the interface for use in other files
export type { GlobalMongoose };
