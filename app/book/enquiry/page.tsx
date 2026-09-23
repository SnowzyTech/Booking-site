"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useBooking } from "@/components/booking/booking-context";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { Media } from "@/components/ui/media";

/* Audience size and duration are free text on purpose: enquiries arrive as
   "about 200" and "2 days" far more often than as a clean number. */
const FIELDS = [
  {
    key: "organization",
    label: "Organization / Company",
    placeholder: "WHO IS THIS TRAINING FOR",
  },
  { key: "location", label: "Location", placeholder: "WHERE WILL IT HOLD" },
  { key: "audienceSize", label: "Audience Size", placeholder: "E.G. ABOUT 200" },
  { key: "topic", label: "Topic", placeholder: "WHAT SHOULD IT COVER" },
  {
    key: "duration",
    label: "Training Duration",
    placeholder: "E.G. 1HR 30MIN, 2 DAYS",
  },
] as const;

/* Step 3 of the enquiry branch — the event brief for Corporate Wellness and
   Events Training. The date of the event is not asked here: it is the slot
   already picked on the calendar step, so a training holds its place on the
   board like any other appointment. */
export default function EnquiryPage() {
  const router = useRouter();
  const { service, enquiry, setEnquiry } = useBooking();
  const [navigating, startNavigation] = React.useTransition();

  const allRequiredFilled = FIELDS.every((f) => Boolean(enquiry[f.key].trim()));

  return (
    <div className="px-6 pb-32 pt-[90px] lg:pt-[130px]">
      <div className="mx-auto flex max-w-[1000px] flex-col gap-y-12 lg:flex-row lg:items-start lg:justify-center lg:gap-x-[100px]">
        <form
          className="w-full max-w-[441px] shrink-0"
          onSubmit={(e) => {
            e.preventDefault();
            startNavigation(() => router.push("/book/details"));
          }}
        >
          <h1 className="mb-6 text-[22px] font-bold leading-[1.2] text-[#1d1620]">
            Tell us about the event
          </h1>

          {FIELDS.map((f) => (
            <div key={f.key} className="mb-[18px]">
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                required
                placeholder={f.placeholder}
                value={enquiry[f.key]}
                onChange={(e) =>
                  setEnquiry((v) => ({ ...v, [f.key]: e.target.value }))
                }
                className="mt-1.5"
              />
            </div>
          ))}

          <Button
            type="submit"
            variant="solid"
            size="lg"
            disabled={!allRequiredFilled || navigating}
            className="mt-7 px-14"
          >
            Continue
          </Button>
        </form>

        <div className="w-full max-w-[422px] shrink-0">
          <h2 className="text-[17px] font-bold text-[#111]">
            {service?.name ?? "Select a service"}
          </h2>
          {/* The photo's own frame, as on the landing page — not the mockup's
              423x152 letterbox, which cropped most of every photograph away.
              The Figma geometry stays as the fallback, which is what the
              #D9D9D9 placeholder shows before a service is chosen. */}
          <Media
            src={service?.image}
            alt={service?.name ?? ""}
            className="mt-4 w-full rounded-lg"
            style={{ aspectRatio: service?.imageAspect ?? "423 / 152" }}
          />
        </div>
      </div>
    </div>
  );
}
