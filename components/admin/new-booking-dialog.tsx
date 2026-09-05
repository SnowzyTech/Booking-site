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
import { getTakenSlots } from "@/app/book/actions";
import { createAdminBooking } from "@/lib/admin-actions";
import { isDayAvailable, timeSlots, toSlotInstant } from "@/lib/availability";
import { services } from "@/lib/services";

const FIELDS = [
  ["name", "Name"],
  ["phone", "Phone Number"],
  ["whatsapp", "Whatsapp Number"],
  ["email", "E-mail"],
  ["address", "Address"],
  ["address2", "Address"],
] as const;

type FieldKey = (typeof FIELDS)[number][0];

// Premium 1:1 belongs on the (future) Clients page, not the appointments board.
const BOOKABLE = services.filter((s) => s.slug !== "one-on-one-premium");
const emptyForm: Record<FieldKey, string> = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  address2: "",
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
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const service = BOOKABLE.find((s) => s.slug === slug);
  const multiDay = service?.kind !== "one-off";

  // Reset the multi-date list when switching service shape.
  React.useEffect(() => {
    setDates([]);
    setTime(undefined);
  }, [slug]);

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

  const chosen = multiDay ? dates : date && time ? [{ date, time }] : [];

  async function submit() {
    setPending(true);
    setError(null);
    const res = await createAdminBooking({
      serviceSlug: slug,
      client: {
        fullName: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        address: [form.address, form.address2]
          .map((s) => s.trim())
          .filter(Boolean)
          .join(", "),
      },
      slots: chosen.map((c) => toSlotInstant(c.date, c.time).toISOString()),
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

  const canSubmit =
    !pending && form.name.trim() && form.email.trim() && chosen.length > 0;

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
                <Input
                  id={`nb-${key}`}
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

          {multiDay && (
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

          <div className="flex gap-8">
            <div className="flex-1">
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

              <div className="mt-4 flex gap-4">
                <Calendar
                  month={month}
                  onMonthChange={setMonth}
                  selected={date}
                  onSelect={setDate}
                  isDayAvailable={isDayAvailable}
                  className="w-[330px] shrink-0 p-4"
                />
                <div className="origin-top scale-[0.86]">
                  <TimeSlots value={time} onChange={setTime} taken={taken} />
                </div>
              </div>
            </div>

            <div className="flex w-[300px] shrink-0 flex-col">
              <Media
                src={service?.image}
                alt={service?.name ?? ""}
                className="aspect-[340/280] w-full rounded-lg"
              />
              {multiDay && (
                <p className="mt-3 text-[12px] text-[#8a8a8a]">
                  Pick a date and time, then tap + to add each session.
                </p>
              )}
              {error && (
                <p className="mt-3 text-[12px] text-[#a33]">{error}</p>
              )}
              <Button
                variant="solid"
                size="lg"
                className="mt-auto px-12"
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
