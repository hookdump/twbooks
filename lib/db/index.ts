import { Database } from './interface';
import { SQLiteDatabase, getDatabase as getSQLiteDatabaseInstance } from './sqlite';
import { KVDatabase, getKVDatabase as getKVDatabaseInstance } from './kv';

/**
 * Database Factory
 * 
 * This factory automatically determines which database implementation to use:
 * - If KV_URL environment variable exists (Vercel environment), use KV storage
 * - Otherwise, use SQLite for local development
 * 
 * Environment Variables Required for Vercel KV:
 * - KV_URL: The connection URL for Vercel KV
 * - KV_REST_API_URL: REST API URL for Vercel KV
 * - KV_REST_API_TOKEN: Authentication token for Vercel KV REST API
 * - KV_REST_API_READ_ONLY_TOKEN: Read-only token (optional)
 * 
 * Setup Instructions:
 * 1. Create a Vercel KV database in your Vercel dashboard
 * 2. Copy the environment variables from the KV database settings
 * 3. Add them to your Vercel project's environment variables
 * 4. For local development with KV, add them to your .env.local file
 * 
 * Local Development:
 * - Without KV environment variables: Uses SQLite (data/twbooks.db)
 * - With KV environment variables: Uses Vercel KV (useful for testing)
 * 
 * Production (Vercel):
 * - Automatically uses KV when deployed to Vercel with KV configured
 */

// Global database instance
let dbInstance: Database | null = null;

/**
 * Determines if Vercel KV should be used based on environment
 */
function shouldUseKV(): boolean {
  // Check if we're in a Vercel environment with KV configured
  const hasKvUrl = !!process.env.KV_URL;
  const hasKvRestUrl = !!process.env.KV_REST_API_URL;
  const hasKvToken = !!process.env.KV_REST_API_TOKEN;
  
  const useKV = hasKvUrl && hasKvRestUrl && hasKvToken;
  
  if (useKV) {
    console.log('🔗 Using Vercel KV storage for database operations');
  } else {
    console.log('💾 Using SQLite storage for database operations');
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️  Warning: Using SQLite in production. Consider setting up Vercel KV.');
    }
  }
  
  return useKV;
}

/**
 * Gets the database instance, creating it if necessary
 * Automatically selects between KV and SQLite based on environment
 */
export function getDatabase(): Database {
  if (!dbInstance) {
    if (shouldUseKV()) {
      dbInstance = getKVDatabaseInstance();
    } else {
      dbInstance = getSQLiteDatabaseInstance();
    }
  }
  return dbInstance;
}

/**
 * Forces the use of SQLite database (useful for testing)
 */
export function getSQLiteDatabase(): SQLiteDatabase {
  return new SQLiteDatabase();
}

/**
 * Forces the use of KV database (useful for testing)
 */
export function getKVDatabase(): KVDatabase {
  return new KVDatabase();
}

/**
 * Resets the database instance (useful for testing)
 */
export function resetDatabaseInstance(): void {
  if (dbInstance) {
    dbInstance.close().catch(console.error);
  }
  dbInstance = null;
}

/**
 * Gets database type information
 */
export function getDatabaseInfo(): { type: 'sqlite' | 'kv'; instance: Database } {
  const db = getDatabase();
  const type = shouldUseKV() ? 'kv' : 'sqlite';
  return { type, instance: db };
}

// Export the Database interface for type checking
export { Database } from './interface';
export type { DatabaseInterface } from '@/types';