/**
 * Database Reset Script
 * 
 * This script completely resets the user management system by:
 * - Dropping existing users, sessions, accounts, cards, and messages collections
 * - Recreating users collection with clean schema (username only)
 * - Setting up proper validation and indexes
 * - Creating a test user
 * - Using ISO 8601 timestamps with milliseconds
 * 
 * Usage: npm run reset-db
 */

import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(`[${new Date().toISOString()}] Error: MONGODB_URI environment variable is not defined.`);
  process.exit(1);
}

// Constants
const USER_COLLECTION = 'users';
const SESSION_COLLECTION = 'sessions';
const ACCOUNTS_COLLECTION = 'accounts';
const CARDS_COLLECTION = 'cards';
const MESSAGES_COLLECTION = 'messages';

// Connection options
const connectionOptions = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  heartbeatFrequencyMS: 2000,
  retryWrites: true,
  w: 'majority',
};

/**
 * Formats and logs a message with ISO 8601 timestamp
 */
/**
 * Formats and logs a message with ISO 8601 timestamp with milliseconds
 * @param {string} message - The message to log
 */
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Connect to MongoDB using environment variables
 * @returns {mongoose.Connection} - The MongoDB connection object
 */
async function connectToDatabase() {
  try {
    log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, connectionOptions);
    log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    log(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Drop users collection and recreate with clean schema
 * @param {mongoose.Connection} db - MongoDB connection
 * @returns {boolean} - True if successful, false otherwise
 */
async function resetUsersCollection(db) {
  try {
    // First check if users collection exists and examine its indexes
    const collections = await db.db.listCollections({ name: USER_COLLECTION }).toArray();
    
    if (collections.length > 0) {
      // Log all existing indexes before dropping
      log('Examining existing indexes on users collection...');
      const indexes = await db.db.collection(USER_COLLECTION).indexes();
      
      log(`Found ${indexes.length} indexes on users collection:`);
      indexes.forEach(index => {
        log(`- Index name: ${index.name}, key: ${JSON.stringify(index.key)}`);
      });
      
      // Specifically check for email index
      const emailIndex = indexes.find(index => 
        index.key && index.key.email !== undefined ||
        index.name.includes('email')
      );
      
      if (emailIndex) {
        log(`Found problematic email index: ${emailIndex.name}`);
        log('Dropping email index specifically...');
        try {
          await db.db.collection(USER_COLLECTION).dropIndex(emailIndex.name);
          log('Email index dropped successfully');
        } catch (indexError) {
          log(`Error dropping email index: ${indexError.message}`);
          // Continue anyway
        }
      }
      
      // Drop all non-_id indexes explicitly
      for (const index of indexes) {
        if (index.name !== '_id_') {
          try {
            log(`Dropping index: ${index.name}...`);
            await db.db.collection(USER_COLLECTION).dropIndex(index.name);
            log(`Index ${index.name} dropped successfully`);
          } catch (indexError) {
            log(`Error dropping index ${index.name}: ${indexError.message}`);
            // Continue anyway
          }
        }
      }
      
      // Now drop the collection
      log('Dropping users collection with force option...');
      try {
        await db.db.collection(USER_COLLECTION).drop({ force: true });
        log('Users collection dropped successfully with force option');
      } catch (dropError) {
        log(`Warning: Error during forced collection drop: ${dropError.message}`);
        log('Attempting alternative collection removal approach...');
        
        // Alternative approach - drop the database and recreate if needed
        try {
          await db.db.command({ drop: USER_COLLECTION, writeConcern: { w: "majority" } });
          log('Users collection dropped using command with majority write concern');
        } catch (cmdError) {
          log(`Warning: Command drop also failed: ${cmdError.message}`);
          log('Will proceed with collection recreation anyway');
        }
      }
    } else {
      log('Users collection does not exist, will create new');
    }
    
    // Create users collection with validation
    log('Creating new users collection with clean schema...');
    await db.db.createCollection(USER_COLLECTION, {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['username', 'createdAt', 'updatedAt'],
          properties: {
            username: {
              bsonType: 'string',
              maxLength: 30,
              description: 'Username must be a string with max 30 characters'
            },
            createdAt: {
              bsonType: 'string',
              description: 'Timestamp when user was created in ISO 8601 format with milliseconds (2025-04-13T12:34:56.789Z)'
            },
            updatedAt: {
              bsonType: 'string',
              description: 'Timestamp when user was last updated in ISO 8601 format with milliseconds (2025-04-13T12:34:56.789Z)'
            }
          }
        }
      }
    });
    log('Users collection created with validation schema');
    
    // Create unique index on username
    log('Creating unique index on username...');
    await db.db.collection(USER_COLLECTION).createIndex(
      { username: 1 }, 
      { unique: true, name: 'username_1' }
    );
    log('Index created successfully');
    
    // Verify indexes to ensure no unwanted ones exist
    log('Verifying indexes after creation...');
    const finalIndexes = await db.db.collection(USER_COLLECTION).indexes();
    log(`Current indexes (should only see _id_ and username_1):`);
    finalIndexes.forEach(index => {
      log(`- Index name: ${index.name}, key: ${JSON.stringify(index.key)}`);
    });
    
    // Final cleanup of any unexpected indexes
    for (const index of finalIndexes) {
      if (index.name !== '_id_' && index.name !== 'username_1') {
        log(`WARNING: Found unexpected index: ${index.name}, attempting to drop...`);
        try {
          await db.db.collection(USER_COLLECTION).dropIndex(index.name);
          log(`Unexpected index ${index.name} dropped successfully`);
        } catch (indexError) {
          log(`Error dropping unexpected index ${index.name}: ${indexError.message}`);
          
          // Aggressive approach for email indexes specifically
          if (index.name.includes('email') || (index.key && Object.keys(index.key).some(k => k.includes('email')))) {
            log('Attempting more aggressive removal of email index...');
            try {
              // Try using dropIndexes command directly
              await db.db.command({ 
                dropIndexes: USER_COLLECTION, 
                index: index.name,
                writeConcern: { w: "majority" }
              });
              log('Successfully dropped email index using direct command');
            } catch (cmdError) {
              log(`Failed aggressive email index removal: ${cmdError.message}`);
            }
          }
        }
      }
    }
    
    // Final verification specifically for email indexes
    log('Performing final check specifically for email indexes...');
    const emailCheckIndexes = await db.db.collection(USER_COLLECTION).indexes();
    const emailIndexExists = emailCheckIndexes.some(idx => 
      idx.name.includes('email') || 
      (idx.key && Object.keys(idx.key).some(k => k.includes('email')))
    );
    
    if (emailIndexExists) {
      log('WARNING: Email index still exists after all removal attempts!');
      log('Attempting one final recreation of the collection...');
      
      try {
        // Drop collection one more time
        await db.db.collection(USER_COLLECTION).drop({ force: true });
        
        // Recreate with validation but without any indexes
        await db.db.createCollection(USER_COLLECTION, {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['username', 'createdAt', 'updatedAt'],
              properties: {
                username: {
                  bsonType: 'string',
                  maxLength: 30,
                  description: 'Username must be a string with max 30 characters'
                },
                createdAt: {
                  bsonType: 'string',
                  description: 'Timestamp when user was created in ISO 8601 format with milliseconds (2025-04-13T12:34:56.789Z)'
                },
                updatedAt: {
                  bsonType: 'string',
                  description: 'Timestamp when user was last updated in ISO 8601 format with milliseconds (2025-04-13T12:34:56.789Z)'
                }
              }
            }
          }
        });
        
        // Create username index again
        await db.db.collection(USER_COLLECTION).createIndex(
          { username: 1 }, 
          { unique: true, name: 'username_1' }
        );
        
        log('Collection recreated after email index persistence issue');
      } catch (finalError) {
        log(`Final recreation attempt failed: ${finalError.message}`);
      }
    } else {
      log('Final verification confirms no email indexes exist');
    }
    
    // Create a test user
    const now = new Date().toISOString();
    const testUser = {
      username: 'testuser',
      createdAt: now,
      updatedAt: now
    };
    
    log('Creating test user...');
    await db.db.collection(USER_COLLECTION).insertOne(testUser);
    log('Test user created successfully');
    
    // Verify we can query the test user to ensure collection is working
    const foundUser = await db.db.collection(USER_COLLECTION).findOne({ username: 'testuser' });
    if (foundUser) {
      log(`Test user verification successful: ${foundUser.username}`);
    } else {
      log('WARNING: Could not find test user after creation');
    }
    
    return true;
  } catch (error) {
    log(`Error resetting users collection: ${error.message}`);
    return false;
  }
}

