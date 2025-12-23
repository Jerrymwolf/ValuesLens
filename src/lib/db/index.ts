import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Create the Neon SQL client
const sql = neon(process.env.DATABASE_URL!);

// Create and export the Drizzle database instance
export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * from './schema';
