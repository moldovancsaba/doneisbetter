import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(`[${new Date().toISOString()}] ERROR: MONGODB_URI environment variable is not defined`);
  process.exit(1);
}

async function rebuildUserIndexes() {
  console.log(`[${new Date().toISOString()}] Starting user indexes rebuild process...`);
  
  try {
    // Connect to MongoDB
    console.log(`[${new Date().toISOString()}] Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      heartbeatFrequencyMS: 2000,
      retryWrites: true,
      w: 'majority',
    });
    
    console.log(`[${new Date().toISOString()}] Connected to MongoDB successfully`);
    
    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // List all indexes before dropping
    console.log(`[${new Date().toISOString()}] Current indexes on users collection:`);
    const currentIndexes = await usersCollection.indexes();
    console.log(JSON.stringify(currentIndexes, null, 2));
    
    // Drop all indexes except _id
    console.log(`[${new Date().toISOString()}] Dropping all non-_id indexes from users collection...`);
    const indexNames = currentIndexes
      .filter(index => index.name !== '_id_')
      .map(index => index.name);
    
    if (indexNames.length === 0) {
      console.log(`[${new Date().toISOString()}] No indexes to drop.`);
    } else {
      for (const indexName of indexNames) {
        console.log(`[${new Date().toISOString()}] Dropping index: ${indexName}`);
        await usersCollection.dropIndex(indexName);
      }
      console.log(`[${new Date().toISOString()}] All non-_id indexes dropped successfully`);
    }
    
    // Create new indexes as defined in the User model
    console.log(`[${new Date().toISOString()}] Creating new indexes for User model...`);
    
    // Define indexes according to User.js model
    const indexOperations = [
      { key: { username: 1 }, options: { unique: true } },
      { key: { createdAt: -1 }, options: {} },
      { key: { lastActive: -1 }, options: {} }
    ];
    
    // Create each index
    for (const indexOp of indexOperations) {
      console.log(`[${new Date().toISOString()}] Creating index: ${JSON.stringify(indexOp.key)}`);
      await usersCollection.createIndex(indexOp.key, indexOp.options);
    }
    
    // Verify the new indexes
    console.log(`[${new Date().toISOString()}] Verifying new indexes...`);
    const updatedIndexes = await usersCollection.indexes();
    console.log(JSON.stringify(updatedIndexes, null, 2));
    
    console.log(`[${new Date().toISOString()}] User indexes rebuilt successfully`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error rebuilding indexes:`, error);
    process.exit(1);
  } finally {
    // Close the MongoDB connection
    if (mongoose.connection.readyState !== 0) {
      console.log(`[${new Date().toISOString()}] Closing MongoDB connection...`);
      await mongoose.connection.close();
      console.log(`[${new Date().toISOString()}] MongoDB connection closed`);
    }
  }
}

// Execute the function
rebuildUserIndexes();

