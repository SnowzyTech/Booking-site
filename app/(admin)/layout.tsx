import { AdminRail } from "@/components/admin/admin-rail";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-wash-admin">
      <AdminRail />
      <div className="min-w-0 flex-1 pl-[93px]">{children}</div>
    </div>
  );
}
