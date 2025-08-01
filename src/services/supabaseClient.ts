import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
  console.warn('Creating a dummy Supabase client to prevent app crashes. Some features will be limited.');
  // Create a mock client that won't throw errors but won't work either
  supabaseInstance = {
    auth: {
      signUp: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      signIn: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: null, error: null, unsubscribe: () => {} }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
    }),
  };
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseInstance;