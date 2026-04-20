import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client — use in Client Components only.
 * Reads env vars baked at build time via NEXT_PUBLIC_ prefix.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "ไม่พบ environment variable ของ Supabase (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)",
    );
  }

  return createBrowserClient(url, anonKey);
}
