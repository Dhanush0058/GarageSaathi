// Supabase Client Wrapper
// Handles both live Supabase backend and seamless local offline fallback.

import { createClient } from '@supabase/supabase-js';
import { SafeStorage } from '../storage/safeStorage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  process.env.EXPO_PUBLIC_SUPABASE_URL &&
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.EXPO_PUBLIC_SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SafeStorage,
    autoRefreshToken: isSupabaseConfigured,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
