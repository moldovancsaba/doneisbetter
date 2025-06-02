import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

async function cleanup() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB at ${new Date().toISOString()}`);

    // Get the users collection
    const usersCollection = mongoose.connection.collection('users');

    // Drop all indexes
    console.log(`Dropping all indexes at ${new Date().toISOString()}...`);
    await usersCollection.dropIndexes();

    // Delete all users
    console.log(`Deleting all users at ${new Date().toISOString()}...`);
    await usersCollection.deleteMany({});

    console.log(`Cleanup completed successfully at ${new Date().toISOString()}`);
  } catch (error) {
    console.error(`Error during cleanup at ${new Date().toISOString()}:`, error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

cleanup();

