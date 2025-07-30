import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
  // Use fallback values from .env.local instead of throwing an error
  const fallbackUrl = 'https://ohuzhsdmlechlijzgdya.supabase.co';
  const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odXpoc2RtbGVjaGxpanpnZHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTgzMjgsImV4cCI6MjA2MjE3NDMyOH0.b6z7o84ZX9zlgJiTeWkxuxW80vAp0OZ14AqWbRUR7e4';
  console.warn('Using fallback Supabase credentials');
  supabaseInstance = createClient(fallbackUrl, fallbackKey);
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseInstance;