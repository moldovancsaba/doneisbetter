import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

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

/**
 * Script to drop all indexes from the users collection and recreate them properly
 * 
 * This script connects to MongoDB using the connection string in the .env file,
 * drops all indexes from the users collection, and then lets Mongoose recreate
 * the indexes based on the User model definition.
 * 
 * It provides detailed logging with ISO 8601 timestamps and verifies the index state
 * before and after the operation.
 */

// CommonJS style imports for compatibility
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(`[${new Date().toISOString()}] ERROR: MONGODB_URI environment variable is not defined`);
  process.exit(1);
}

/**
 * Connect to the MongoDB database
 * @returns {Promise<Object>} The database connection
 */
async function connectToDatabase() {
  try {
    console.log(`[${new Date().toISOString()}] Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`[${new Date().toISOString()}] Connected to MongoDB successfully`);
    return mongoose.connection.db;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error connecting to MongoDB:`, error);
    process.exit(1);
  }
}

/**
 * Get all indexes from the users collection
 * @param {Object} db Database connection
 * @returns {Promise<Object>} Collection and its indexes
 */
async function getIndexes(db) {
  try {
    const collection = db.collection('users');
    console.log(`[${new Date().toISOString()}] Retrieving indexes from users collection...`);
    const indexes = await collection.indexes();
    console.log(`[${new Date().toISOString()}] Current indexes on users collection:`);
    console.log(JSON.stringify(indexes, null, 2));
    return { collection, indexes };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error getting indexes:`, error);
    process.exit(1);
  }
}

/**
 * Drop all indexes from the users collection except the _id index
 * @param {Object} collection The users collection
 * @returns {Promise<boolean>} True if indexes were dropped, false otherwise
 */
async function dropAllIndexes(collection) {
  try {
    console.log(`[${new Date().toISOString()}] Dropping all indexes from users collection...`);
    await collection.dropIndexes();
    console.log(`[${new Date().toISOString()}] Successfully dropped all indexes (except _id)`);
    
    // Verify indexes after dropping
    console.log(`[${new Date().toISOString()}] Verifying indexes after drop operation...`);
    const updatedIndexes = await collection.indexes();
    console.log(`[${new Date().toISOString()}] Updated indexes on users collection (should only show _id index):`);
    console.log(JSON.stringify(updatedIndexes, null, 2));
    
    return true;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error dropping indexes:`, error);
    return false;
  }
}

/**
 * Recreate indexes using the User model
 * @returns {Promise<boolean>} True if indexes were recreated, false otherwise
 */
async function recreateIndexes() {
  try {
    console.log(`[${new Date().toISOString()}] Recreating indexes using User model...`);
    
    // Define the User schema (simplified version of what's in the model)
    const UserSchema = new mongoose.Schema({
      username: {
        type: String,
        required: [true, 'Username is required'],
        maxlength: [30, 'Username cannot be more than 30 characters'],
        unique: true
      },
      createdAt: {
        type: Date,
        default: () => new Date().toISOString()
      },
      lastActive: {
        type: Date,
        default: () => new Date().toISOString()
      },
      stats: {
        swipeCount: { type: Number, default: 0 },
        rightSwipes: { type: Number, default: 0 },
        leftSwipes: { type: Number, default: 0 },
        voteCount: { type: Number, default: 0 }
      }
    });

    // Add the same indexes as in the User.js model
    UserSchema.index({ username: 1 }, { unique: true });
    UserSchema.index({ createdAt: -1 });
    UserSchema.index({ lastActive: -1 });
    
    // Create the model (force overwrite if exists)
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    
    // Ensure indexes are created
    console.log(`[${new Date().toISOString()}] Creating indexes for User model...`);
    await User.createIndexes();
    
    console.log(`[${new Date().toISOString()}] Indexes recreated successfully`);
    return true;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error recreating indexes:`, error);
    return false;
  }
}

/**
 * Verify the indexes were created correctly
 * @param {Object} db Database connection
 * @returns {Promise<boolean>} True if verification passes, false otherwise
 */
async function verifyIndexes(db) {
  try {
    const collection = db.collection('users');
    console.log(`[${new Date().toISOString()}] Verifying final index state...`);
    const indexes = await collection.indexes();
    console.log(`[${new Date().toISOString()}] Final indexes on users collection:`);
    console.log(JSON.stringify(indexes, null, 2));
    
    // Verify expected indexes
    const usernameIndex = indexes.find(index => 
      index.key && index.key.username === 1 && index.unique === true
    );
    
    const createdAtIndex = indexes.find(index => 
      index.key && index.key.createdAt === -1
    );
    
    const lastActiveIndex = indexes.find(index => 
      index.key && index.key.lastActive === -1
    );
    
    if (usernameIndex && createdAtIndex && lastActiveIndex) {
      console.log(`[${new Date().toISOString()}] All expected indexes are present and correct`);
      return true;
    } else {
      console.log(`[${new Date().toISOString()}] WARNING: Some expected indexes are missing or incorrect`);
      return false;
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error verifying indexes:`, error);
    return false;
  }
}

/**
 * Main function to execute the script
 */
async function main() {
  try {
    console.log(`[${new Date().toISOString()}] Starting index rebuild operation`);
    
    const db = await connectToDatabase();
    const { collection } = await getIndexes(db);
    
    const dropResult = await dropAllIndexes(collection);
    if (!dropResult) {
      console.log(`[${new Date().toISOString()}] Failed to drop indexes, aborting operation`);
      return;
    }
    
    const recreateResult = await recreateIndexes();
    if (!recreateResult) {
      console.log(`[${new Date().toISOString()}] Failed to recreate indexes, manual intervention may be required`);
      return;
    }
    
    const verifyResult = await verifyIndexes(db);
    if (verifyResult) {
      console.log(`[${new Date().toISOString()}] Index rebuild completed successfully`);
    } else {
      console.log(`[${new Date().toISOString()}] Index rebuild completed but verification failed`);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] An error occurred:`, error);
  } finally {
    if (mongoose.connection.readyState) {
      console.log(`[${new Date().toISOString()}] Closing MongoDB connection`);
      await mongoose.connection.close();
    }
    console.log(`[${new Date().toISOString()}] Script execution finished`);
    process.exit(0);
  }
}

// Execute the script
main();

