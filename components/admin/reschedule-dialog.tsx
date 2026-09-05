"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { X } from "lucide-react";

import { TimeSlots } from "@/components/booking/time-slots";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { getTakenSlots } from "@/app/book/actions";
import { rescheduleAppointment } from "@/lib/admin-actions";
import { isDayAvailable, timeSlots, toSlotInstant } from "@/lib/availability";

/* Pick a new date + time for a single appointment. Reuses the booking calendar
   and slot column, and honours the same Tue/Fri availability + slot locking. */
export function RescheduleDialog({
  appointmentId,
  onOpenChange,
  onDone,
}: {
  appointmentId: string | null;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}) {
  const open = appointmentId !== null;
  const [month, setMonth] = React.useState(() => new Date(2026, 8, 1));
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>();
  const [taken, setTaken] = React.useState<string[]>([]);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reset each time the dialog opens for a new appointment.
  React.useEffect(() => {
    if (open) {
      setDate(undefined);
      setTime(undefined);
      setTaken([]);
      setError(null);
    }
  }, [open]);

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

  async function submit() {
    if (!appointmentId || !date || !time) return;
    setPending(true);
    setError(null);
    const res = await rescheduleAppointment(
      appointmentId,
      toSlotInstant(date, time).toISOString()
    );
    setPending(false);
    if (res.ok) onDone();
    else setError(res.error);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
          <DialogPrimitive.Title className="text-[18px] font-bold text-[#111]">
            Re-Schedule appointment
          </DialogPrimitive.Title>
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-5 top-5 grid size-8 place-items-center rounded-md text-[#8a8a8a] hover:bg-surface-muted"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>

          <div className="mt-5 flex gap-6">
            <Calendar
              month={month}
              onMonthChange={setMonth}
              selected={date}
              onSelect={setDate}
              isDayAvailable={isDayAvailable}
              className="w-[360px] shrink-0"
            />
            <div className="origin-top scale-[0.9]">
              <TimeSlots value={time} onChange={setTime} taken={taken} />
            </div>
          </div>

          {error && <p className="mt-3 text-[12px] text-[#a33]">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="softViolet"
              size="md"
              className="px-6"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              size="md"
              className="px-8"
              disabled={!date || !time || pending}
              onClick={submit}
            >
              {pending ? "Saving…" : "Confirm new time"}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
