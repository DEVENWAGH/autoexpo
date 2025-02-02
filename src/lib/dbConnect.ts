import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

const MONGODB_URI = process.env.MONGODB_URI

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null }
}

export async function dbConnect() {
  try {
    if (global.mongoose.conn) {
      return global.mongoose.conn
    }

    if (!global.mongoose.promise) {
      const opts = {
        bufferCommands: false,
      }

      global.mongoose.promise = mongoose.connect(MONGODB_URI, opts)
    }

    const conn = await global.mongoose.promise
    global.mongoose.conn = conn
    return conn
  } catch (error) {
    console.error('MongoDB connection error:', error)
    global.mongoose.promise = null
    throw error
  }
}