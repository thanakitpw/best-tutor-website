"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Users, LogOut } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "ติวเตอร์",
    href: "/admin/tutors",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-full w-60 flex-col border-r border-[#D1D5DB] bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[#D1D5DB] px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#046bd2]">
          <BookOpen className="size-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-[#1e293b]">
            Best Tutor
          </span>
          <span className="text-xs text-[#334155]">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-[#334155]/50">
          จัดการข้อมูล
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#046bd2]/10 text-[#046bd2]"
                      : "text-[#334155] hover:bg-[#F0F5FA] hover:text-[#1e293b]"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-[#D1D5DB] px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-[#334155] transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="size-4 shrink-0" />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}
