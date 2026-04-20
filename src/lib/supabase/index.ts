// Public entry point for Supabase helpers.
// Import server vs browser variants from their dedicated files —
// this index only re-exports the auth helpers (safe on both sides).

export {
  getCurrentUser,
  requireAuth,
  requireAdmin,
  requireRole,
  AuthError,
  isAuthError,
  type AuthenticatedUser,
} from "./auth-helpers";
