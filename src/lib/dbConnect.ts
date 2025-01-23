import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

interface DbOptions {
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
}

const connection: ConnectionObject = {};

const defaultOptions: DbOptions = {
  retryAttempts: 3,
  retryDelay: 5000,
  timeout: 30000,
};

async function dbConnect(options: DbOptions = defaultOptions): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const mongooseOptions = {
    bufferCommands: true,
    autoCreate: true,
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: options.timeout,
    connectTimeoutMS: options.timeout,
    family: 4, // Use IPv4
  };

  let attempts = 0;

  while (attempts < (options.retryAttempts || 1)) {
    try {
      // Attempt to connect to the database
      const db = await mongoose.connect(mongoUri, mongooseOptions);
      connection.isConnected = db.connections[0].readyState;

      console.log("Database connected successfully");

      // Add connection event listeners
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
      });

      return;
    } catch (error) {
      attempts++;
      console.error(`Database connection attempt ${attempts} failed:`, error);

      if (attempts === options.retryAttempts) {
        console.error("Max retry attempts reached. Exiting...");
        process.exit(1);
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, options.retryDelay));
    }
  }
}

export default dbConnect;
