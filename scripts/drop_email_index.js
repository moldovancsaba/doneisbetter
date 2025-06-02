import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

// Logger function with ISO 8601 timestamps
const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

async function dropEmailIndex() {
  try {
    log('Starting email index removal script');

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    log(`Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI);
    log('MongoDB connected successfully');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // List all indexes for debugging
    log('Listing all indexes on users collection:');
    const indexes = await usersCollection.indexes();
    indexes.forEach(index => {
      log(`Index: ${JSON.stringify(index)}`);
    });

    // Check if email_1 index exists
    const emailIndexExists = indexes.some(index => index.name === 'email_1');
    
    if (emailIndexExists) {
      log('Found email_1 index, dropping it...');
      await usersCollection.dropIndex('email_1');
      log('Successfully dropped email_1 index');
    } else {
      log('No email_1 index found on users collection');
    }

    // Verify indexes after dropping
    log('Verifying indexes after operation:');
    const updatedIndexes = await usersCollection.indexes();
    updatedIndexes.forEach(index => {
      log(`Index: ${JSON.stringify(index)}`);
    });

    log('Email index removal script completed successfully');
  } catch (error) {
    log(`Error: ${error.message}`);
    log(`Stack trace: ${error.stack}`);
    process.exit(1);
  } finally {
    // Close the MongoDB connection
    if (mongoose.connection.readyState !== 0) {
      log('Closing MongoDB connection');
      await mongoose.disconnect();
      log('MongoDB connection closed');
    }
    process.exit(0);
  }
}

// Run the script
dropEmailIndex();
