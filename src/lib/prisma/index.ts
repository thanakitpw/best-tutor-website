import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 requires a driver adapter. We use `@prisma/adapter-pg` backed by
// `pg` because Supabase exposes a standard Postgres connection string.
// Ref: https://pris.ly/d/prisma7-client-config
//
// The client is created lazily so the module can be imported during
// `next build` page-data collection even when DATABASE_URL is not set.
// Any code path that actually needs the DB must be invoked at request time
// (or guarded by env check) — build-time callers should handle the thrown
// error gracefully.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new PrismaClientNotConfiguredError();
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

export class PrismaClientNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL ไม่ได้ตั้งค่า — ตรวจสอบไฟล์ .env.local");
    this.name = "PrismaClientNotConfiguredError";
  }
}

export function isPrismaNotConfigured(error: unknown): boolean {
  return error instanceof PrismaClientNotConfiguredError;
}

// Lazy Proxy: instantiating the real client is deferred until a method is
// actually invoked, keeping `next build` from crashing on module load.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    // Handle root-level methods (e.g. prisma.$connect, prisma.$transaction).
    // Return a function that lazily instantiates when called.
    if (typeof prop === "string" && prop.startsWith("$")) {
      return (...args: unknown[]) => {
        const client = getClient();
        const method = Reflect.get(client, prop) as (
          ...a: unknown[]
        ) => unknown;
        return method.apply(client, args);
      };
    }
    // Handle delegates (prisma.tutor, prisma.article, ...).
    // Return a proxy whose methods (.findMany, .create, ...) only instantiate
    // the real client when invoked.
    return new Proxy(
      {},
      {
        get(_inner, methodProp) {
          return (...args: unknown[]) => {
            const client = getClient();
            const delegate = Reflect.get(client, prop) as Record<
              string,
              unknown
            >;
            const method = delegate?.[methodProp as string];
            if (typeof method !== "function") {
              throw new TypeError(
                `prisma.${String(prop)}.${String(methodProp)} is not a function`,
              );
            }
            return (method as (...a: unknown[]) => unknown).apply(
              delegate,
              args,
            );
          };
        },
      },
    );
  },
});
