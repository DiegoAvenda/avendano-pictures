import mongoose from 'mongoose';

// Cache the connection across warm serverless invocations so we don't open a
// brand new MongoDB connection on every request (Vercel reuses the module context).
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  __mongooseCache?: MongooseCache;
};

const cache: MongooseCache =
  globalWithMongoose.__mongooseCache ??
  (globalWithMongoose.__mongooseCache = { conn: null, promise: null });

const connectDB = async (mongoUri: string): Promise<typeof mongoose> => {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    // `bufferCommands: false` makes queries fail fast instead of hanging when
    // there is no live connection, which is what we want in a serverless runtime.
    cache.promise = mongoose.connect(mongoUri, { bufferCommands: false });
  }

  try {
    cache.conn = await cache.promise;
    console.log('MongoDB connected');
    return cache.conn;
  } catch (error) {
    // Reset the cache so the next invocation retries instead of awaiting a
    // permanently rejected promise.
    cache.promise = null;
    const message = error instanceof Error ? error.message : String(error);
    console.error('MongoDB connection error:', message);
    throw error;
  }
};

export default connectDB;
