import mongoose from 'mongoose';

// Import models
import User from './User.js';
import Card from './Card.js';
import Session from './Session.js';
import VotePair from './VotePair.js';
import VoteRank from './VoteRank.js';

// Define connection settings
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doneisbetter';

// Connection cache
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Shared Schema options to ensure consistent date handling
const schemaOptions = {
  toJSON: {
    virtuals: true,
  },
  timestamps: true,
};

// Define Interaction schema
const interactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false
  },
  sessionId: {
    type: String,
    required: false
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  type: {
    type: String,
    enum: ['swipe', 'vote'],
    required: true
  },
  action: {
    type: String,
    enum: ['left', 'right', 'up', 'down', 'win', 'lose'],
    required: true
  },
  againstCardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: false
  }
}, schemaOptions);

// Add validation to ensure either userId or sessionId is provided
interactionSchema.pre('validate', function(next) {
  if (!this.userId && !this.sessionId) {
    next(new Error('Either userId or sessionId is required'));
  } else {
    next();
  }
});

const Interaction = mongoose.models.Interaction || mongoose.model('Interaction', interactionSchema);

// Connect to the database
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongoose => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Function to initialize all models
export function initializeModels() {
  return {
    User,
    Card,
    Session,
    Interaction,
    VotePair,
    VoteRank
  };
}

// Export all models
export {
  User,
  Card,
  Session,
  Interaction,
  VotePair,
  VoteRank
};

// Export default interface for backwards compatibility
export default {
  User,
  Card,
  Session,
  Interaction,
  VotePair,
  VoteRank,
  connectToDatabase,
  initializeModels
};

