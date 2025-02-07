// src/lib/supabaseClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Supabase keys (replace with your actual values)
const SUPABASE_URL = 'https://xxmibqfqghztxeszfwyo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bWlicWZxZ2h6dHhlc3pmd3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4NTU5MDgsImV4cCI6MjA1NDQzMTkwOH0.w6LINsyqk69lhOTLwQG5HtRVZF2C-g8a5fUNX-_K2v4';

// Create a Supabase client with AsyncStorage for caching
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native
  },
});
