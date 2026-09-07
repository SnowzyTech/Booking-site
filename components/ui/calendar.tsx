"use client";

import * as React from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2000, i, 1), "MMM")
);

/*
 * Hand-rolled rather than react-day-picker: the design pairs month/year Select
 * dropdowns with chevrons in a single header row, dims out-of-month and
 * unavailable days rather than hiding them, and uses a squared selected state.
 * Driving react-day-picker to that shape costs more than owning the grid.
 */
export function Calendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  isDayAvailable,
  yearRange = 3,
  className,
}: {
  month: Date;
  onMonthChange: (d: Date) => void;
  selected?: Date;
  onSelect?: (d: Date) => void;
  isDayAvailable?: (d: Date) => boolean;
  yearRange?: number;
  className?: string;
}) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  const years = React.useMemo(() => {
    const base = month.getFullYear();
    return Array.from({ length: yearRange * 2 + 1 }, (_, i) => base - yearRange + i);
  }, [month, yearRange]);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white/70 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-6",
        className
      )}
    >
      <div className="mb-5 flex items-center justify-between gap-1 sm:gap-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(subMonths(month, 1))}
          className="grid size-8 shrink-0 place-items-center rounded-md hover:bg-surface-muted"
        >
          <ChevronLeft className="size-5" strokeWidth={2.5} />
        </button>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Select
            value={String(month.getMonth())}
            onValueChange={(v) => onMonthChange(setMonth(month, Number(v)))}
          >
            <SelectTrigger className="h-10 w-[92px] rounded-xl text-base font-medium sm:h-11 sm:w-[120px] sm:text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={m} value={String(i)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(month.getFullYear())}
            onValueChange={(v) => onMonthChange(setYear(month, Number(v)))}
          >
            <SelectTrigger className="h-10 w-[92px] rounded-xl text-base font-medium sm:h-11 sm:w-[120px] sm:text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="grid size-8 shrink-0 place-items-center rounded-md hover:bg-surface-muted"
        >
          <ChevronRight className="size-5" strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="grid h-9 place-items-center text-xs text-muted-foreground sm:h-10 sm:text-sm"
          >
            {d}
          </div>
        ))}

        {days.map((day) => {
          const outside = !isSameMonth(day, month);
          const available = isDayAvailable ? isDayAvailable(day) : true;
          const isSelected = selected ? isSameDay(day, selected) : false;
          const enabled = available && !outside;

          return (
            <div key={day.toISOString()} className="grid place-items-center">
              <button
                type="button"
                disabled={!enabled}
                onClick={() => enabled && onSelect?.(day)}
                className={cn(
                  "grid aspect-square w-full max-w-11 place-items-center rounded-lg text-base transition-colors sm:text-lg",
                  isSelected
                    ? "bg-day-selected font-medium text-white"
                    : enabled
                      ? "font-medium text-foreground hover:bg-surface-muted"
                      : "cursor-default text-[#d4d4d4]"
                )}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