/**
 * Check and drop sessions collection if exists
 * @param {mongoose.Connection} db - MongoDB connection
 * @returns {boolean} - True if successful, false otherwise
 */
async function dropSessionsCollection(db) {
  try {
    const collections = await db.db.listCollections({ name: SESSION_COLLECTION }).toArray();
    
    if (collections.length > 0) {
      // Check for indexes on sessions collection
      log('Examining session collection indexes before dropping...');
      try {
        const sessionIndexes = await db.db.collection(SESSION_COLLECTION).indexes();
        log(`Found ${sessionIndexes.length} indexes on sessions collection`);
        sessionIndexes.forEach(index => {
          log(`- Index name: ${index.name}, key: ${JSON.stringify(index.key)}`);
        });
      } catch (indexError) {
        log(`Error examining session indexes: ${indexError.message}`);
      }
      
      log('Dropping sessions collection...');
      try {
        await db.db.collection(SESSION_COLLECTION).drop({ force: true });
        log('Sessions collection dropped successfully with force option');
      } catch (dropError) {
        log(`Warning during sessions drop: ${dropError.message}`);
        try {
          await db.db.command({ drop: SESSION_COLLECTION, writeConcern: { w: "majority" } });
          log('Sessions collection dropped using command with majority write concern');
        } catch (cmdError) {
          log(`Warning: Command drop for sessions also failed: ${cmdError.message}`);
        }
      }
    } else {
      log('Sessions collection does not exist, nothing to drop');
    }
    
    return true;
  } catch (error) {
    log(`Error dropping sessions collection: ${error.message}`);
    return false;
  }
}

