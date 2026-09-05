import { AppointmentsClient } from "@/components/admin/appointments-client";
import { getAdminBookings } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/dal";

// Always render fresh from the database (no static caching of the board).
export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  await requireAdmin();
  const data = await getAdminBookings();
  return <AppointmentsClient {...data} />;
}
