"use client";

import { Suspense } from "react";

import { useBooking } from "@/components/booking/booking-context";
import { EnquiryActions } from "@/components/booking/enquiry-actions";
import { ServiceFromQuery } from "@/components/booking/service-from-query";
import { WhatsAppChip } from "@/components/booking/whatsapp-block";
import { needsEnquiry } from "@/lib/services";

/*
 * The end of both assisted journeys (MacBook Pro 14_ - 8.png).
 *
 * Premium arrives here straight from the picker at step 2 and is still a pure
 * hand-off: nothing is collected and nothing is written.
 *
 * Corporate Wellness and Events Training arrive at step 5, having picked a slot
 * and filled in the event brief and their contact details, so here they get a
 * Send button that writes the enquiry before revealing the WhatsApp chip.
 *
 * Client-side because that branch depends on the service in the booking context.
 * Also reachable straight from the landing page via ?service=<slug> for Premium
 * — see <ServiceFromQuery>.
 */
export default function AssistedPage() {
  const { service } = useBooking();
  const enquiry = Boolean(service && needsEnquiry(service));

  return (
    <div className="px-6 pb-32 pt-20 md:px-12 lg:pt-[155px] xl:px-[220px]">
      <Suspense fallback={null}>
        <ServiceFromQuery />
      </Suspense>

      {enquiry ? (
        <>
          <h1 className="text-[26px] font-bold leading-[1.05] tracking-[-0.01em] text-brand sm:text-[30px] lg:text-[36px]">
            Send Your
            <br />
            Training Enquiry
          </h1>

          <div className="mt-8">
            <EnquiryActions />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-[26px] font-bold leading-[1.05] tracking-[-0.01em] text-brand sm:text-[30px] lg:text-[36px]">
            Payment &amp;
            <br />
            Appointment Confirmation
          </h1>

          <p className="mt-6 max-w-[480px] text-[14px] leading-[1.5] text-[#111]">
            Contact the Team via the WhatsApp number below to arrange your
            appointment date and other necessary details.
          </p>

          <div className="mt-8">
            <WhatsAppChip className="px-6 py-3.5 text-[19px]" />
          </div>
        </>
      )}
    </div>
  );
}