/**
 * Check and drop accounts collection if exists
 * @param {mongoose.Connection} db - MongoDB connection
 * @returns {boolean} - True if successful, false otherwise
 */
async function dropAccountsCollection(db) {
  try {
    const collections = await db.db.listCollections({ name: ACCOUNTS_COLLECTION }).toArray();
    
    if (collections.length > 0) {
      // Check for indexes on accounts collection
      log('Examining accounts collection indexes before dropping...');
      try {
        const accountsIndexes = await db.db.collection(ACCOUNTS_COLLECTION).indexes();
        log(`Found ${accountsIndexes.length} indexes on accounts collection`);
        accountsIndexes.forEach(index => {
          log(`- Index name: ${index.name}, key: ${JSON.stringify(index.key)}`);
        });
      } catch (indexError) {
        log(`Error examining accounts indexes: ${indexError.message}`);
      }
      
      log('Dropping accounts collection...');
      try {
        await db.db.collection(ACCOUNTS_COLLECTION).drop({ force: true });
        log('Accounts collection dropped successfully with force option');
      } catch (dropError) {
        log(`Warning during accounts drop: ${dropError.message}`);
        try {
          await db.db.command({ drop: ACCOUNTS_COLLECTION, writeConcern: { w: "majority" } });
          log('Accounts collection dropped using command with majority write concern');
        } catch (cmdError) {
          log(`Warning: Command drop for accounts also failed: ${cmdError.message}`);
        }
      }
    } else {
      log('Accounts collection does not exist, nothing to drop');
    }
    
    return true;
  } catch (error) {
    log(`Error dropping accounts collection: ${error.message}`);
    return false;
  }
}

/**
 * Check and drop cards collection if exists
 * @param {mongoose.Connection} db - MongoDB connection
 * @returns {boolean} - True if successful, false otherwise
 */
async function dropCardsCollection(db) {
  try {
    const collections = await db.db.listCollections({ name: CARDS_COLLECTION }).toArray();
    
    if (collections.length > 0) {
      // Check for indexes on cards collection
      log('Examining cards collection indexes before dropping...');
      try {
        const cardsIndexes = await db.db.collection(CARDS_COLLECTION).indexes();
        log(`Found ${cardsIndexes.length} indexes on cards collection`);
        cardsIndexes.forEach(index => {
          log(`- Index name: ${index.name}, key: ${JSON.stringify(index.key)}`);
        });
      } catch (indexError) {
        log(`Error examining cards indexes: ${indexError.message}`);
      }
      
      log('Dropping cards collection...');
      try {
        await db.db.collection(CARDS_COLLECTION).drop({ force: true });
        log('Cards collection dropped successfully with force option');
      } catch (dropError) {
        log(`Warning during cards drop: ${dropError.message}`);
        try {
          await db.db.command({ drop: CARDS_COLLECTION, writeConcern: { w: "majority" } });
          log('Cards collection dropped using command with majority write concern');
        } catch (cmdError) {
          log(`Warning: Command drop for cards also failed: ${cmdError.message}`);
        }
      }
    } else {
      log('Cards collection does not exist, nothing to drop');
    }
    
    return true;
  } catch (error) {
    log(`Error dropping cards collection: ${error.message}`);
    return false;
  }
}

/**
 * Check and drop messages collection if exists
 * @param {mongoose.Connection} db - MongoDB connection
 * @returns {boolean} - True if successful, false otherwise
 */
