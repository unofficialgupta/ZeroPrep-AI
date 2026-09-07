/**
 * MongoDB connection pool — cached across serverless invocations.
 *
 * Next.js API routes are serverless functions: each cold start would open a
 * new connection without this cache. We store the promise on `globalThis`
 * so it survives hot-reloads in dev and is shared across all route invocations
 * in the same process in prod.
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error('[ZeroPrep] MONGODB_URI is not defined. Add it to .env.local');
}

// ── Module-level cache (survives across serverless invocations in same process)
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Attach to globalThis so it survives Next.js hot-reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = globalThis.__mongooseCache ?? { conn: null, promise: null };
globalThis.__mongooseCache = cache;

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
