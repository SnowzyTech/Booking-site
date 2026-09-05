import { redirect } from "next/navigation";

import { auth } from "@/auth";

/*
 * Secure gate for admin routes/data. Call this in admin pages, the admin
 * layout, and (as a throwing variant) inside server actions. Redirects to the
 * login page when the caller isn't the admin.
 */
export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin/login");
  }
  return session;
}
