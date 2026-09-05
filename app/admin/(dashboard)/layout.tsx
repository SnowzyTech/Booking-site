import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/dal";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Secure gate for every admin route (redirects to /admin/login if not admin).
  const session = await requireAdmin();
  return <AdminShell adminEmail={session?.user?.email}>{children}</AdminShell>;
}
