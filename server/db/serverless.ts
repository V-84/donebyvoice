import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema.js';

/**
 * Serverless-optimized database connection
 * Use this in Vercel serverless functions instead of the default db/index.ts
 */

// Get connection string from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create postgres client with serverless-friendly settings
// Prepare: false is important for serverless edge functions
const client = postgres(connectionString, {
  prepare: false,
  max: 1, // Single connection for serverless
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export schema
export { schema };
export * from './schema.js';
