"use client";

import * as React from "react";

import { useBooking } from "@/components/booking/booking-context";
import { Button } from "@/components/ui/button";
import { createScheduledBooking } from "@/lib/booking-actions";
import { toSlotInstant } from "@/lib/availability";

/*
 * The "Sent Notification of Payment" button. Reads the in-memory booking from
 * context and persists it, at which point the order appears in the admin list.
 */
export function PaymentActions() {
  const { service, date, time, details } = useBooking();
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const ready = Boolean(
    service && date && time && details.fullName && details.email
  );

  async function submit() {
    if (!service || !date || !time) return;
    setPending(true);
    setError(null);
    const res = await createScheduledBooking({
      serviceSlug: service.slug,
      startISO: toSlotInstant(date, time).toISOString(),
      details,
    });
    setPending(false);
    if (res.ok) setDone(true);
    else setError(res.error);
  }

  if (done) {
    return (
      <div className="max-w-[420px] rounded-lg bg-white/70 px-6 py-5">
        <p className="text-[15px] font-bold text-[#111]">
          Thank you — we&rsquo;ve received your notification.
        </p>
        <p className="mt-1 text-[14px] leading-[1.5] text-[#111]">
          Linda&rsquo;s team will verify your payment and confirm your
          appointment and will reach out to you immediately.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="solid"
        size="lg"
        className="px-9"
        disabled={!ready || pending}
        onClick={submit}
      >
        {pending ? "Sending…" : "Sent Notification of Payment"}
      </Button>
      {!ready && (
        <p className="mt-2 text-[12px] text-[#a33]">
          Please complete the earlier booking steps first.
        </p>
      )}
      {error && <p className="mt-2 text-[12px] text-[#a33]">{error}</p>}
    </div>
  );
}
