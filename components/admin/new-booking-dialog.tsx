"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { getTakenDays, getTakenSlots } from "@/lib/booking-actions";
import { createAdminBooking } from "@/lib/admin-actions";
import { isDayAvailable, timeSlots, toSlotInstant } from "@/lib/availability";
import { services } from "@/lib/services";

const FIELDS = [
  ["name", "Name"],
  ["phone", "Phone Number"],
  ["whatsapp", "Whatsapp Number"],
  ["email", "E-mail"],
  ["address", "Address"],
] as const;

type FieldKey = (typeof FIELDS)[number][0];

// Premium 1:1 belongs on the Clients page, not the appointments board.
const BOOKABLE = services.filter((s) => s.slug !== "one-on-one-premium");
const emptyForm: Record<FieldKey, string> = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
};

/*
 * Manual booking dialog behind the "+" FAB (Frame 199 / Frame 201).
 *
 * Admin-added orders are already paid, so they are created CONFIRMED. Multi-day
 * packages (programme / corporate) collect several dates via the chip row before
 * confirming; a one-off collects a single date + time.
 */
export function NewBookingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [month, setMonth] = React.useState(() => new Date(2026, 8, 1));
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>();
  const [slug, setSlug] = React.useState("personalized-meal-plans");
  const [dates, setDates] = React.useState<{ date: Date; time: string }[]>([]);
  const [form, setForm] = React.useState<Record<FieldKey, string>>(emptyForm);
  const [taken, setTaken] = React.useState<string[]>([]);
  const [bookedDays, setBookedDays] = React.useState<string[]>([]);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const service = BOOKABLE.find((s) => s.slug === slug);
  // Only the open-ended packages (Corporate Wellness, Events Training — both
  // kind "corporate") collect several dates via the "+" chip row. A programme
  // (Meal Plans) takes a single start date and auto-schedules its fixed weekly
  // sessions server-side; a one-off (Consultation) is a single date too.
  const multiDate = service?.kind === "corporate";
  const isProgramme = service?.kind === "programme";

  // Reset the multi-date list when switching service shape.
  React.useEffect(() => {
    setDates([]);
    setTime(undefined);
  }, [slug]);

  // Flag days in the visible month that already carry a booking.
  React.useEffect(() => {
    let active = true;
    getTakenDays(format(month, "yyyy-MM")).then((days) => {
      if (active) setBookedDays(days);
    });
    return () => {
      active = false;
    };
  }, [month]);

  // Grey out slots already taken on the selected day.
  React.useEffect(() => {
    if (!date) {
      setTaken([]);
      return;
    }
    let active = true;
    getTakenSlots(format(date, "yyyy-MM-dd")).then((iso) => {
      if (!active) return;
      const set = new Set(iso);
      setTaken(
        timeSlots(date)
          .filter((s) => set.has(toSlotInstant(date, s.value).toISOString()))
          .map((s) => s.value)
      );
    });
    return () => {
      active = false;
    };
  }, [date]);

  function addDate() {
    if (date && time) {
      setDates((d) => [...d, { date, time }]);
      setTime(undefined);
    }
  }

  function reset() {
    setForm(emptyForm);
    setDates([]);
    setDate(undefined);
    setTime(undefined);
    setError(null);
  }

  // The in-progress calendar selection counts as a chosen date on its own — the
  // "+" chip row is only for piling on *extra* dates. Once "+" is tapped the time
  // clears, so the committed chip is never double-counted here.
  const current = date && time ? [{ date, time }] : [];
  const chosen = multiDate ? [...dates, ...current] : current;

  // Booked days = what the DB already holds this month, plus the dates the admin
  // has just added in this session, so both are flagged on the calendar.
  const bookedDaysSet = new Set([
    ...bookedDays,
    ...dates.map((d) => format(d.date, "yyyy-MM-dd")),
  ]);
  // Times to block on the selected day: DB-taken slots plus any this session has
  // already added on that same day, so the admin can't pick a slot twice.
  const dayKey = date ? format(date, "yyyy-MM-dd") : null;
  const takenForDay = Array.from(
    new Set([
      ...taken,
      ...dates
        .filter((d) => format(d.date, "yyyy-MM-dd") === dayKey)
        .map((d) => d.time),
    ])
  );

  async function submit() {
    setPending(true);
    setError(null);
    // Collapse any duplicate slots so the same date/time is never sent twice.
    const slots = Array.from(
      new Set(chosen.map((c) => toSlotInstant(c.date, c.time).toISOString()))
    );
    const res = await createAdminBooking({
      serviceSlug: slug,
      client: {
        fullName: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        address: form.address.trim(),
      },
      slots,
    });
    setPending(false);
    if (res.ok) {
      reset();
      onOpenChange(false);
      router.refresh();
    } else {
      setError(res.error);
    }
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const canSubmit =
    !pending && Boolean(form.name.trim()) && emailValid && chosen.length > 0;

  // Spell out what is still keeping Confirm disabled, so it never looks broken.
  const missing: string[] = [];
  if (!form.name.trim()) missing.push("the client's name");
  if (!emailValid) missing.push("a valid e-mail");
  if (chosen.length === 0) missing.push("a date and time");

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[95vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-10">
          <DialogPrimitive.Title className="sr-only">
            New booking
          </DialogPrimitive.Title>

          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-6 top-6 grid size-8 place-items-center rounded-md text-[#8a8a8a] hover:bg-surface-muted"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>

          <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {FIELDS.map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={`nb-${key}`}>{label}</Label>
                <Input
                  id={`nb-${key}`}
                  type={key === "email" ? "email" : "text"}
                  className="mt-1.5"
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>

          <hr className="my-8 border-[#d9d9d9]" />

          {multiDate && (
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {dates.map((d, i) => (
                <span
                  key={i}
                  className="relative flex flex-col rounded-lg border border-brand/40 px-3 py-2 text-center"
                >
                  <button
                    type="button"
                    aria-label="Remove date"
                    onClick={() =>
                      setDates((arr) => arr.filter((_, j) => j !== i))
                    }
                    className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-[#e6e6e6] text-[#6f6f6f]"
                  >
                    <X className="size-2.5" />
                  </button>
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
                disabled={!date || !time}
                className="grid size-[46px] place-items-center rounded-lg border border-[#d9d9d9] text-[#6f6f6f] disabled:opacity-40"
              >
                <Plus className="size-5" />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">
              <Select value={slug} onValueChange={setSlug}>
                <SelectTrigger className="h-14 w-full rounded-xl text-[17px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOKABLE.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
                <Calendar
                  month={month}
                  onMonthChange={setMonth}
                  selected={date}
                  onSelect={setDate}
                  isDayAvailable={isDayAvailable}
                  bookedDays={bookedDaysSet}
                  className="w-full p-4 sm:w-[330px] sm:shrink-0"
                />
                <div className="origin-top scale-[0.86] sm:origin-top-left">
                  <TimeSlots
                    value={time}
                    onChange={setTime}
                    taken={takenForDay}
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col lg:w-[300px] lg:shrink-0">
              <Media
                src={service?.image}
                alt={service?.name ?? ""}
                className="aspect-[340/280] w-full rounded-lg"
              />
              {multiDate && (
                <p className="mt-3 text-[12px] text-[#8a8a8a]">
                  Your selected date and time is included. Tap + to add more
                  dates.
                </p>
              )}
              {isProgramme && (
                <p className="mt-3 text-[12px] text-[#8a8a8a]">
                  The weekly sessions schedule automatically from this start
                  date.
                </p>
              )}
              {form.email.trim() && !emailValid && (
                <p className="mt-3 text-[12px] text-[#a33]">
                  Enter a valid e-mail address.
                </p>
              )}
              {error && (
                <p className="mt-3 text-[12px] text-[#a33]">{error}</p>
              )}
              {!pending && missing.length > 0 && (
                <p className="mt-3 text-[12px] text-[#8a8a8a]">
                  To confirm, add {missing.join(", ")}.
                </p>
              )}
              <Button
                variant="solid"
                size="lg"
                className="mt-4 px-12"
                disabled={!canSubmit}
                onClick={submit}
              >
                {pending ? "Saving…" : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
