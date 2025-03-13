import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = 'autoexpo'; // Choose an appropriate database name

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Cache variables
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

/**
 * Connect to MongoDB database
 */
export async function connectToDatabase() {
  // If we have cached values, use them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  
  // Create a new MongoDB client
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  
  const db = client.db(DATABASE_NAME);
  
  // Cache the client and db for reuse
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}
