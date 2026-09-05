"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";

import { ProgressDots } from "@/components/admin/progress-dots";
import { RescheduleDialog } from "@/components/admin/reschedule-dialog";
import { Button } from "@/components/ui/button";
import {
  completeAndContinue,
  confirmBooking,
  declineBooking,
} from "@/lib/admin-actions";
import type { Booking } from "@/lib/bookings";
import { cn } from "@/lib/utils";

/*
 * One booking row. Collapsed by default; clicking expands it.
 *
 * States, all taken from the detail exports:
 *   collapsed + pending    -> Confirm             (Frame 131 / 205)
 *   collapsed + confirmed  -> Re-Schedule         (Frame 203)
 *   collapsed + programme  -> progress dots       (Frame 136)
 *   expanded  + pending    -> Decline + Confirm   (Frame 134 / 207)
 *   expanded  + confirmed  -> Complete & Continue (Frame 206 / 208)
 */
type RowActions = {
  pending: boolean;
  confirm: () => void;
  decline: () => void;
  complete: () => void;
  reschedule: (appointmentId?: string) => void;
};

export function BookingRow({ booking }: { booking: Booking }) {
  const [open, setOpen] = React.useState(false);
  const [rescheduleId, setRescheduleId] = React.useState<string | null>(null);
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const hasTimeline = (booking.sessions?.length ?? 0) > 0;

  const run = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  const actions: RowActions = {
    pending,
    confirm: () => run(() => confirmBooking(booking.id)),
    decline: () => run(() => declineBooking(booking.id)),
    complete: () => run(() => completeAndContinue(booking.id)),
    reschedule: (id) => {
      if (id) setRescheduleId(id);
    },
  };

  return (
    <div className="rounded-2xl bg-white px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {/* The expand toggle deliberately excludes the action column — nesting a
          <button> inside a <button> is invalid HTML and breaks hydration. */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center text-left"
        >
          <span
          className={cn(
            "grid size-[42px] shrink-0 place-items-center rounded-full text-[14px] font-medium",
            booking.avatarTone
          )}
        >
          {booking.initial}
        </span>

        <span className="ml-4 flex min-w-0 flex-col">
          <span className="flex items-start gap-1.5">
            <span className="text-[20px] font-medium text-[#111]">
              {booking.name}
            </span>
            {booking.badge !== "none" && (
              <span
                className={cn(
                  "mt-1 rounded-[2px] px-1 text-[7px] font-semibold leading-[1.5]",
                  booking.badge === "new"
                    ? "bg-badge-new text-white"
                    : "bg-[#f5c518] text-[#3a2c00]"
                )}
              >
                New
              </span>
            )}
          </span>
          {open && (
            <span className="text-[14px] text-[#6f6f6f]">{booking.service}</span>
          )}
        </span>

          {open ? (
            <ContactHeader booking={booking} />
          ) : (
            <>
              <span className="ml-auto w-[280px] shrink-0 text-[15px] text-[#4a4a4a]">
                {booking.service}
              </span>
              <span className="w-[210px] shrink-0">
                {booking.nextLabel && (
                  <span className="block text-[12px] text-[#8a8a8a]">
                    {booking.nextLabel}
                  </span>
                )}
                <span
                  className={cn(
                    "block text-[15px]",
                    booking.nextLabel ? "text-[#111]" : "text-[#b0b0b0]"
                  )}
                >
                  {booking.nextValue}
                </span>
              </span>
            </>
          )}
        </button>

        {!open && (
          <div className="flex w-[230px] shrink-0 justify-end">
            <CollapsedAction booking={booking} actions={actions} />
          </div>
        )}
      </div>

      {open && (
        <>
          {hasTimeline && <Timeline booking={booking} actions={actions} />}

          <div
            className={cn(
              "flex items-center justify-between",
              hasTimeline ? "mt-8" : "mt-6 border-t border-[#ececec] pt-6"
            )}
          >
            {/* A one-off shows its single slot here; a programme shows dots. */}
            {booking.slot ? (
              <span className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded bg-[#efefef] px-2 py-1 text-[12px] text-[#111]">
                  {booking.slot.date}
                  <span className="text-brand">{booking.slot.time}</span>
                </span>
                <span className="text-[19px] font-bold text-[#111]">
                  {booking.slot.short}
                </span>
              </span>
            ) : booking.progress ? (
              <ProgressDots
                total={booking.progress.total}
                done={booking.progress.done}
              />
            ) : (
              <span />
            )}

            <div className="flex items-center gap-3">
              {booking.status === "pending" ? (
                <>
                  <Button
                    variant="softViolet"
                    size="md"
                    className="px-8"
                    disabled={actions.pending}
                    onClick={actions.decline}
                  >
                    Decline
                  </Button>
                  <Button
                    variant="solid"
                    size="md"
                    className="px-10"
                    disabled={actions.pending}
                    onClick={actions.confirm}
                  >
                    Confirm
                  </Button>
                </>
              ) : booking.kind === "one-off" ? (
                <Button
                  variant="outline"
                  size="md"
                  className="w-[215px]"
                  disabled={actions.pending}
                  onClick={() => actions.reschedule(booking.slot?.appointmentId)}
                >
                  Re-Schedule
                </Button>
              ) : (
                <Button
                  variant="solid"
                  size="md"
                  className="px-8"
                  disabled={actions.pending}
                  onClick={actions.complete}
                >
                  Complete &amp; Continue
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      <RescheduleDialog
        appointmentId={rescheduleId}
        onOpenChange={(v) => {
          if (!v) setRescheduleId(null);
        }}
        onDone={() => {
          setRescheduleId(null);
          router.refresh();
        }}
      />
    </div>
  );
}

function CollapsedAction({
  booking,
  actions,
}: {
  booking: Booking;
  actions: RowActions;
}) {
  if (booking.status === "pending") {
    return (
      <Button
        variant="solid"
        size="md"
        className="w-[145px]"
        disabled={actions.pending}
        onClick={actions.confirm}
      >
        Confirm
      </Button>
    );
  }
  if (booking.progress && booking.kind !== "one-off") {
    return (
      <ProgressDots
        total={booking.progress.total}
        done={booking.progress.done}
      />
    );
  }
  return (
    <Button
      variant="outline"
      size="md"
      className="w-[215px]"
      disabled={actions.pending}
      onClick={() => actions.reschedule(booking.slot?.appointmentId)}
    >
      Re-Schedule
    </Button>
  );
}

function ContactHeader({ booking }: { booking: Booking }) {
  const fields = [
    { label: "WhatsApp Number", value: booking.contact.whatsapp, copy: true },
    { label: "Phone Number", value: booking.contact.phone, copy: true },
    { label: "E-mail", value: booking.contact.email, copy: true },
    { label: "Address", value: booking.contact.address, copy: false },
  ];

  return (
    <span className="ml-auto grid max-w-[900px] flex-1 grid-cols-4 gap-6">
      {fields.map((f) => (
        <span key={f.label} className="block">
          <span className="block text-[12px] text-[#8a8a8a]">{f.label}</span>
          <span className="mt-0.5 flex items-start gap-1.5">
            <span className="text-[14px] leading-snug text-[#111]">
              {f.value}
            </span>
            {f.copy && (
              <Copy className="mt-0.5 size-3.5 shrink-0 text-[#8a8a8a]" />
            )}
          </span>
        </span>
      ))}
    </span>
  );
}

function Timeline({
  booking,
  actions,
}: {
  booking: Booking;
  actions: RowActions;
}) {
  const corporate = booking.kind === "corporate";

  return (
    <div className="mt-6 border-t border-[#ececec] pt-6">
      <div className="flex gap-x-6">
        {booking.sessions!.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={cn("flex-1", i > 0 && "border-l border-[#ececec] pl-6")}>
              {!corporate && (
                <p
                  className={cn(
                    "text-[12px] uppercase tracking-wide",
                    s.state === "active" ? "text-[#4a4a4a]" : "text-[#b6b6b6]"
                  )}
                >
                  {s.label}
                </p>
              )}

              <p className="mt-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded bg-[#efefef] px-2 py-1 text-[12px]",
                    s.state === "active" ? "text-[#111]" : "text-[#b6b6b6]"
                  )}
                >
                  {s.date}
                  {s.time && (
                    <span
                      className={
                        s.state === "active" ? "text-brand" : "text-[#c9c9c9]"
                      }
                    >
                      {s.time}
                    </span>
                  )}
                </span>
              </p>

              <div
                className={cn(
                  "mt-2 gap-3",
                  corporate ? "flex items-center" : "block"
                )}
              >
                <p
                  className={cn(
                    "text-[19px] font-bold leading-tight",
                    s.state === "active" ? "text-[#111]" : "text-[#c4c4c4]"
                  )}
                >
                  {s.title ?? s.label}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actions.pending}
                  onClick={() => actions.reschedule(s.id)}
                  className={cn(
                    "px-6",
                    !corporate && "mt-3",
                    s.state !== "active" && "border-[#e6c7f5] text-[#d0a3e8]"
                  )}
                >
                  Re-Schedule
                </Button>
              </div>
            </div>

            {i === 1 && booking.deliverables && (
              <div className="w-[190px] shrink-0">
                <p className="text-[13px] text-[#8a8a8a]">Deliverables</p>
                <ul className="mt-2 space-y-2">
                  {booking.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-[12.5px] leading-snug text-[#b6b6b6]"
                    >
                      <span className="mt-0.5 size-3 shrink-0 rounded-full border border-[#d0d0d0]" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
