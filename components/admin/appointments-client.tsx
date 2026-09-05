"use client";

import * as React from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";

import { BookingRow } from "@/components/admin/booking-row";
import { DayStrip } from "@/components/admin/day-strip";
import { NewBookingDialog } from "@/components/admin/new-booking-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminData } from "@/lib/bookings";
import { SERVICE_FILTERS, groupBookingsByDay } from "@/lib/bookings";
import { cn } from "@/lib/utils";

/* Admin appointments dashboard (admin-list.png / MacBook Pro 14_ - 6 & 7).
   The interactive shell; data is fetched by the server component and passed in.
   Filtering (month, day, service, new/all) happens here on the flat list. */
export function AppointmentsClient({ bookings, pendingSummary }: AdminData) {
  const [month, setMonth] = React.useState(() => new Date(2026, 8, 1));
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);
  const [service, setService] = React.useState("all");
  const [tab, setTab] = React.useState<"new" | "all">("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Booked-day counts across all bookings (any month), for the day strip.
  const counts = React.useMemo(() => {
    const c: Record<string, number> = {};
    for (const b of bookings) c[b.dateKey] = (c[b.dateKey] ?? 0) + 1;
    return c;
  }, [bookings]);

  const monthKey = format(month, "yyyy-MM");
  const selectedKey = selectedDay ? format(selectedDay, "yyyy-MM-dd") : null;

  const filtered = bookings.filter((b) => {
    // A selected day pins to that exact date; otherwise scope to the month.
    if (selectedKey) {
      if (b.dateKey !== selectedKey) return false;
    } else if (!b.dateKey.startsWith(monthKey)) {
      return false;
    }
    if (service !== "all" && b.serviceSlug !== service) return false;
    if (tab === "new" && b.badge === "none") return false;
    return true;
  });

  const groups = groupBookingsByDay(filtered);

  const changeMonth = (delta: number) => {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
    setSelectedDay(null);
  };

  return (
    <div className="px-[68px] pb-24 pt-8">
      <div className="flex items-start justify-between gap-8">
        <p className="text-[17px] text-[#111]">
          You have{" "}
          <strong className="font-bold">
            {pendingSummary.count} pending appointments
          </strong>
          {pendingSummary.through
            ? ` scheduled through ${pendingSummary.through}.`
            : "."}
        </p>

        <Button
          variant="fab"
          size="icon"
          aria-label="New booking"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="size-5" strokeWidth={2.5} />
        </Button>
      </div>

      <div className="mt-9 flex items-center justify-between gap-6">
        <div className="flex items-center rounded-md">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
            className="grid h-9 w-9 place-items-center rounded-l-md border border-[#e6e6e6] bg-white text-[#b0b0b0]"
          >
            &lsaquo;
          </button>
          <span className="grid h-9 min-w-[130px] place-items-center border-y border-[#e6e6e6] bg-white text-[15px] font-medium">
            {month.toLocaleString("en-US", { month: "long", year: "numeric" })}
          </span>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
            className="grid h-9 w-9 place-items-center rounded-r-md border border-[#e6e6e6] bg-white text-[#b0b0b0]"
          >
            &rsaquo;
          </button>
        </div>

        <Select value={service} onValueChange={setService}>
          <SelectTrigger className="h-9 w-[210px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex overflow-hidden rounded-md">
          {(
            [
              ["new", "New Bookings"],
              ["all", "All Appointments"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "h-9 px-5 text-[13px] transition-colors",
                tab === key
                  ? "bg-[#020202] font-medium text-white"
                  : "bg-white text-[#b0b0b0]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <DayStrip
          month={month}
          selected={selectedDay}
          onSelect={setSelectedDay}
          counts={counts}
        />
      </div>

      {selectedDay && (
        <div className="mt-4 flex items-center gap-3 text-[13px] text-[#6f6f6f]">
          <span>
            Showing{" "}
            <strong className="font-semibold text-[#111]">
              {format(selectedDay, "EEEE d MMMM yyyy")}
            </strong>
          </span>
          <button
            type="button"
            onClick={() => setSelectedDay(null)}
            className="text-brand underline"
          >
            Show all days
          </button>
        </div>
      )}

      {groups.length === 0 ? (
        <p className="mt-16 text-center text-[15px] text-[#9a9a9a]">
          No appointments match these filters.
        </p>
      ) : (
        <div className="mt-12 space-y-12">
          {groups.map((g) => (
            <section key={g.day}>
              <h2 className="mb-4 flex items-baseline gap-2">
                <span className="text-[15px] font-medium text-[#111]">
                  {g.day}
                </span>
                <span className="text-[13px] text-[#9a9a9a]">
                  {g.monthLabel}
                </span>
              </h2>
              <div className="space-y-4">
                {g.items.map((b) => (
                  <BookingRow key={b.id} booking={b} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <NewBookingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
