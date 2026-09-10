import { ClientsClient } from "@/components/admin/clients-client";
import { getPremiumClients } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/dal";

// Always render fresh from the database (no static caching of the roster).
export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  await requireAdmin();
  const data = await getPremiumClients();
  return <ClientsClient {...data} />;
}
