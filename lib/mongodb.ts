import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface GlobalWithMongoose {
  mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

declare const global: GlobalWithMongoose & typeof globalThis;

export default async function dbConnect() {
  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }

  if (global.mongoose.conn) return global.mongoose.conn;

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}
