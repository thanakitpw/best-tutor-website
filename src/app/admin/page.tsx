import { redirect } from "next/navigation";

/**
 * /admin has no dashboard yet — send users straight to the tutor list.
 * Unauthenticated users hit middleware first and bounce to /admin/login
 * before this redirect runs.
 */
export default function AdminIndexPage() {
  redirect("/admin/tutors");
}
