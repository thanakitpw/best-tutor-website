/**
 * Root Next.js middleware.
 *
 * Responsibilities:
 * 1. Refresh the Supabase auth session on every request (cookie rotation).
 * 2. Protect all /admin/* routes — redirect unauthenticated visitors to
 *    /admin/login. The login page itself is always publicly accessible.
 */
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ADMIN_LOGIN = "/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh session + get current user (cookie rotation handled inside).
  const { response, user } = await updateSession(request);

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
