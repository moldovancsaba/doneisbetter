import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

// Define a clean User schema that matches the application model
const createUserSchema = () => {
  const UserSchema = new mongoose.Schema({
    // Username - can be any string, emoji, etc
    username: {
      type: String,
      required: [true, 'Username is required'],
      maxlength: [30, 'Username cannot be more than 30 characters']
    },
    
    // Meta information with ISO 8601 timestamps
    createdAt: {
      type: Date,
      default: () => new Date().toISOString() // ISO 8601 format with milliseconds
    },
    lastActive: {
      type: Date,
      default: () => new Date().toISOString() // ISO 8601 format with milliseconds
    },
    
    // Stats tracking
    stats: {
      swipeCount: {
        type: Number,
        default: 0
      },
      rightSwipes: {
        type: Number, 
        default: 0
      },
      leftSwipes: {
        type: Number,
        default: 0
      },
      voteCount: {
        type: Number,
        default: 0  
      }
    }
  });

  // Add timestamps to automatically track when documents are created and updated
  UserSchema.set('timestamps', true);

  // Create indexes for faster queries - matching the User model
  UserSchema.index({ username: 1 }, { unique: true });
  UserSchema.index({ createdAt: -1 });
  UserSchema.index({ lastActive: -1 });

  return UserSchema;
};

async function cleanUsersCollection() {
  console.log(`Starting users collection cleanup at ${new Date().toISOString()}`);
  
  try {
    // Connect to MongoDB with robust connection options
    console.log(`Connecting to MongoDB at ${new Date().toISOString()}...`);
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      heartbeatFrequencyMS: 2000,
      retryWrites: true,
      w: 'majority',
    });
    console.log(`Connected to MongoDB at ${new Date().toISOString()}`);

    // Get the users collection
    const usersCollection = mongoose.connection.collection('users');
    
    // Drop the entire collection to ensure we remove all old fields and indexes
    console.log(`Dropping users collection at ${new Date().toISOString()}...`);
    try {
      await usersCollection.drop();
      console.log(`Users collection dropped successfully at ${new Date().toISOString()}`);
    } catch (dropError) {
      // Collection might not exist yet
      if (dropError.code === 26) {
        console.log(`Users collection doesn't exist at ${new Date().toISOString()}, skipping drop operation`);
      } else {
        throw dropError;
      }
    }

    // Create and register the new User model with clean schema
    console.log(`Creating new User schema at ${new Date().toISOString()}...`);
    const UserSchema = createUserSchema();
    
    // Ensure we clear any existing model to avoid model compiling errors
    if (mongoose.models.User) {
      delete mongoose.models.User;
    }
    
    // Create the new model
    const User = mongoose.model('User', UserSchema);
    console.log(`New User model created at ${new Date().toISOString()}`);
    
    // Create a test user to verify the collection is working properly
    const testUser = new User({
      username: `test_user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      stats: {
        swipeCount: 0,
        rightSwipes: 0,
        leftSwipes: 0,
        voteCount: 0
      }
    });
    
    await testUser.save();
    console.log(`Test user created successfully at ${new Date().toISOString()}: ${testUser.username}`);
    
    // Verify indexes were created properly
    const indexInfo = await User.collection.indexInformation();
    console.log(`Current indexes on users collection at ${new Date().toISOString()}:`, JSON.stringify(indexInfo, null, 2));
    
    // Clean up test user
    await User.deleteOne({ username: testUser.username });
    console.log(`Test user deleted at ${new Date().toISOString()}`);
    
    console.log(`Users collection cleanup completed successfully at ${new Date().toISOString()}`);
  } catch (error) {
    console.error(`Error during users collection cleanup at ${new Date().toISOString()}:`, error);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    if (mongoose.connection.readyState !== 0) {
      console.log(`Disconnecting from MongoDB at ${new Date().toISOString()}...`);
      await mongoose.disconnect();
      console.log(`Disconnected from MongoDB at ${new Date().toISOString()}`);
    }
    process.exit(0);
  }
}

// Execute the cleanup function
cleanUsersCollection();
