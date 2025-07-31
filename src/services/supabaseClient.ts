import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
  throw new Error('Supabase URL and API key must be provided in environment variables. Please check your .env file.');
  // No fallback credentials for security reasons
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseInstance;