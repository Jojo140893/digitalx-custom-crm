import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Generic fetcher for Supabase tables
 */
export async function fetchSupabaseTable<T>(tableName: string): Promise<T[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
      console.warn(`Supabase fetch error on [${tableName}]:`, error.message);
      return null;
    }
    return data as T[];
  } catch (err) {
    console.warn(`Supabase connection exception on [${tableName}]:`, err);
    return null;
  }
}

/**
 * Upsert item to Supabase table
 */
export async function syncToSupabase<T extends { id: string }>(tableName: string, payload: T): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from(tableName).upsert(payload as any);
    if (error) {
      console.warn(`Supabase sync failed on [${tableName}]:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Supabase sync exception on [${tableName}]:`, err);
    return false;
  }
}

/**
 * Helper to fetch leads from Supabase with fallback to local store
 */
export async function fetchSupabaseLeads() {
  return fetchSupabaseTable('leads');
}

/**
 * Connection Telemetry Check
 */
export async function checkSupabaseHealth(): Promise<{ status: 'CONNECTED' | 'READY' | 'DISCONNECTED'; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { status: 'READY', message: 'Local Stateful Mode Active (Add keys to .env to enable Supabase Cloud)' };
  }
  try {
    const { error } = await supabase.from('leads').select('count', { count: 'exact', head: true });
    if (error) {
      return { status: 'READY', message: `Supabase Configured (Table check notice: ${error.message})` };
    }
    return { status: 'CONNECTED', message: 'Connected to Supabase PostgreSQL Cloud Database' };
  } catch (err) {
    return { status: 'READY', message: 'Operating in Local Stateful Mode' };
  }
}

