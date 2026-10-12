import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/dal";

// Private dashboard — never index.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Secure gate for every admin route (redirects to /admin/login if not admin).
  const session = await requireAdmin();
  return <AdminShell adminEmail={session?.user?.email}>{children}</AdminShell>;
}
