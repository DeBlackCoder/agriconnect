// Optimized MongoDB connection utility using Mongoose
import mongoose from 'mongoose';

// Environment variable validation
const env = {
  MONGODB_URI: process.env.MONGODB_URI || '',
};

if (!env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

// Connection cache with connecting flag
interface CacheState {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  connecting: boolean;
}

declare global {
  var mongooseCache: CacheState | undefined;
}

const cache: CacheState = global.mongooseCache || {
  conn: null,
  promise: null,
  connecting: false,
};

if (!global.mongooseCache) {
  global.mongooseCache = cache;
}

// Ensure critical indexes for performance
async function ensureIndexes(db: any) {
  try {
    console.log('[db] Ensuring critical indexes...');
    
    // Products indexes for fast queries
    await db.collection('products').createIndex({ isActive: 1, createdAt: -1 }, { background: true });
    await db.collection('products').createIndex({ categoryId: 1, isActive: 1 }, { background: true });
    await db.collection('products').createIndex({ farmerId: 1 }, { background: true });
    await db.collection('products').createIndex({ name: 'text', description: 'text' }, { background: true });
    await db.collection('products').createIndex({ pricePerUnit: 1, isActive: 1 }, { background: true });
    
    // Orders indexes
    await db.collection('orders').createIndex({ buyerId: 1, status: 1 }, { background: true });
    await db.collection('orders').createIndex({ sellerId: 1, status: 1 }, { background: true });
    await db.collection('orders').createIndex({ createdAt: -1 }, { background: true });
    await db.collection('orders').createIndex({ productId: 1 }, { background: true });
    
    // Wishlist indexes
    await db.collection('wishlists').createIndex({ userId: 1, productId: 1 }, { unique: true, background: true });
    await db.collection('wishlists').createIndex({ userId: 1 }, { background: true });
    
    // Users indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true, background: true });
    
    console.log('[db] ✅ Critical indexes ensured');
  } catch (error) {
    console.error('[db] ⚠️ Error ensuring indexes:', error);
    // Non-blocking - continue even if index creation fails
  }
}

export async function connectDB() {
  // Use validated environment variable
  const MONGODB_URI = env.MONGODB_URI;

  // Return cached connection if available
  if (cache.conn) {
    return cache.conn;
  }

  // If a connection attempt is already in progress, wait for it
  if (cache.connecting && cache.promise) {
    console.log('[db] 🔄 Connection attempt already in progress, waiting...');
    return await cache.promise;
  }

  // If no connection attempt is in progress, start one
  if (!cache.promise) {
    console.log('[db] 🚀 Starting new MongoDB connection...');
    cache.connecting = true;
    
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,    // Faster timeout
      socketTimeoutMS: 30000,             // Shorter socket timeout
      maxPoolSize: 100,                   // More connections
      minPoolSize: 20,                    // More minimum connections
      connectTimeoutMS: 5000,             // Faster connect timeout
      heartbeatFrequencyMS: 5000,         // Faster heartbeat
      maxIdleTimeMS: 20000,               // Close idle faster
      compressors: ['zlib'],
      retryWrites: true,
      retryReads: true,
      readPreference: 'primaryPreferred',
    }).then(async (m) => {
      try {
        const db = m.connection.db;
        if (db) {
          // Check and fix any problematic indexes
          const indexes = await db.collection('users').indexes();
          const badIndex = indexes.find((idx: { name?: string; sparse?: boolean }) =>
            idx.name === 'googleId_1' && !idx.sparse
          );
          if (badIndex) {
            await db.collection('users').dropIndex('googleId_1');
            console.log('[db] 🔧 Dropped non-sparse googleId_1 index');
          }

          // Ensure critical indexes exist (non-blocking)
          ensureIndexes(db).catch(err => 
            console.error('[db] Index creation error:', err)
          );
        }
      } catch {
        /* non-blocking — index operations may fail */
      }
      
      console.log('[db] ✅ MongoDB connection established successfully');
      cache.connecting = false;
      return m;
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    console.error('[db] ❌ MongoDB connection failed:', err);
    cache.promise = null;
    cache.connecting = false;
    throw err;
  }

  return cache.conn;
}

export default connectDB;
