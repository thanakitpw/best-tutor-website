import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Admin layout — server component that checks auth via Supabase session.
 * Unauthenticated visitors are redirected to /admin/login.
 * Sidebar and logout are rendered as client components.
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F0F5FA]">
      <AdminSidebar />

      {/* Main content — offset by sidebar width */}
      <div className="flex flex-1 flex-col pl-60">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
