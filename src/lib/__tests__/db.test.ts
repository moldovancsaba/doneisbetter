import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  connectDB,
  disconnectDB,
  isConnected,
  isConnectionHealthy,
  getConnectionStatus,
  withDatabase,
  withTransaction,
  testConnection,
  simulateConnectionError,
  ConnectionState
} from '../db';
import { DatabaseError, DatabaseErrorType } from '../errors/DatabaseError';

// Helper to manually create invalid connection state for testing
const invalidateConnection = () => {
  // Reset the mongoose global object to simulate a disconnected state
  global.mongoose = {
    conn: null,
    promise: null,
    connectionTimestamp: undefined,
    isConnecting: false,
    lastErrorTime: undefined,
    reconnectAttempts: 0
  };
  
  // Ensure mongoose is disconnected - safely check connection state
  if (mongoose.connection && mongoose.connection.readyState !== 0) {
    return mongoose.disconnect();
  }
  return Promise.resolve();
};
// Mocking to simulate errors
jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  
  // Create a connection mock if it doesn't exist
  if (!originalMongoose.connection) {
    originalMongoose.connection = {
      readyState: 0,
      getClient: jest.fn().mockReturnValue({
        db: jest.fn().mockReturnValue({
          admin: jest.fn().mockReturnValue({
            ping: jest.fn().mockResolvedValue({ ok: 1 }),
            command: jest.fn().mockResolvedValue({ ok: 1 })
          })
        })
      })
    };
  }
  
  return {
    ...originalMongoose,
    // We'll selectively mock connect in specific tests
    connect: jest.fn().mockImplementation((...args) => {
      // Update connection state to connected when connect is called
      originalMongoose.connection.readyState = 1;
      return Promise.resolve(originalMongoose);
    }),
    disconnect: jest.fn().mockImplementation(() => {
      // Update connection state to disconnected when disconnect is called
      originalMongoose.connection.readyState = 0;
      return Promise.resolve();
    })
  };
});
describe('Database Connection Module', () => {
  let mongoServer: MongoMemoryServer;

  // Setup in-memory MongoDB server before all tests
  beforeAll(async () => {
    // Create MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    
    // Initialize mongoose connection object
    if (!mongoose.connection) {
      (mongoose as any).connection = { 
        readyState: 0,
        db: {
          admin: () => ({
            ping: jest.fn().mockResolvedValue({ ok: 1 }),
            command: jest.fn().mockResolvedValue({ ok: 1 })
          })
        },
        getClient: () => ({
          db: () => ({
            admin: () => ({
              ping: jest.fn().mockResolvedValue({ ok: 1 }),
              command: jest.fn().mockImplementation((cmd) => {
                if (cmd.replSetGetStatus) {
                  return Promise.resolve({ ok: 1 });
                }
                return Promise.resolve({ ok: 1 });
              })
            })
          })
        })
      };
    }
    
    // Reset global mongoose object
    global.mongoose = {
      conn: null,
      promise: null,
      connectionTimestamp: undefined,
      isConnecting: false,
      lastErrorTime: undefined,
      reconnectAttempts: 0
    };
  });

  // Clean up after all tests
  afterAll(async () => {
    await invalidateConnection();
    await mongoServer?.stop();
    delete process.env.MONGODB_URI;
  });
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mongoose mock to default behavior
    (mongoose.connect as jest.Mock).mockImplementation(() => {
      // Set connection state to connected on successful connection
      mongoose.connection.readyState = ConnectionState.CONNECTED;
      return Promise.resolve(mongoose);
    });
    
    // Reset disconnect mock
    (mongoose.disconnect as jest.Mock).mockImplementation(() => {
      // Set connection state to disconnected on disconnect
      mongoose.connection.readyState = ConnectionState.DISCONNECTED;
      return Promise.resolve();
    });
    
    // Reset global mongoose object for each test
    global.mongoose = {
      conn: null,
      promise: null,
      connectionTimestamp: undefined,
      isConnecting: false,
      lastErrorTime: undefined,
      reconnectAttempts: 0
    };
  });
  
  afterEach(async () => {
    await invalidateConnection();
  });
  
  describe('Basic Connection Functionality', () => {
    /**
     * Tests the basic connection to MongoDB
     * Verifies that the connection is established correctly and 
     * the global mongoose state is updated appropriately
     */
    test('should connect to MongoDB successfully', async () => {
      // Verify initially disconnected
      expect(isConnected()).toBe(false);
      
      // Connect to the database
      const connection = await connectDB();
      
      // Verify connection
      expect(connection).toBeTruthy();
      expect(isConnected()).toBe(true);
      expect(mongoose.connection.readyState).toBe(ConnectionState.CONNECTED);
      expect(global.mongoose.conn).toBe(connection);
      expect(global.mongoose.connectionTimestamp).toBeDefined();
      expect(global.mongoose.isConnecting).toBe(false);
    });
    
    test('should return existing connection if already connected', async () => {
      // First connection
      const connection1 = await connectDB();
      expect(connection1).toBeTruthy();
      
      // Second connection should reuse the first
      const connection2 = await connectDB();
      expect(connection2).toBe(connection1);
      expect(connection2).toBe(global.mongoose.conn);
    });
    
    test('should disconnect successfully', async () => {
      // Connect first
      await connectDB();
      expect(isConnected()).toBe(true);
      
      // Disconnect
      await disconnectDB();
      
      // Verify disconnected state
      expect(isConnected()).toBe(false);
      expect(global.mongoose.conn).toBeNull();
      expect(global.mongoose.promise).toBeNull();
      expect(global.mongoose.connectionTimestamp).toBeUndefined();
    });
  });
  
  describe('Connection In-Progress State', () => {
    /**
     * Tests that the connection state properly tracks when a connection
     * is currently in progress but not yet completed
     */
    test('should track in-progress connection state', async () => {
      // Setup connection in progress state
      global.mongoose = {
        conn: null,
        promise: new Promise(() => {}), // Never resolving promise
        isConnecting: true,
        connectionTimestamp: undefined,
        lastErrorTime: undefined,
        reconnectAttempts: 0
      };
      
      // Check connection status
      expect(isConnected()).toBe(false);
      expect(getConnectionStatus().state).toBe(ConnectionState.CONNECTING);
      expect(getConnectionStatus().isConnecting).toBe(true);
      
      // Reset state for next tests
      await invalidateConnection();
    });
  });
  
  describe('Connection Error Handling', () => {
    test('should throw DatabaseError when MongoDB URI is not defined', async () => {
      // Temporarily remove MongoDB URI
      const originalUri = process.env.MONGODB_URI;
      delete process.env.MONGODB_URI;
      
      // Expect connection to fail with DatabaseError
      await expect(connectDB()).rejects.toThrow(DatabaseError);
      await expect(connectDB()).rejects.toThrow(/Please define the MONGODB_URI/);
      
      // Check error object type
      try {
        await connectDB();
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect((error as DatabaseError).type).toBe(DatabaseErrorType.CONNECTION);
        expect((error as DatabaseError).statusCode).toBe(500);
      }
      
      // Restore original URI
      process.env.MONGODB_URI = originalUri;
    });
    
    test('should handle connection errors properly', async () => {
      // Mock mongoose.connect to throw an error
      (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));
      
      // Attempt to connect
      await expect(connectDB()).rejects.toThrow(DatabaseError);
      
      // Verify detailed error state
      expect(isConnected()).toBe(false);
      expect(global.mongoose.conn).toBeNull();
      expect(global.mongoose.lastErrorTime).toBeDefined();
      expect(global.mongoose.reconnectAttempts).toBe(1);
      
      // Verify DatabaseError properties
      try {
        await connectDB();
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect((error as DatabaseError).type).toBe(DatabaseErrorType.CONNECTION);
        expect((error as DatabaseError).statusCode).toBe(500);
        expect((error as DatabaseError).message).toContain('Connection failed');
      }
    });
    
    test('should handle disconnection errors', async () => {
      // Connect first
      await connectDB();
      
      // Mock mongoose.disconnect to throw an error
      const originalDisconnect = mongoose.disconnect;
      mongoose.disconnect = jest.fn().mockRejectedValueOnce(new Error('Disconnect failed'));
      
      // Attempt to disconnect
      await expect(disconnectDB()).rejects.toThrow(DatabaseError);
      
      // Verify state is reset despite error
      expect(global.mongoose.conn).toBeNull();
      expect(global.mongoose.promise).toBeNull();
      
      // Restore original disconnect function
      mongoose.disconnect = originalDisconnect;
    });
    
    test('should handle connection timeout', async () => {
      // Mock mongoose.connect to simulate a timeout
      (mongoose.connect as jest.Mock).mockImplementationOnce(() => 
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Connection timeout')), 100);
        })
      );
      
      // Attempt to connect
      const connectPromise = connectDB();
      await expect(connectPromise).rejects.toThrow(DatabaseError);
      
      // Verify timeout is handled properly
      try {
        await connectPromise;
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect((error as DatabaseError).message).toContain('Connection timeout');
      }
      
      // Ensure connection state is reset
      expect(isConnected()).toBe(false);
      expect(global.mongoose.isConnecting).toBe(false);
    });
    
    test('should handle connection failure with retry', async () => {
      // Setup to fail once then succeed
      (mongoose.connect as jest.Mock)
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockImplementationOnce((...args) => jest.requireActual('mongoose').connect(...args));
      
      // First attempt fails
      await expect(connectDB()).rejects.toThrow(DatabaseError);
      expect(global.mongoose.reconnectAttempts).toBe(1);
      
      // Second attempt should succeed
      const connection = await connectDB();
      expect(connection).toBeTruthy();
      expect(isConnected()).toBe(true);
      expect(global.mongoose.reconnectAttempts).toBe(0); // Reset after success
    });
  });
  
  describe('Connection State Management', () => {
    test('isConnected should report connection state correctly', async () => {
      // Initially disconnected
      expect(isConnected()).toBe(false);
      
      // Connect
      await connectDB();
      expect(isConnected()).toBe(true);
      
      // Disconnect
      await disconnectDB();
      expect(isConnected()).toBe(false);
    });
    
    test('isConnectionHealthy should verify connection health', async () => {
      // Initially not healthy
      expect(isConnectionHealthy()).toBe(false);
      
      // Connect
      await connectDB();
      expect(isConnectionHealthy()).toBe(true);
      
      // Disconnect
      await disconnectDB();
      expect(isConnectionHealthy()).toBe(false);
    });
    
    test('connection health should check connection age', async () => {
      // Connect
      await connectDB();
      expect(isConnectionHealthy()).toBe(true);
      
      // Manually set an old connection timestamp (1 hour ago)
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      global.mongoose.connectionTimestamp = oneHourAgo;
      
      // Should still be considered healthy (timestamp check only flags for information)
      expect(isConnectionHealthy()).toBe(true);
      
      // Verify health status includes age information
      const status = getConnectionStatus();
      expect(status.isConnected).toBe(true);
      expect(status.connectionAge).toBeGreaterThan(59 * 60 * 1000); // ~1 hour in milliseconds
    });
    
    test('getConnectionStatus should return detailed status', async () => {
      // Initial state
      let status = getConnectionStatus();
      expect(status.isConnected).toBe(false);
      expect(status.state).toBe(ConnectionState.DISCONNECTED);
      expect(status.reconnectAttempts).toBe(0);
      expect(status.hasErrors).toBe(false);
      
      // Connect
      await connectDB();
      status = getConnectionStatus();
      expect(status.isConnected).toBe(true);
      expect(status.state).toBe(ConnectionState.CONNECTED);
      expect(status.lastConnected).toBeInstanceOf(Date);
      
      // Simulate error
      await disconnectDB();
      await simulateConnectionError();
      status = getConnectionStatus();
      expect(status.isConnected).toBe(false);
      expect(status.hasErrors).toBe(true);
      expect(status.lastError).toBeInstanceOf(Date);
      expect(status.reconnectAttempts).toBe(1);
    });
  });
  
  describe('Database Operation Wrappers', () => {
    /**
     * Tests the withDatabase function which automatically handles
     * database connection for operations
     */
    test('withDatabase should execute operations with connection', async () => {
      // Start disconnected
      await invalidateConnection();
      expect(isConnected()).toBe(false);
      
      // Use withDatabase to execute an operation
      const result = await withDatabase(async () => {
        // Check connection is established
        expect(isConnected()).toBe(true);
        return 'success';
      });
      
      // Verify operation executed successfully
      expect(result).toBe('success');
      expect(isConnected()).toBe(true);
    });
    
    test('withDatabase should handle operation errors', async () => {
      // Create a failing operation
      const failingOperation = async () => {
        throw new Error('Operation failed');
      };
      
      // Attempt to execute it with withDatabase
      await expect(withDatabase(failingOperation)).rejects.toThrow(DatabaseError);
      
      // Despite error, connection should still exist
      expect(isConnected()).toBe(true);
    });
    
    test('withDatabase should maintain connection across multiple calls', async () => {
      // First operation
      await withDatabase(async () => 'operation 1');
      const firstConnectionTime = global.mongoose.connectionTimestamp;
      
      // Second operation
      await withDatabase(async () => 'operation 2');
      const secondConnectionTime = global.mongoose.connectionTimestamp;
      
      // Connection should be reused, not recreated
      expect(firstConnectionTime).toEqual(secondConnectionTime);
    });
  });
  
  describe('Transaction Support', () => {
    test('withTransaction should execute operations in a transaction', async () => {
      // Skip if using memory server without replica set (transactions require replica set)
      const client = mongoose.connection.getClient();
      const isReplSet = await client.db().admin().command({ replSetGetStatus: 1 })
        .then(() => true)
        .catch(() => false);
      
      if (!isReplSet) {
        console.log('Skipping transaction test - requires replica set');
        return;
      }
      
      // Test transaction operation
      const result = await withTransaction(async (session) => {
        expect(session).toBeDefined();
        expect(session.inTransaction()).toBe(true);
        return 'transaction success';
      });
      
      expect(result).toBe('transaction success');
    });
    
    test('withTransaction should properly handle transaction errors', async () => {
      // Skip if using memory server without replica set (transactions require replica set)
      const client = mongoose.connection.getClient();
      const isReplSet = await client.db().admin().command({ replSetGetStatus: 1 })
        .then(() => true)
        .catch(() => false);
      
      if (!isReplSet) {
        console.log('Skipping transaction error test - requires replica set');
        return;
      }
      
      // Test transaction with error
      const operation = async (session: mongoose.ClientSession) => {
        expect(session.inTransaction()).toBe(true);
        throw new Error('Transaction operation failed');
      };
      
      await expect(withTransaction(operation)).rejects.toThrow(DatabaseError);
      
      // Even with transaction error, connection should still be active
      expect(isConnected()).toBe(true);
    });
  });
  
  describe('Connection Testing Utilities', () => {
    test('testConnection should verify connection status', async () => {
      // Initially disconnected
      await invalidateConnection();
      
      // Test connection
      const result = await testConnection();
      
      // Verify result
      expect(result.isConnected).toBe(true);
      expect(result.connectionInfo).toBeDefined();
      expect(result.connectionInfo.state).toBe(ConnectionState.CONNECTED);
      expect(result.pingResult).toBeDefined();
      expect(result.pingResult?.ok).toBe(1);
    });
    
    test('simulateConnectionError should simulate an error state', async () => {
      // Initially connected
      await connectDB();
      expect(isConnected()).toBe(true);
      
      // Simulate error
      await simulateConnectionError();
      
      // Verify error state
      expect(isConnected()).toBe(false);
      expect(global.mongoose.lastErrorTime).toBeDefined();
      expect(global.mongoose.reconnectAttempts).toBe(1);
      
      // GetConnectionStatus should reflect error
      const status = getConnectionStatus();
      expect(status.hasErrors).toBe(true);
      expect(status.reconnectAttempts).toBe(1);
    });
    
    test('should gracefully handle reconnection after error', async () => {
      // Simulate an error
      await simulateConnectionError();
      expect(isConnected()).toBe(false);
      expect(global.mongoose.reconnectAttempts).toBe(1);
      
      // Reconnect
      const connection = await connectDB();
      expect(connection).toBeTruthy();
      expect(isConnected()).toBe(true);
      
      // Error state should be cleared
      expect(global.mongoose.reconnectAttempts).toBe(0);
      expect(getConnectionStatus().hasErrors).toBe(false);
    });
  });
  
  describe('Sequential Connection Operations', () => {
    test('should handle multiple connection cycles correctly', async () => {
      // Cycle 1: Connect → Test → Disconnect
      await connectDB();
      expect(isConnected()).toBe(true);
      await disconnectDB();
      expect(isConnected()).toBe(false);
      
      // Cycle 2: Connect → Test → Disconnect
      await connectDB();
      expect(isConnected()).toBe(true);
      await disconnectDB();
      expect(isConnected()).toBe(false);
      
      // Cycle 3: Connect → Error → Recover → Disconnect
      await connectDB();
      expect(isConnected()).toBe(true);
      await simulateConnectionError();
      expect(isConnected()).toBe(false);
      await connectDB();
      expect(isConnected()).toBe(true);
      await disconnectDB();
      expect(isConnected()).toBe(false);
    });
  });
});
