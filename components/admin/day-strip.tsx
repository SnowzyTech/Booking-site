"use client";

import * as React from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  subDays,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/*
 * Horizontal day strip. Days that have bookings are highlighted (brand-tinted
 * cell + brand number + count badge) so the admin can see at a glance where the
 * appointments are. Clicking a day filters the list to it; clicking the
 * selected day again clears the filter. Counts are keyed by yyyy-MM-dd.
 */
export function DayStrip({
  month,
  selected,
  onSelect,
  counts,
}: {
  month: Date;
  selected: Date | null;
  onSelect: (d: Date | null) => void;
  counts: Record<string, number>;
}) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const start = startOfMonth(month);
  const days = [
    subDays(start, 1),
    ...eachDayOfInterval({ start, end: addDays(endOfMonth(month), 2) }),
  ];

  const nudge = (dir: -1 | 1) =>
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <div className="flex items-stretch gap-2">
      <button
        type="button"
        aria-label="Earlier days"
        onClick={() => nudge(-1)}
        className="grid w-6 shrink-0 place-items-center text-[#4a4a4a]"
      >
        <ChevronLeft className="size-5" />
      </button>

      <div
        ref={scroller}
        className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto"
      >
        {days.map((d) => {
          const count = counts[format(d, "yyyy-MM-dd")];
          const booked = (count ?? 0) > 0;
          const active = selected ? isSameDay(d, selected) : false;
          const outside = !isSameMonthDay(d, month);

          return (
            <button
              key={d.toISOString()}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(active ? null : d)}
              className={cn(
                "flex w-[36px] shrink-0 flex-col items-center",
                d.getDay() === 1 && "ml-3"
              )}
            >
              <span
                className={cn(
                  "flex h-[52px] w-full flex-col items-center justify-center rounded-md leading-tight",
                  active
                    ? "bg-white ring-2 ring-brand"
                    : booked && "bg-brand/10"
                )}
              >
                <span
                  className={cn(
                    "text-[14px] font-medium",
                    outside
                      ? "text-[#b6b6b6]"
                      : booked
                        ? "font-semibold text-brand"
                        : "text-[#111]"
                  )}
                >
                  {d.getDate()}
                </span>
                <span
                  className={cn(
                    "text-[11px]",
                    outside ? "text-[#c4c4c4]" : "text-[#6f6f6f]"
                  )}
                >
                  {format(d, "EEE")}
                </span>
              </span>
              <span className="mt-1 h-[18px]">
                {booked ? (
                  <span className="grid h-[18px] w-[26px] place-items-center rounded bg-brand text-[10px] font-medium text-white">
                    {count}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Later days"
        onClick={() => nudge(1)}
        className="grid w-6 shrink-0 place-items-center text-[#4a4a4a]"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

function isSameMonthDay(d: Date, month: Date) {
  return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
}
