import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client — reads/writes auth cookies via Next.js cookies().
 * Use this in Server Components, Server Actions, and Route Handlers.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // `cookies().set` can only be called from a Server Action or Route Handler.
            // Ignore in read-only Server Component context — middleware will refresh the session.
          }
        },
      },
    },
  );
}

/**
 * Service-role Supabase client for privileged operations
 * (e.g., creating admin users, bypassing RLS). Never expose to the browser.
 */
export function createSupabaseServiceRoleClient() {
  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // no-op — service role clients don't persist sessions
        },
      },
    },
  );
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`ไม่พบ environment variable ที่จำเป็น: ${name}`);
  }
  return value;
}
