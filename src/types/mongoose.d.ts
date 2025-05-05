import type { Mongoose } from 'mongoose';

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
    connectionTimestamp?: number;
    isConnecting?: boolean;
    lastErrorTime?: number;
    reconnectAttempts?: number;
  };
}

export {};

