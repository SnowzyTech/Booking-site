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

import { dayCounts } from "@/lib/bookings";
import { cn } from "@/lib/utils";

/* Horizontal day strip with per-day count badges (admin-daystrip.png). */
export function DayStrip({
  month,
  selected,
  onSelect,
}: {
  month: Date;
  selected: Date;
  onSelect: (d: Date) => void;
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
          const count = isSameMonthDay(d, month) ? dayCounts[d.getDate()] : undefined;
          const active = isSameDay(d, selected);
          const outside = !isSameMonthDay(d, month);

          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => onSelect(d)}
              className={cn(
                "flex w-[36px] shrink-0 flex-col items-center",
                d.getDay() === 1 && "ml-3"
              )}
            >
              <span
                className={cn(
                  "flex h-[52px] w-full flex-col items-center justify-center rounded-md leading-tight",
                  active && "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
                )}
              >
                <span
                  className={cn(
                    "text-[14px] font-medium",
                    outside ? "text-[#b6b6b6]" : "text-[#111]"
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
                {count ? (
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
