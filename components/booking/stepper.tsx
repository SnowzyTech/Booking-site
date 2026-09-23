"use client";

import { usePathname } from "next/navigation";

import { useBooking } from "@/components/booking/booking-context";
import { needsEnquiry, needsSchedule } from "@/lib/services";
import { cn } from "@/lib/utils";

/*
 * Progress stepper. Dot states are taken from the mockups:
 *   complete -> #6BDD00 green      (MacBook Pro 14_ - 3/5)
 *   current  -> #6F7F60 olive      (MacBook Pro 14_ - 2/3/4/5/8)
 *   upcoming -> #DFDFDF grey
 *
 * Three shapes, which is why this reads the service rather than the path alone:
 *   4 dots — the scheduled flow (calendar, contact, payment).
 *   5 dots — the enquiry flow (Corporate / Events): the scheduled flow with the
 *            event brief inserted after the calendar, so every later step
 *            shifts up one.
 *   3 dots — Premium, which has no calendar (see needsSchedule) and so goes
 *            straight from the picker to the contact form and on to payment.
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
};

/* Premium: no calendar step, so the contact form is step 2 and payment step 3. */
const UNSCHEDULED_STEP_BY_PATH: Record<string, number> = {
  "/book": 1,
  "/book/details": 2,
  "/book/payment": 3,
  "/book/payment/callback": 3,
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
  /* No service chosen yet means we are on the picker, which is step 1 of every
     shape — fall back to the four-dot scheduled flow, the common case. */
  const unscheduled = Boolean(service && !needsSchedule(service));

  const steps = enquiry ? [1, 2, 3, 4, 5] : unscheduled ? [1, 2, 3] : [1, 2, 3, 4];
  const byPath = enquiry
    ? ENQUIRY_STEP_BY_PATH
    : unscheduled
      ? UNSCHEDULED_STEP_BY_PATH
      : STEP_BY_PATH;
  const current = byPath[pathname] ?? 1;

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
