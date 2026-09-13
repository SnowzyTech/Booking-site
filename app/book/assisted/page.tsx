import { Suspense } from "react";

import { ServiceFromQuery } from "@/components/booking/service-from-query";
import { WhatsAppChip } from "@/components/booking/whatsapp-block";

/*
 * Assisted flow, step 2 (MacBook Pro 14_ - 8.png).
 *
 * Corporate Wellness and Events Training do not go through the calendar or the
 * bank-transfer step — they hand off to the Executive Assistant on WhatsApp.
 * The stepper still renders four dots; only 1 and 2 are ever reached.
 *
 * Also reachable straight from the landing page's Services section, via
 * ?service=<slug> — see <ServiceFromQuery>. This page doesn't read `service`
 * itself (the WhatsApp hand-off is generic), but populating it keeps the
 * booking context correct for whatever reads it next.
 */
export default function AssistedPage() {
  return (
    <div className="px-6 pb-32 pt-20 md:px-12 lg:pt-[155px] xl:px-[220px]">
      <Suspense fallback={null}>
        <ServiceFromQuery />
      </Suspense>

      <h1 className="text-[26px] font-bold leading-[1.05] tracking-[-0.01em] text-brand sm:text-[30px] lg:text-[36px]">
        Payment &amp;
        <br />
        Appointment Confirmation
      </h1>

      <p className="mt-6 max-w-[480px] text-[14px] leading-[1.5] text-[#111]">
        Contact the Executive Assistant via the WhatsApp number below to arrange
        your appointment date and other necessary details.
      </p>

      <div className="mt-8">
        <WhatsAppChip className="px-6 py-3.5 text-[19px]" />
      </div>
    </div>
  );
}
