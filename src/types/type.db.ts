import { Connection, ConnectOptions } from "mongoose";

interface MongooseConnection {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

export interface ConnectionOptions extends ConnectOptions {
  bufferCommands?: boolean;
  maxPoolSize?: number;
  bufferMaxEntries?: number;
}

declare global {
  var mongoose: MongooseConnection;
}

export {};