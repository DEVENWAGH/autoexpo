import mongoose from "mongoose";
import { ConnectionOptions } from "../types/type.db";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const MONGODB_URI = process.env.MONGODB_URI;
const cached = global.mongoose ?? { conn: null, promise: null };

export async function dbConnect() {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts: ConnectionOptions = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        connectTimeoutMS: 10000, // Add connection timeout
        retryWrites: true, // Enable retry writes
      };

      cached.promise = mongoose
        .connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log("Connected to MongoDB");
          return mongoose.connection;
        });
    }

    cached.conn = await cached.promise;

    cached.conn.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    // Handle connection errors
    cached.conn.on("error", (error) => {
      console.error("MongoDB connection error:", error);
      cached.conn = null;
      cached.promise = null;
    });

    // Handle disconnection
    cached.conn.on("disconnected", () => {
      console.warn("MongoDB disconnected");
      cached.conn = null;
    });

    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    cached.conn = null;
    throw error;
  }
}

// Optional: Add cleanup function for graceful shutdown
export async function disconnect() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}