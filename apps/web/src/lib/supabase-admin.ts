import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Admin Client — uses service_role key.
 * Only use on the SERVER (API routes). Never expose in client code.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

export function createAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      '[FanShot] Cannot create admin client — SUPABASE_SERVICE_ROLE_KEY missing'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
