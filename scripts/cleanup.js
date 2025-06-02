// Load environment variables first
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: __dirname + '/../.env.local' });
dotenv.config({ path: __dirname + '/../.env' });

console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Import database dependencies
import dbConnect from '../lib/dbConnect.js';
import User from '../models/User.js';
import Session from '../models/Session.js';

async function cleanup() {
  try {
    await dbConnect();

    // Remove all invalid or stale sessions
    console.log('Cleaning up sessions...');
    await Session.deleteMany({});

    // Remove all users
    console.log('Cleaning up users...');
    await User.deleteMany({});

    console.log('Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup error:', error);
    process.exit(1);
  }
}

cleanup();