async function dropMessagesCollection(db) {
  try {
    const collections = await db.db.listCollections({ name: MESSAGES_COLLECTION }).toArray();
    
    if (collections.length > 0) {
      // Check for indexes on messages collection
      log('Examining messages collection indexes before dropping...');
      try {
        const messagesIndexes = await db.db.collection(MESSAGES_COLLECTION).indexes();
        log(`Found ${messagesIndexes.length} indexes on messages collection`);
        messagesIndexes.forEach(index => {
          log(`- Index name: ${index.name}, key: ${JSON.stringify(index.key)}`);
        });
      } catch (indexError) {
        log(`Error examining messages indexes: ${indexError.message}`);
      }
      
      log('Dropping messages collection...');
      try {
        await db.db.collection(MESSAGES_COLLECTION).drop({ force: true });
        log('Messages collection dropped successfully with force option');
      } catch (dropError) {
        log(`Warning during messages drop: ${dropError.message}`);
        try {
          await db.db.command({ drop: MESSAGES_COLLECTION, writeConcern: { w: "majority" } });
          log('Messages collection dropped using command with majority write concern');
        } catch (cmdError) {
          log(`Warning: Command drop for messages also failed: ${cmdError.message}`);
        }
      }
    } else {
      log('Messages collection does not exist, nothing to drop');
    }
    
    return true;
  } catch (error) {
    log(`Error dropping messages collection: ${error.message}`);
    return false;
  }
}

/**
 * Main function to orchestrate the database reset process
 */
async function main() {
  let connection;
  
  try {
    log('Starting database reset process...');
    log(`MongoDB URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@')}`);
    
    // Connect to the database
    connection = await connectToDatabase();
    
    // Get database information
    const dbInfo = await connection.db.admin().serverInfo();
    log(`Connected to MongoDB version: ${dbInfo.version}`);
    
    // List all collections before reset
    const existingCollections = await connection.db.listCollections().toArray();
    log(`Found ${existingCollections.length} collections before reset:`);
    existingCollections.forEach(collection => {
      log(`- ${collection.name}`);
    });
    
    // Reset users collection
    const usersReset = await resetUsersCollection(connection);
    if (!usersReset) {
      log('Failed to reset users collection');
      process.exit(1);
    }
    
    // Drop sessions collection if it exists
    const sessionsDropped = await dropSessionsCollection(connection);
    if (!sessionsDropped) {
      log('Failed to drop sessions collection');
    }
    
    // Drop accounts collection if it exists
    const accountsDropped = await dropAccountsCollection(connection);
    if (!accountsDropped) {
      log('Failed to drop accounts collection');
    }
    
    // Drop cards collection if it exists
    const cardsDropped = await dropCardsCollection(connection);
    if (!cardsDropped) {
      log('Failed to drop cards collection');
    }
    
    // Drop messages collection if it exists
    const messagesDropped = await dropMessagesCollection(connection);
    if (!messagesDropped) {
      log('Failed to drop messages collection');
    }
    
    // Final verification of database state
    const finalCollections = await connection.db.listCollections().toArray();
    log(`Database now has ${finalCollections.length} collections:`);
    finalCollections.forEach(collection => {
      log(`- ${collection.name}`);
    });
    
    log('Database reset completed successfully!');
    
    // Final database validation check - look for any email indexes across all collections
    log('Performing final database-wide check for email indexes...');
    const allCollections = await connection.db.listCollections().toArray();
    for (const collection of allCollections) {
      try {
        const collIndexes = await connection.db.collection(collection.name).indexes();
        const hasEmailIndex = collIndexes.some(idx => 
          idx.name.includes('email') || 
          (idx.key && Object.keys(idx.key).some(k => k.includes('email')))
        );
        
        if (hasEmailIndex) {
          log(`WARNING: Collection ${collection.name} still has email indexes!`);
          collIndexes.filter(idx => 
            idx.name.includes('email') || 
            (idx.key && Object.keys(idx.key).some(k => k.includes('email')))
          ).forEach(idx => {
            log(`- Email index found: ${idx.name}, key: ${JSON.stringify(idx.key)}`);
          });
        } else {
          log(`Collection ${collection.name} has no email indexes - good!`);
        }
      } catch (indexError) {
        log(`Error checking indexes for collection ${collection.name}: ${indexError.message}`);
      }
    }
    
    log('Database reset completed successfully!');
  } catch (error) {
    log(`Unexpected error: ${error.message}`);
    process.exit(1);
  } finally {
    // Close the connection
    if (connection) {
      await connection.close();
      log('Database connection closed');
    }
  }
}

// Run the script
main();

