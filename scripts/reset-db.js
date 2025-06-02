const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doneisbetter';

// Create a timestamp in ISO 8601 format with milliseconds
const getISOTimestamp = () => new Date().toISOString();

// Logging function with timestamps
const log = (message) => {
  console.log(`[${getISOTimestamp()}] ${message}`);
};

// Error handling function
const handleError = (error, operation) => {
  log(`ERROR during ${operation}: ${error.message}`);
  if (error.stack) {
    console.error(error.stack);
  }
  return error;
};

async function resetDatabase() {
  try {
    log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    log('MongoDB connected successfully');

    const db = mongoose.connection.db;
    
    // 1. Check if users collection exists
    const collections = await db.listCollections({ name: 'users' }).toArray();
    
    if (collections.length > 0) {
      log('Users collection exists - dropping all indexes first');
      
      try {
        // 2. Drop all indexes on users collection (except _id which can't be dropped)
        await db.collection('users').dropIndexes();
        log('All indexes on users collection dropped successfully');
      } catch (error) {
        handleError(error, 'dropping indexes');
        // Continue execution even if dropping indexes fails
      }
      
      // 3. Drop the users collection entirely
      log('Dropping users collection');
      await db.dropCollection('users');
      log('Users collection dropped successfully');
    } else {
      log('Users collection does not exist yet');
    }
    
    // 4. Check and drop sessions collection if it exists
    const sessionsCollection = await db.listCollections({ name: 'sessions' }).toArray();
    if (sessionsCollection.length > 0) {
      log('Dropping sessions collection');
      await db.dropCollection('sessions');
      log('Sessions collection dropped successfully');
    }
    
    // 5. Create a new users collection with minimal schema
    log('Creating new users collection');
    await db.createCollection('users');
    
    // 6. Create a single unique index on username
    log('Creating unique index on username field');
    await db.collection('users').createIndex({ username: 1 }, { 
      unique: true,
      background: true,
      name: 'username_unique_index'
    });
    log('Username unique index created successfully');
    
    // 7. Insert a test user
    const testUser = {
      username: 'testuser',
      createdAt: getISOTimestamp(),
      updatedAt: getISOTimestamp()
    };
    
    log('Creating test user');
    const result = await db.collection('users').insertOne(testUser);
    log(`Test user created with id: ${result.insertedId}`);
    
    // 8. Verify the test user was created correctly
    const users = await db.collection('users').find({}).toArray();
    log(`Current users in database: ${users.length}`);
    users.forEach(user => {
      log(`- ${user.username} (created: ${user.createdAt})`);
    });
    
    log('Database reset completed successfully');
    
    return { success: true, message: 'Database reset completed successfully' };
  } catch (error) {
    handleError(error, 'resetting database');
    return { success: false, message: error.message };
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    log('MongoDB connection closed');
  }
}

// Execute the reset function
resetDatabase()
  .then(result => {
    if (result.success) {
      log('SUCCESS: ' + result.message);
      process.exit(0);
    } else {
      log('FAILED: ' + result.message);
      process.exit(1);
    }
  })
  .catch(error => {
    handleError(error, 'script execution');
    process.exit(1);
  });

