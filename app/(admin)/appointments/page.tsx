"use client";

import * as React from "react";
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
import { PENDING_SUMMARY, groupedByDay, serviceFilters } from "@/lib/bookings";
import { cn } from "@/lib/utils";

/* Admin appointments dashboard (admin-list.png / MacBook Pro 14_ - 6 & 7). */
export default function AppointmentsPage() {
  const [month, setMonth] = React.useState(() => new Date(2026, 8, 1));
  const [selected, setSelected] = React.useState(() => new Date(2026, 8, 1));
  const [filter, setFilter] = React.useState(serviceFilters[0]);
  const [tab, setTab] = React.useState<"new" | "all">("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const groups = groupedByDay();

  return (
    <div className="px-[68px] pb-24 pt-[60px]">
      <div className="flex items-start justify-between gap-8">
        <p className="text-[17px] text-[#111]">
          You have{" "}
          <strong className="font-bold">
            {PENDING_SUMMARY.count} pending appointments
          </strong>{" "}
          scheduled through {PENDING_SUMMARY.through}.
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
            onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            className="grid h-9 w-9 place-items-center rounded-l-md border border-[#e6e6e6] bg-white text-[#b0b0b0]"
          >
            &lsaquo;
          </button>
          <span className="grid h-9 min-w-[130px] place-items-center border-y border-[#e6e6e6] bg-white text-[15px] font-medium">
            {month.toLocaleString("en-US", { month: "long" })}
          </span>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            className="grid h-9 w-9 place-items-center rounded-r-md border border-[#e6e6e6] bg-white text-[#b0b0b0]"
          >
            &rsaquo;
          </button>
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-9 w-[190px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {serviceFilters.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
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
        <DayStrip month={month} selected={selected} onSelect={setSelected} />
      </div>

      <div className="mt-12 space-y-12">
        {groups.map((g) => (
          <section key={g.day}>
            <h2 className="mb-4 flex items-baseline gap-2">
              <span className="text-[15px] font-medium text-[#111]">
                {g.day}
              </span>
              <span className="text-[13px] text-[#9a9a9a]">
                {month.toLocaleString("en-US", { month: "long" })}
              </span>
            </h2>
            <div className="space-y-4">
              {g.items
                .filter((b) => (tab === "new" ? b.isNew : true))
                .map((b) => (
                  <BookingRow key={b.id} booking={b} />
                ))}
            </div>
          </section>
        ))}
      </div>

      <NewBookingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
