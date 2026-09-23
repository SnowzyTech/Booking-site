import { redirect } from "next/navigation";

/*
 * Retired step.
 *
 * This used to be One-on-One Premium's step 2: a "Payment & Appointment
 * Confirmation" heading over a WhatsApp number, which collected nothing and
 * charged nothing. Premium now runs the same wizard as everything else —
 * contact form, then payment — it just skips the calendar (see needsSchedule in
 * lib/services.ts), so it enters at /book/details.
 *
 * The route is kept as a redirect rather than deleted because the old path was
 * linked from the landing page for months and may be bookmarked or in an
 * e-mail. The ?service=<slug> param rides along so a stale deep link still
 * lands on the right service's form.
 */
export default async function AssistedPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  redirect(service ? `/book/details?service=${encodeURIComponent(service)}` : "/book");
}
