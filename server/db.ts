import { createClient } from '@supabase/supabase-js';
import * as schema from "@shared/schema";

// Initialize Supabase connection
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Supabase environment variables are required. ' +
    'Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// For now, we'll use Supabase client directly instead of Drizzle
// This avoids the need for direct PostgreSQL connection
export const db = supabase;