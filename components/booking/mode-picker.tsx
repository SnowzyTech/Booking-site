"use client";

import { MapPin, Video } from "lucide-react";

import {
  useBooking,
  type BookingMode,
} from "@/components/booking/booking-context";
import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * Virtual / in-person choice, sat with the date and time on step 2 — it is part
 * of the same decision, and it changes what the client has to do on the day.
 *
 * No frame for this in the mockups (the design only ever assumed a call), so it
 * borrows the time-slot column's selected treatment: brand fill for the chosen
 * option, #F7F7F7 for the other.
 *
 * It does not gate Confirm. The context defaults to virtual, and picking that
 * by inaction costs nothing — a client can be sent a link late. Defaulting the
 * other way would send someone to Egbeda for a meeting nobody prepared for.
 */
const OPTIONS: {
  value: BookingMode;
  label: string;
  caption: string;
  Icon: typeof Video;
}[] = [
  {
    value: "virtual",
    label: "Virtual",
    caption: "Meet over a video call",
    Icon: Video,
  },
  {
    value: "physical",
    label: "In person",
    caption: "Visit the office",
    Icon: MapPin,
  },
];

export function ModePicker({ className }: { className?: string }) {
  const { mode, setMode } = useBooking();

  return (
    <div className={className}>
      <h2 className="text-[15px] font-semibold text-[#111]">
        How would you like to meet?
      </h2>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {OPTIONS.map(({ value, label, caption, Icon }) => {
          const active = mode === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setMode(value)}
              className={cn(
                "rounded-lg px-4 py-3 text-left transition-[background-color,color,scale] duration-[var(--dur-fast)] ease-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.99]",
                active
                  ? "bg-brand-deep text-white"
                  : "bg-slot-idle text-[#111] hover:bg-[#efe6f5]"
              )}
            >
              <Icon
                className={cn("size-[18px]", active ? "text-white" : "text-brand")}
                strokeWidth={1.75}
              />
              <span className="mt-2 block text-[14px] font-semibold">
                {label}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-[11.5px] leading-[1.4]",
                  active ? "text-white/80" : "text-[#6b6b6b]"
                )}
              >
                {caption}
              </span>
            </button>
          );
        })}
      </div>

      {/* Only the in-person choice needs follow-up detail — where to go. */}
      <p className="mt-3 min-h-[32px] text-[12px] leading-[1.5] text-[#6b6b6b]">
        {mode === "physical" ? (
          <>
            <span className="font-semibold text-[#111]">Address:</span>{" "}
            {contact.address}
          </>
        ) : (
          "A meeting link will be sent to you once your payment is confirmed."
        )}
      </p>
    </div>
  );
}
