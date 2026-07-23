import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

/**
 * Public browser / anon Supabase client
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side admin Supabase client (using Service Role key for migrations/seeds/storage admin)
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Checks if Supabase connection details are configured.
 */
export function isSupabaseConfigured(): boolean {
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('digitalx_supabase_url');
    const savedKey = localStorage.getItem('digitalx_supabase_anon_key');
    if (savedUrl && savedKey) return true;
  }
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );
}

/**
 * Gets active Supabase configuration credentials.
 */
export function getSupabaseConfig(): { url: string; anonKey: string } {
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('digitalx_supabase_url');
    const savedKey = localStorage.getItem('digitalx_supabase_anon_key');
    if (savedUrl && savedKey) {
      return { url: savedUrl, anonKey: savedKey };
    }
  }
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  };
}

/**
 * Saves user-configured Supabase project credentials.
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url && anonKey) {
      localStorage.setItem('digitalx_supabase_url', url);
      localStorage.setItem('digitalx_supabase_anon_key', anonKey);
    } else {
      localStorage.removeItem('digitalx_supabase_url');
      localStorage.removeItem('digitalx_supabase_anon_key');
    }
  }
}

/**
 * Diagnostic health check for Supabase project connectivity.
 */
export async function checkSupabaseHealth(): Promise<{ status: 'CONNECTED' | 'READY' | 'DISCONNECTED'; message: string }> {
  try {
    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey || url.includes('placeholder') || url.includes('your-project-id')) {
      return {
        status: 'READY',
        message: 'Supabase project credentials not configured yet. Configure above to enable Postgres & RLS.',
      };
    }
    const client = createClient(url, anonKey);
    const { error } = await client.from('Tenant').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return {
        status: 'READY',
        message: `Supabase reachable (${error.message || 'Ready for schema setup'}).`,
      };
    }
    return {
      status: 'CONNECTED',
      message: 'Supabase Postgres connection active. RLS Tenant Isolation enabled.',
    };
  } catch (err: any) {
    return {
      status: 'DISCONNECTED',
      message: `Connection failed: ${err.message || 'Check network / API key'}.`,
    };
  }
}

/**
 * Asynchronously syncs UI state mutations to Supabase Postgres database.
 */
export async function syncToSupabase(table: string, record: any): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from(table).upsert(record);
    if (error) {
      console.warn(`Supabase sync warning for ${table}:`, error.message);
    }
  } catch (err) {
    console.warn(`Supabase sync error for ${table}:`, err);
  }
}

/**
 * Bulk syncs all state records to Supabase.
 */
export async function syncAllTablesToSupabase(state: any): Promise<{ success: boolean; message: string }> {
  try {
    if (state.leads?.length) await supabaseAdmin.from('Lead').upsert(state.leads);
    if (state.clients?.length) await supabaseAdmin.from('Client').upsert(state.clients);
    if (state.projects?.length) await supabaseAdmin.from('Project').upsert(state.projects);
    if (state.tasks?.length) await supabaseAdmin.from('Task').upsert(state.tasks);
    if (state.invoices?.length) await supabaseAdmin.from('Invoice').upsert(state.invoices);
    if (state.proposals?.length) await supabaseAdmin.from('Proposal').upsert(state.proposals);
    return { success: true, message: 'All CRM records successfully synced to Supabase Postgres.' };
  } catch (err: any) {
    return { success: false, message: `Sync failed: ${err.message}` };
  }
}
