/**
 * Create an admin user for the Best Tutor admin panel.
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts <email> <password> [name]
 *
 * Example:
 *   npx tsx scripts/create-admin.ts admin@besttutorthailand.com SuperSecure123 "Admin"
 *
 * What it does:
 *   1. Creates a Supabase Auth user (or fetches existing one by email).
 *   2. Inserts/updates a corresponding row in the `users` table with role
 *      SUPER_ADMIN so the user can access /admin/*.
 *
 * Reads from .env.local: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
import { config as loadDotenv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

loadDotenv({ path: ".env.local" });

async function main() {
  const [email, password, name = "Admin"] = process.argv.slice(2);

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Creating Supabase Auth user: ${email}`);

  let userId: string;

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (createError) {
    if (
      createError.message.toLowerCase().includes("already") ||
      createError.message.toLowerCase().includes("exists") ||
      createError.message.toLowerCase().includes("registered")
    ) {
      console.log(`  ↪ user already exists, looking up...`);
      const { data: list, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error("Failed to list users:", listError.message);
        process.exit(1);
      }
      const existing = list.users.find((u) => u.email === email);
      if (!existing) {
        console.error("User exists but couldn't be found in listUsers");
        process.exit(1);
      }
      userId = existing.id;
      console.log(`  ↪ found existing user: ${userId}`);
    } else {
      console.error("Failed to create user:", createError.message);
      process.exit(1);
    }
  } else if (created?.user) {
    userId = created.user.id;
    console.log(`  ↪ created: ${userId}`);
  } else {
    console.error("createUser returned no data");
    process.exit(1);
  }

  console.log(`Upserting users table row with role SUPER_ADMIN...`);
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("Missing DATABASE_URL in .env.local");
    process.exit(1);
  }
  const adapter = new PrismaPg({ connectionString: dbUrl });
  const prisma = new PrismaClient({ adapter });
  try {
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email, name, role: UserRole.SUPER_ADMIN },
      update: { email, name, role: UserRole.SUPER_ADMIN },
    });
    console.log(`  ↪ done`);
  } finally {
    await prisma.$disconnect();
  }

  console.log("");
  console.log(`✓ Admin ready. Login at http://localhost:3000/admin/login`);
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
