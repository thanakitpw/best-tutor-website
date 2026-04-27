/**
 * Root Next.js middleware.
 *
 * Responsibilities:
 * 1. Refresh the Supabase auth session on every request (cookie rotation).
 * 2. Protect all /admin/* routes — redirect unauthenticated visitors to
 *    /admin/login. The login page itself is always publicly accessible.
 * 3. Gate not-yet-launched public routes behind a coming-soon page so the
 *    first deploy can ship the tutor section without exposing half-baked
 *    pages. Set `NEXT_PUBLIC_LAUNCH_<feature>=true` in the env to flip a
 *    feature live without a code change.
 */
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ADMIN_LOGIN = "/admin/login";

/**
 * Routes that are intentionally hidden until the matching launch flag is set.
 * Each entry guards `/<prefix>` and `/<prefix>/...` (any nested path).
 *
 * To unlock blog: set `NEXT_PUBLIC_LAUNCH_BLOG=true` in the deploy env.
 */
const COMING_SOON_GATES: Array<{ prefix: string; flagEnv: string }> = [
  { prefix: "/blog", flagEnv: "NEXT_PUBLIC_LAUNCH_BLOG" },
  { prefix: "/find-tutor", flagEnv: "NEXT_PUBLIC_LAUNCH_FIND_TUTOR" },
  { prefix: "/join-with-us", flagEnv: "NEXT_PUBLIC_LAUNCH_JOIN" },
  { prefix: "/tutor-register", flagEnv: "NEXT_PUBLIC_LAUNCH_TUTOR_REGISTER" },
  { prefix: "/review", flagEnv: "NEXT_PUBLIC_LAUNCH_REVIEW" },
];

function isUnderPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh session + get current user (cookie rotation handled inside).
  const { response, user } = await updateSession(request);

  // Coming-soon gating — public-only; admin and the coming-soon page itself
  // are never rewritten so admins can still QA the gated features.
  if (!pathname.startsWith("/admin") && pathname !== "/coming-soon") {
    for (const gate of COMING_SOON_GATES) {
      if (
        isUnderPrefix(pathname, gate.prefix) &&
        process.env[gate.flagEnv] !== "true"
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/coming-soon";
        url.search = "";
        return NextResponse.rewrite(url);
      }
    }
  }

  // Guard: /admin/* (except the login page itself)
  if (pathname.startsWith("/admin") && pathname !== ADMIN_LOGIN) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = ADMIN_LOGIN;
      // Preserve the originally-requested path so we can redirect back after login.
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match every path EXCEPT:
     *  - _next/static   (static assets)
     *  - _next/image    (image optimization)
     *  - favicon.ico
     *  - public files with an extension (e.g. images, fonts)
     *
     * This ensures the session is refreshed on every real page/API request
     * while skipping static file serving.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|css|js|map)$).*)",
  ],
};
