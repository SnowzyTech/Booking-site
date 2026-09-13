"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { useBooking } from "@/components/booking/booking-context";
import { getService } from "@/lib/services";

/*
 * Populates the booking context's `service` from a `?service=<slug>` query
 * param. The landing page's Services section CTAs deep-link straight into
 * /book/schedule or /book/assisted with this param, skipping the /book
 * picker entirely — but <BookingProvider> only mounts under /book/*, so a
 * fresh page load arriving that way has no other way to know which service
 * was chosen. The /book picker itself doesn't need this: its own cards call
 * setService directly on click (see service-card.tsx), already inside the
 * provider.
 *
 * Mount wherever a step can be a direct entry point, wrapped in <Suspense> —
 * useSearchParams() opts this component out of static prerendering, and
 * Next.js requires the boundary around that, not the whole page.
 */
export function ServiceFromQuery() {
  const params = useSearchParams();
  const { service, setService } = useBooking();
  const slug = params.get("service");

  React.useEffect(() => {
    if (!slug || service?.slug === slug) return;
    const found = getService(slug);
    if (found) setService(found);
  }, [slug, service, setService]);

  return null;
}
