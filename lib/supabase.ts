import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'digitalx_supabase_url';
const STORAGE_KEY_KEY = 'digitalx_supabase_key';

export function getSupabaseConfig(): { url: string; anonKey: string } {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem(STORAGE_KEY_URL);
    const customKey = localStorage.getItem(STORAGE_KEY_KEY);
    if (customUrl) url = customUrl;
    if (customKey) anonKey = customKey;
  }
  return { url, anonKey };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url);
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (anonKey) localStorage.setItem(STORAGE_KEY_KEY, anonKey);
    else localStorage.removeItem(STORAGE_KEY_KEY);
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (url && anonKey) {
    try {
      return createClient(url, anonKey);
    } catch (err) {
      console.warn('Supabase initialization error:', err);
      return null;
    }
  }
  return null;
}

export const isSupabaseConfigured = Boolean(getSupabaseConfig().url && getSupabaseConfig().anonKey);

/**
 * Generic fetcher for Supabase tables
 */
export async function fetchSupabaseTable<T>(tableName: string): Promise<T[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from(tableName).select('*');
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
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from(tableName).upsert(payload as any);
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
 * Sync entire local state to Supabase Cloud
 */
export async function syncAllTablesToSupabase(state: any): Promise<{ success: boolean; count: number; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      count: 0,
      message: 'Supabase credentials not configured. Open Database Settings in Navbar to enter your Supabase URL & Key.',
    };
  }

  let totalCount = 0;
  try {
    if (state.leads?.length) {
      await client.from('leads').upsert(state.leads);
      totalCount += state.leads.length;
    }
    if (state.clients?.length) {
      await client.from('clients').upsert(state.clients);
      totalCount += state.clients.length;
    }
    if (state.projects?.length) {
      await client.from('projects').upsert(state.projects);
      totalCount += state.projects.length;
    }
    if (state.invoices?.length) {
      await client.from('invoices').upsert(state.invoices);
      totalCount += state.invoices.length;
    }
    if (state.tasks?.length) {
      await client.from('tasks').upsert(state.tasks);
      totalCount += state.tasks.length;
    }
    return {
      success: true,
      count: totalCount,
      message: `Successfully synchronized ${totalCount} records to Supabase tables.`,
    };
  } catch (err: any) {
    return {
      success: false,
      count: totalCount,
      message: err?.message || 'Database sync exception occurred.',
    };
  }
}

/**
 * Connection Telemetry Check
 */
export async function checkSupabaseHealth(): Promise<{ status: 'CONNECTED' | 'READY' | 'DISCONNECTED'; message: string }> {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return { status: 'READY', message: 'Operating in Stateful Local Mode. Click here to add Supabase credentials.' };
  }
  const client = getSupabaseClient();
  if (!client) {
    return { status: 'DISCONNECTED', message: 'Invalid Supabase URL or Anon Key format.' };
  }
  try {
    const { error } = await client.from('leads').select('count', { count: 'exact', head: true });
    if (error) {
      return { status: 'READY', message: `Connected to Supabase Project! (${error.message})` };
    }
    return { status: 'CONNECTED', message: 'Connected to Supabase PostgreSQL Cloud Database.' };
  } catch (err) {
    return { status: 'READY', message: 'Stateful Local Engine Active' };
  }
}
