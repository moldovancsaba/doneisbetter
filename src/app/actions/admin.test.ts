// src/app/actions/admin.test.ts - FULL TEST SUITE WITH VITEST
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { getAllUsers } from './admin'; // Action being tested
import UserModel, { UserDocument } from '@/lib/models/User'; // User model
import { getServerSession } from 'next-auth/next';
import { connectDB, disconnectDB } from '@/lib/db'; // DB utilities
import { vi, describe, it, expect, beforeAll, afterAll, beforeEach, Mock } from 'vitest'; // Import Vitest functions
import { Types } from 'mongoose'; // Import Types

// Mock next-auth getServerSession
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

// Mock the db connection
vi.mock('@/lib/db', () => ({
  connectDB: vi.fn(async () => mongoose.connection), // Mock connectDB to resolve
  disconnectDB: vi.fn(async () => {}), // Mock disconnectDB
}));

// Explicitly mock the problematic module (keep for safety)
vi.mock('@auth/mongodb-adapter', () => ({
  MongoDBAdapter: vi.fn().mockReturnValue({}),
}));

let mongoServer: MongoMemoryServer;
const mockedGetServerSession = getServerSession as Mock; // Use Vitest's Mock type
const mockedConnectDB = connectDB as Mock; // Use Vitest's Mock type

// Connect to mock DB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  try {
      await mongoose.connect(mongoUri);
      // console.log("Mock DB Connected for tests");
  } catch(e) {
      console.error("Mock DB connection error:", e);
      process.exit(1);
  }
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  // console.log("Mock DB Disconnected after tests");
});

// Clear relevant collections and reset mocks before each test
beforeEach(async () => {
  await UserModel.deleteMany({});
  mockedGetServerSession.mockClear();
  mockedConnectDB.mockClear();
  vi.restoreAllMocks(); // Restore any spies
});

type Role = 'user' | 'admin'; // Define Role type used in tests

describe('Admin Actions - getAllUsers', () => {
  it('should return users when called by an admin', async () => {
    // Arrange
    mockedGetServerSession.mockResolvedValue({
      user: { id: 'adminUserId', role: 'admin', email: 'admin@test.com' },
    });
    const testUsers = [
      { name: 'Test User 1', email: 'user1@test.com', role: 'user', googleId: 'g1' },
      { name: 'Test User 2', email: 'user2@test.com', role: 'user', googleId: 'g2' },
      { name: 'Admin User', email: 'admin@test.com', role: 'admin', googleId: 'gAdmin' },
    ];
    await UserModel.insertMany(testUsers);

    // Act
    let users;
    let error;
    try {
       // Assuming getAllUsers returns plain objects including _id
       users = await getAllUsers();
    } catch (e) { error = e; console.error("Test Error:", e); }

    // Assert
    expect(error).toBeUndefined();
    expect(mockedConnectDB).toHaveBeenCalledTimes(1);
    expect(users).toBeDefined();
    expect(users).toHaveLength(3);
    const user1 = users?.find(u => u.email === 'user1@test.com');
    expect(user1).toBeDefined();
    expect(user1?.name).toBe('Test User 1');
    expect(user1?.role).toBe('user');
    expect(user1).toHaveProperty('createdAt');
    expect(user1).toHaveProperty('_id'); // Check _id presence
  });

  it('should throw an error when called by a non-admin', async () => {
    // Arrange
    mockedGetServerSession.mockResolvedValue({
      user: { id: 'regularUserId', role: 'user', email: 'user@test.com' },
    });

    // Act & Assert
    await expect(getAllUsers()).rejects.toThrow('Unauthorized: Admin access required');
    expect(mockedConnectDB).not.toHaveBeenCalled();
  });

  it('should throw an error when no session is found', async () => {
    // Arrange
    mockedGetServerSession.mockResolvedValue(null);

    // Act & Assert
    await expect(getAllUsers()).rejects.toThrow('Unauthorized: Admin access required');
    expect(mockedConnectDB).not.toHaveBeenCalled();
  });

  it('should return an empty array if no users exist', async () => {
      // Arrange
      mockedGetServerSession.mockResolvedValue({
          user: { id: 'adminUserId', role: 'admin', email: 'admin@test.com' },
      });

      // Act
      const users = await getAllUsers();

      // Assert
      expect(mockedConnectDB).toHaveBeenCalledTimes(1);
      expect(users).toEqual([]);
  });

  it('should throw server error if database connection fails', async () => {
    // Arrange
    mockedGetServerSession.mockResolvedValue({ user: { id: 'adminUserId', role: 'admin' } });
    mockedConnectDB.mockRejectedValueOnce(new Error("DB Boom"));

    // Act & Assert
    await expect(getAllUsers()).rejects.toThrow("Failed to fetch users due to server error.");
  });

   it('should throw server error if User.find() fails', async () => {
      // Arrange
      mockedGetServerSession.mockResolvedValue({ user: { id: 'adminUserId', role: 'admin' } });
      // Use vi.spyOn with Vitest
      // Mock the chained methods correctly
      const findMock = {
          select: vi.fn().mockReturnThis(),
          sort: vi.fn().mockReturnThis(),
          lean: vi.fn().mockImplementationOnce(() => { throw new Error('Find Boom'); })
      };
      const findSpy = vi.spyOn(UserModel, 'find').mockReturnValue(findMock as any);


      // Act & Assert
      await expect(getAllUsers()).rejects.toThrow("Failed to fetch users due to server error.");
      expect(mockedConnectDB).toHaveBeenCalledTimes(1);
      findSpy.mockRestore(); // Clean up spy
  });
});
