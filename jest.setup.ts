import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Extend NodeJS global with our custom properties to match the db.ts file
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    connectionTimestamp?: number;
    isConnecting?: boolean;
    lastErrorTime?: number;
    reconnectAttempts?: number;
  };
  // Add additional testing properties
  var __MONGO_URI__: string;
  var __MONGOD__: MongoMemoryServer;
}

// Set up MongoDB memory server before all tests
beforeAll(async () => {
  // Start MongoDB memory server
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Save to global for later use
  global.__MONGOD__ = mongod;
  global.__MONGO_URI__ = uri;
  
  // Set MongoDB URI environment variable
  process.env.MONGODB_URI = uri;
  
  // Reset mongoose global for clean test environment
  global.mongoose = {
    conn: null,
    promise: null,
    connectionTimestamp: undefined,
    isConnecting: false,
    lastErrorTime: undefined,
    reconnectAttempts: 0
  };
  
  console.log(`MongoDB Memory Server started at: ${uri}`);
});

// Clean up after each test
afterEach(async () => {
  // Ensure we're starting fresh for each test
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  // Reset mongoose global between tests
  global.mongoose = {
    conn: null,
    promise: null,
    connectionTimestamp: undefined,
    isConnecting: false,
    lastErrorTime: undefined,
    reconnectAttempts: 0
  };
});

// Clean up after all tests are done
afterAll(async () => {
  // Ensure mongoose is disconnected
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  // Stop MongoDB memory server
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
    console.log('MongoDB Memory Server stopped');
  }
});

// Silence mongoose deprecation warnings
mongoose.set('strictQuery', true);

// Configure Jest environment
jest.setTimeout(30000); // 30 seconds timeout

// Mock console methods for cleaner test output
// Comment these out when debugging tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Silence console output during tests
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

// Restore console methods during debugging
// Uncomment these when you need to see logs during tests
// beforeEach(() => {
//   console.log = originalConsoleLog;
//   console.error = originalConsoleError;
//   console.warn = originalConsoleWarn;
// });

