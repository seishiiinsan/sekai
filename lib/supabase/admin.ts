import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Service-role Supabase client. Bypasses RLS — use ONLY in trusted server code
 * (Server Actions / Route Handlers) for the writes a client must never perform:
 * inserting attempts, updating mastery, crediting XP via apply_series_result.
 *
 * The secret key must never reach the browser. Importing this module in client
 * code throws thanks to "server-only".
 */
export function createAdminClient() {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not set. Add it to .env.local (Supabase Dashboard → Settings → API keys → service_role).",
    );
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
