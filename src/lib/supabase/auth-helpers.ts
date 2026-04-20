import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "./server";
import type { UserRole } from "@prisma/client";

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
};

/**
 * Return the currently signed-in user + their role from the DB, or null.
 * Cached per-request via React.cache to avoid duplicate round-trips.
 */
export const getCurrentUser = cache(
  async (): Promise<AuthenticatedUser | null> => {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return null;
    }

    // Pull role from our own users table (authoritative, not JWT metadata).
    const record = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!record) {
      return null;
    }

    return {
      id: record.id,
      email: record.email,
      name: record.name,
      role: record.role,
    };
  },
);

/**
 * Throw AuthError if no user is signed in. Returns the authenticated user.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("UNAUTHENTICATED", "กรุณาเข้าสู่ระบบก่อนดำเนินการ");
  }
  return user;
}

/**
 * Throw AuthError if user is not an admin or super_admin. Editors are rejected.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    throw new AuthError(
      "FORBIDDEN",
      "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ (ต้องเป็นผู้ดูแลระบบ)",
    );
  }
  return user;
}

/**
 * Throw AuthError if user does not have at least one of the accepted roles.
 */
export async function requireRole(
  ...roles: readonly UserRole[]
): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new AuthError("FORBIDDEN", "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้");
  }
  return user;
}

export class AuthError extends Error {
  readonly code: "UNAUTHENTICATED" | "FORBIDDEN";

  constructor(code: "UNAUTHENTICATED" | "FORBIDDEN", message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}
