/**
 * CDN cache header presets for GET endpoints.
 *
 * - `s-maxage` is the shared cache (Vercel / CDN) freshness window.
 * - `stale-while-revalidate` keeps serving stale content while we refresh.
 * - We intentionally omit `max-age` so end-user browsers don't pin stale data.
 */
export const CACHE_SUBJECTS = "public, s-maxage=3600, stale-while-revalidate=86400";
export const CACHE_TUTORS = "public, s-maxage=60, stale-while-revalidate=600";
export const CACHE_ARTICLES = "public, s-maxage=300, stale-while-revalidate=3600";
