"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { BOOKED_SLOTS, timeSlots } from "@/lib/availability";
import { cn } from "@/lib/utils";

/* Scrollable slot column with up/down affordances, per MacBook Pro 14_ - 4.png.
   Booked slots render dimmed and are not selectable. */
export function TimeSlots({
  value,
  onChange,
}: {
  value?: string;
  onChange: (t: string) => void;
}) {
  const slots = timeSlots();

  return (
    <div className="flex h-[570px] w-[176px] shrink-0 flex-col rounded-2xl border border-border bg-white/70 px-6 py-3">
      <ChevronUp className="mx-auto size-5 shrink-0 text-[#111]" />
      <div className="no-scrollbar my-2 flex-1 space-y-2 overflow-y-auto">
        {slots.map((s) => {
          const booked = BOOKED_SLOTS.includes(s.value);
          const active = value === s.value;
          return (
            <button
              key={s.value}
              type="button"
              disabled={booked}
              onClick={() => onChange(s.value)}
              className={cn(
                "h-[38px] w-full rounded-md text-[13px] transition-colors",
                active
                  ? "bg-brand-deep font-medium text-white"
                  : booked
                    ? "cursor-default bg-slot-idle text-[#cfcfcf]"
                    : "bg-slot-idle text-[#111] hover:bg-[#efe6f5]"
              )}
            >
              {s.value}
            </button>
          );
        })}
      </div>
      <ChevronDown className="mx-auto size-5 shrink-0 text-[#111]" />
    </div>
  );
}
