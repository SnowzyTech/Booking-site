"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { Plus, X } from "lucide-react";

import { TimeSlots } from "@/components/booking/time-slots";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input, Label } from "@/components/ui/field";
import { Media } from "@/components/ui/media";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isDayAvailable } from "@/lib/availability";
import { services } from "@/lib/services";

const FIELDS = [
  ["name", "Name"],
  ["phone", "Phone Number"],
  ["whatsapp", "Whatsapp Number"],
  ["email", "E-mail"],
  ["address", "Address"],
  ["address2", "Address"],
] as const;

/*
 * Manual booking dialog behind the "+" FAB (Frame 199 / Frame 201).
 *
 * Frame 201 is the same dialog with a date-chip row: multi-day packages collect
 * several dates before confirming. The chip row appears automatically once the
 * chosen service has a multi-session template.
 */
export function NewBookingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [month, setMonth] = React.useState(() => new Date(2026, 8, 1));
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>();
  const [slug, setSlug] = React.useState(services[1].slug);
  const [dates, setDates] = React.useState<{ date: Date; time?: string }[]>([]);

  const service = services.find((s) => s.slug === slug);
  const multiDay = (service?.sessions?.length ?? 0) > 1;

  function addDate() {
    if (date) setDates((d) => [...d, { date, time }]);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-10 shadow-xl">
          <DialogPrimitive.Title className="sr-only">
            New booking
          </DialogPrimitive.Title>

          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-6 top-6 grid size-8 place-items-center rounded-md text-[#8a8a8a] hover:bg-surface-muted"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>

          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {FIELDS.map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={`nb-${key}`}>{label}</Label>
                <Input id={`nb-${key}`} className="mt-1.5" />
              </div>
            ))}
          </div>

          <hr className="my-8 border-[#d9d9d9]" />

          {multiDay && (
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {dates.map((d, i) => (
                <span
                  key={i}
                  className="flex flex-col rounded-lg border border-brand/40 px-3 py-2 text-center"
                >
                  <span className="text-[11px] font-medium text-[#111]">
                    {format(d.date, "EEE do MMM")}
                  </span>
                  <span className="text-[9px] text-brand">{d.time}</span>
                </span>
              ))}
              <button
                type="button"
                aria-label="Add another date"
                onClick={addDate}
                disabled={!date}
                className="grid size-[46px] place-items-center rounded-lg border border-[#d9d9d9] text-[#6f6f6f] disabled:opacity-40"
              >
                <Plus className="size-5" />
              </button>
            </div>
          )}

          <div className="flex gap-8">
            <div className="flex-1">
              <Select value={slug} onValueChange={setSlug}>
                <SelectTrigger className="h-14 w-full rounded-xl text-[17px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-4 flex gap-4">
                <Calendar
                  month={month}
                  onMonthChange={setMonth}
                  selected={date}
                  onSelect={setDate}
                  isDayAvailable={isDayAvailable}
                  className="w-[330px] shrink-0 p-4"
                />
                <div className="scale-[0.86] origin-top">
                  <TimeSlots value={time} onChange={setTime} />
                </div>
              </div>
            </div>

            <div className="flex w-[300px] shrink-0 flex-col">
              <Media
                src={service?.image}
                alt={service?.name ?? ""}
                className="aspect-[340/280] w-full rounded-lg"
              />
              <Button variant="solid" size="lg" className="mt-auto px-12">
                Confirm
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
