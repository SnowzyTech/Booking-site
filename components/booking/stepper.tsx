"use client";

import { usePathname } from "next/navigation";

import { useBooking } from "@/components/booking/booking-context";
import { needsEnquiry } from "@/lib/services";
import { cn } from "@/lib/utils";

/*
 * Progress stepper. Dot states are taken from the mockups:
 *   complete -> #6BDD00 green      (MacBook Pro 14_ - 3/5)
 *   current  -> #6F7F60 olive      (MacBook Pro 14_ - 2/3/4/5/8)
 *   upcoming -> #DFDFDF grey
 *
 * Four dots for the scheduled flow and for Premium, which still only ever
 * reaches step 2 (MacBook Pro 14_ - 8.png). The enquiry flow (Corporate /
 * Events) is the scheduled flow with the event brief inserted between the
 * calendar and the contact step, so it runs to five and every later step shifts
 * up one — which is why this reads the service rather than the path alone.
 *
 * The 46px dots are the measured desktop size; below sm they drop to 36px with
 * shorter connectors so the row never sets a floor wider than the viewport.
 */
const STEP_BY_PATH: Record<string, number> = {
  "/book": 1,
  "/book/schedule": 2,
  "/book/details": 3,
  "/book/payment": 4,
  "/book/payment/callback": 4,
  "/book/assisted": 2,
};

const ENQUIRY_STEP_BY_PATH: Record<string, number> = {
  "/book": 1,
  "/book/schedule": 2,
  "/book/enquiry": 3,
  "/book/details": 4,
  "/book/payment": 5,
  "/book/payment/callback": 5,
};

export function Stepper() {
  const pathname = usePathname();
  const { service } = useBooking();

  const enquiry = Boolean(service && needsEnquiry(service));
  const steps = enquiry ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];
  const current =
    (enquiry ? ENQUIRY_STEP_BY_PATH[pathname] : STEP_BY_PATH[pathname]) ?? 1;

  return (
    <div className="mx-auto flex w-full max-w-[1058px] items-center px-4 pt-7 sm:px-6 sm:pt-9">
      {steps.map((n, i) => (
        <div
          key={n}
          className={cn("flex items-center", i > 0 && "min-w-0 flex-1")}
        >
          {i > 0 && (
            <div className="mx-2 h-px flex-1 border-t border-dashed border-[#c9b7cf] sm:mx-4" />
          )}
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full text-[13px] transition-[background-color,color,scale] duration-[var(--dur-base)] ease-quart sm:size-[46px] sm:text-[15px]",
              n < current && "bg-step-done text-white",
              n === current && "scale-105 bg-step-current text-white",
              n > current && "bg-step-idle text-[#a5a5a5]"
            )}
          >
            {n}
          </span>
        </div>
      ))}
    </div>
  );
}
