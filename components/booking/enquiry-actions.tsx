"use client";

import * as React from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

import { useBooking } from "@/components/booking/booking-context";
import { WhatsAppChip } from "@/components/booking/whatsapp-block";
import { Button } from "@/components/ui/button";
import { toSlotInstant } from "@/lib/availability";
import { createEnquiryBooking } from "@/lib/booking-actions";

/*
 * Last step of the enquiry flow. The analogue of <PaymentActions>: everything
 * has been collected by now, so this reviews it, writes the booking, and only
 * then reveals the WhatsApp hand-off — pre-filled, so the Team opens a thread
 * that already has the brief in it rather than a cold "hi".
 *
 * Nothing is charged here, which is the whole difference from the scheduled
 * flow: the enquiry lands PENDING for the admin to price and confirm.
 */
export function EnquiryActions() {
  const { service, date, time, mode, details, enquiry } = useBooking();
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const ready = Boolean(
    service &&
      date &&
      time &&
      details.fullName &&
      details.email &&
      enquiry.organization &&
      enquiry.location &&
      enquiry.audienceSize &&
      enquiry.topic &&
      enquiry.duration
  );

  const message = [
    `New enquiry: ${service?.name ?? "Training"}`,
    `Organization: ${enquiry.organization}`,
    `Location: ${enquiry.location}`,
    date && time && `Date of event: ${format(date, "d MMMM yyyy")}, ${time}`,
    `Audience size: ${enquiry.audienceSize}`,
    `Topic: ${enquiry.topic}`,
    `Duration: ${enquiry.duration}`,
    `Format: ${mode === "physical" ? "In person" : "Virtual"}`,
    "",
    `Contact: ${details.fullName}`,
    details.phone && `Phone: ${details.phone}`,
    details.email && `Email: ${details.email}`,
  ]
    .filter(Boolean)
    .join("\n");

  async function submit() {
    if (!service || !date || !time) return;
    setPending(true);
    setError(null);
    const res = await createEnquiryBooking({
      serviceSlug: service.slug,
      startISO: toSlotInstant(date, time).toISOString(),
      mode,
      details,
      enquiry,
    });
    setPending(false);
    if (res.ok) setDone(true);
    else setError(res.error);
  }

  if (done) {
    return (
      <div className="max-w-[480px] animate-in rounded-lg bg-white/70 px-6 py-5 duration-500 ease-soft fade-in-0 fill-mode-both slide-in-from-bottom-2">
        <p className="text-[15px] font-bold text-[#111]">
          Thank you — we&rsquo;ve received your enquiry.
        </p>
        <p className="mt-1 text-[14px] leading-[1.5] text-[#111]">
          Your date is provisionally held and a confirmation is on its way to{" "}
          {details.email}. Message the Team on WhatsApp to go through the details
          and agree the fee.
        </p>
        <WhatsAppChip className="mt-5 px-6 py-3.5 text-[19px]" message={message} />
      </div>
    );
  }

  return (
    <div>
      <p className="max-w-[480px] text-[14px] leading-[1.5] text-[#111]">
        Send your enquiry and the Team will confirm the details and the fee with
        you over WhatsApp. Nothing is charged at this point.
      </p>

      <Button
        variant="solid"
        size="lg"
        disabled={!ready || pending}
        onClick={submit}
        className="mt-6 px-12"
      >
        {pending && <Loader2 className="mr-2.5 size-[18px] animate-spin" />}
        Send Enquiry
      </Button>

      {!ready && (
        <p className="mt-3 max-w-[420px] text-[12.5px] leading-[1.6] text-[#a33]">
          Please complete the earlier booking steps first.
        </p>
      )}

      {error && (
        <p className="mt-3 max-w-[420px] animate-in text-[12.5px] leading-[1.6] text-[#a33] duration-[var(--dur-base)] ease-quart fade-in-0 fill-mode-both">
          {error}
        </p>
      )}
    </div>
  );
}
