"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input, Label } from "@/components/ui/field";
import { Media } from "@/components/ui/media";
import { createPremiumClient } from "@/lib/admin-actions";
import { isDayAvailable } from "@/lib/availability";
import { PREMIUM_SLUG, getService } from "@/lib/services";

/*
 * "Add a premium client" dialog behind the Clients "+" FAB
 * (_mockups/2x/update/Frame 209.png).
 *
 * The same contact block as the booking dialog, then a start date — no service
 * dropdown (there is only one premium service) and no time-slot column, because
 * premium sessions are arranged over WhatsApp rather than booked into slots.
 *
 * The frame repeats "Address" in the sixth cell; that is the same Figma
 * duplication as admin-modal-fields.png, so the field list stays at five and
 * matches NewBookingDialog.
 */
const FIELDS = [
  ["name", "Name"],
  ["phone", "Phone Number"],
  ["whatsapp", "Whatsapp Number"],
  ["email", "E-mail"],
  ["address", "Address"],
] as const;

type FieldKey = (typeof FIELDS)[number][0];

const emptyForm: Record<FieldKey, string> = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
};

export function NewClientDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const service = getService(PREMIUM_SLUG);
  const [month, setMonth] = React.useState(() => new Date(2026, 8, 1));
  const [date, setDate] = React.useState<Date>();
  const [form, setForm] = React.useState<Record<FieldKey, string>>(emptyForm);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function reset() {
    setForm(emptyForm);
    setDate(undefined);
    setError(null);
  }

  async function submit() {
    if (!date) return;
    setPending(true);
    setError(null);
    const res = await createPremiumClient({
      client: {
        fullName: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        address: form.address.trim(),
      },
      startDate: format(date, "yyyy-MM-dd"),
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
  const canSubmit = !pending && Boolean(form.name.trim()) && emailValid && !!date;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-10 shadow-xl">
          <DialogPrimitive.Title className="sr-only">
            New premium client
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
                <Label htmlFor={`nc-${key}`}>{label}</Label>
                <Input
                  id={`nc-${key}`}
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

          <div className="flex justify-between gap-10">
            <Calendar
              month={month}
              onMonthChange={setMonth}
              selected={date}
              onSelect={setDate}
              isDayAvailable={isDayAvailable}
              className="w-[330px] shrink-0 p-4"
            />

            <div className="flex w-[360px] shrink-0 flex-col">
              <Media
                src={service?.image}
                alt={service?.name ?? ""}
                className="aspect-[347/257] w-full rounded-lg"
              />
              <p className="mt-3 text-[12px] text-[#8a8a8a]">
                {date
                  ? `Premium plan starts ${format(date, "EEEE d MMMM yyyy")}.`
                  : "Pick the date the premium plan starts."}
              </p>
              {form.email.trim() && !emailValid && (
                <p className="mt-1 text-[12px] text-[#a33]">
                  Enter a valid e-mail address.
                </p>
              )}
              {error && <p className="mt-1 text-[12px] text-[#a33]">{error}</p>}
              <Button
                variant="solid"
                size="lg"
                className="mt-5 self-start px-12"
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
