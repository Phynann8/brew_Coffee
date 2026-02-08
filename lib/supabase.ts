import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase credentials not found. Using mock data mode.\n' +
        'To enable real data, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local'
    );
}

// Create client (will be null-safe in hooks)
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;
