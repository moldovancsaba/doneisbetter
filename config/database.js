const mongoose = require('mongoose');

// Connection options with improved reliability settings
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  heartbeatFrequencyMS: 2000,
  maxPoolSize: 10,
  minPoolSize: 2,
  retryWrites: true
};

// Maximum number of connection retries
const MAX_RETRIES = 3;
const RETRY_INTERVAL = 1000; // 1 second

const connectWithRetry = async (retryCount = 0) => {
  try {
    console.log(`Attempting to connect to MongoDB (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/doneisbetter',
      mongooseOptions
    );
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying connection in ${RETRY_INTERVAL}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      return connectWithRetry(retryCount + 1);
    } else {
      console.error('Max connection retries reached. Exiting...');
      return false;
    }
  }
};

const connectToDatabase = async () => {
  const connected = await connectWithRetry();
  
  if (!connected) {
    process.exit(1);
  }

  // Handle connection events
  mongoose.connection.on('error', error => {
    console.error('MongoDB connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      console.error('Error during connection closure:', error);
      process.exit(1);
    }
  });
};

module.exports = connectToDatabase;

