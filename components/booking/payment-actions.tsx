"use client";

import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Building2, CreditCard, Loader2, X } from "lucide-react";

import { useBooking } from "@/components/booking/booking-context";
import { Button } from "@/components/ui/button";
import { createScheduledBooking } from "@/lib/booking-actions";
import { toSlotInstant } from "@/lib/availability";
import { bank } from "@/lib/site";

/*
 * Step 4's payment choice.
 *
 * The page used to print the bank details beside a single "Sent Notification of
 * Payment" button. Now it offers the two ways to pay, and the account details
 * live behind "Manually Pay" — a customer paying by card never sees them.
 *
 * Confirming inside that modal is what persists the booking: it lands in the
 * admin list as PENDING with its payment NOTIFIED, exactly as the old single
 * button did. Paystack is a separate flow and is not wired up yet.
 */
export function PaymentActions() {
  const { service, date, time, mode, details } = useBooking();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cardNote, setCardNote] = React.useState(false);

  const ready = Boolean(
    service && date && time && details.fullName && details.email
  );

  async function submit() {
    if (!service || !date || !time) return;
    setPending(true);
    setError(null);
    const res = await createScheduledBooking({
      serviceSlug: service.slug,
      startISO: toSlotInstant(date, time).toISOString(),
      mode,
      details,
    });
    setPending(false);
    if (res.ok) {
      setOpen(false);
      setDone(true);
    } else {
      setError(res.error);
    }
  }

  if (done) {
    return (
      <div className="max-w-[420px] animate-in rounded-lg bg-white/70 px-6 py-5 duration-500 ease-soft fade-in-0 fill-mode-both slide-in-from-bottom-2">
        <p className="text-[15px] font-bold text-[#111]">
          Thank you — we&rsquo;ve received your notification.
        </p>
        <p className="mt-1 text-[14px] leading-[1.5] text-[#111]">
          Linda&rsquo;s team will verify your payment and confirm your
          appointment and will reach out to you immediately.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[14px] font-bold text-[#111]">
        How would you like to pay?
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          variant="pill"
          size="lg"
          className="font-bold sm:px-8"
          onClick={() => setCardNote(true)}
        >
          <CreditCard className="mr-2.5 size-[18px]" strokeWidth={2} />
          Pay with Paystack
        </Button>

        <Button
          variant="soft"
          size="lg"
          className="font-bold sm:px-8"
          onClick={() => {
            setCardNote(false);
            setOpen(true);
          }}
        >
          <Building2 className="mr-2.5 size-[18px]" strokeWidth={2} />
          Manually Pay
        </Button>
      </div>

      {cardNote && (
        <p className="mt-3 max-w-[420px] animate-in text-[12.5px] leading-[1.6] text-[#6b6b6b] duration-[var(--dur-base)] ease-quart fade-in-0 fill-mode-both">
          Card payment is still being set up. For now, please choose{" "}
          <span className="font-semibold text-[#111]">Manually Pay</span> to
          transfer to the account and confirm.
        </p>
      )}

      {!ready && (
        <p className="mt-3 animate-in text-[12px] text-[#a33] duration-[var(--dur-base)] fade-in-0 fill-mode-both">
          Please complete the earlier booking steps first.
        </p>
      )}

      <ManualPaymentDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={submit}
        price={service?.price}
        ready={ready}
        pending={pending}
        error={error}
      />
    </div>
  );
}

/* The account details, shown only once "Manually Pay" is chosen. Confirming
   here is the customer telling us the transfer has left their bank. */
function ManualPaymentDialog({
  open,
  onOpenChange,
  onConfirm,
  price,
  ready,
  pending,
  error,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  price?: string;
  ready: boolean;
  pending: boolean;
  error: string | null;
}) {
  const rows = [
    ["Account Number", bank.accountNumber],
    ["Account Name", bank.accountName],
    ["Bank", bank.bank],
  ] as const;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:duration-200 data-[state=open]:duration-300" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100vw-32px)] max-w-[460px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ease-quart data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:duration-200 data-[state=open]:duration-300 sm:p-8">
          <DialogPrimitive.Title className="text-[19px] font-bold text-[#111]">
            Transfer to this account
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 text-[13.5px] leading-[1.6] text-[#3d3d3d]">
            Send{price ? ` ${price}` : " the service fee"} to the account below,
            then tap confirm so we can verify it and send your confirmation
            e-mail.
          </DialogPrimitive.Description>

          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-[#8a8a8a] transition-colors hover:bg-surface-muted hover:text-[#111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" strokeWidth={1.75} />
          </DialogPrimitive.Close>

          <dl className="mt-6 divide-y divide-[#f0e4f7] overflow-hidden rounded-xl border border-[#f0e4f7] bg-[#fdf9ff]">
            {rows.map(([label, value]) => (
              <div key={label} className="px-5 py-4">
                <dt className="text-[12px] font-bold uppercase tracking-[0.08em] text-brand-ink">
                  {label}
                </dt>
                <dd className="mt-1 break-words text-[19px] font-medium text-[#111]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {error && (
            <p className="mt-4 text-[12.5px] leading-[1.5] text-[#a33]">
              {error}
            </p>
          )}
          {!ready && (
            <p className="mt-4 text-[12.5px] leading-[1.5] text-[#a33]">
              Please complete the earlier booking steps first.
            </p>
          )}

          <Button
            variant="solid"
            size="lg"
            className="mt-6 w-full font-bold"
            disabled={!ready || pending}
            onClick={onConfirm}
          >
            {pending && (
              <Loader2 className="-ml-1 mr-2 size-4 shrink-0 animate-spin" />
            )}
            I&rsquo;ve Made the Payment
          </Button>

          <p className="mt-3 text-center text-[11.5px] leading-[1.5] text-[#6b6b6b]">
            Only tap this once the transfer has gone through.
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
