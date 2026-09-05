"use server";

import { prisma } from "@/lib/prisma";
import { getService, type ServiceKind } from "@/lib/services";

/*
 * Public booking server actions.
 *
 * A scheduled booking is written to the DB the moment the customer taps
 * "Sent Notification of Payment" on /book/payment — it lands in the admin list
 * as a PENDING order whose payment has been NOTIFIED (awaiting verification).
 * The assisted flow (Corporate / Events / Premium) writes nothing here — those
 * are pure WhatsApp hand-offs, added later by an admin.
 */

export type BookingDetails = {
  fullName: string;
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  note: string;
};

export type CreateBookingResult =
  | { ok: true; bookingId: string }
  | { ok: false; error: string };

const KIND_MAP: Record<ServiceKind, "ONE_OFF" | "PROGRAMME" | "CORPORATE"> = {
  "one-off": "ONE_OFF",
  programme: "PROGRAMME",
  corporate: "CORPORATE",
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Persist a scheduled booking + its appointment(s). */
export async function createScheduledBooking(input: {
  serviceSlug: string;
  /** The chosen slot as an ISO instant (see toSlotInstant in lib/availability). */
  startISO: string;
  details: BookingDetails;
}): Promise<CreateBookingResult> {
  const service = getService(input.serviceSlug);
  if (!service || service.flow !== "scheduled") {
    return { ok: false, error: "This service isn't booked through the calendar." };
  }

  const start = new Date(input.startISO);
  if (Number.isNaN(start.getTime())) {
    return { ok: false, error: "Please choose an appointment date and time." };
  }
  if (!input.details.fullName?.trim() || !input.details.email?.trim()) {
    return { ok: false, error: "Your name and e-mail are required." };
  }

  // A meal-plan programme fans out to WEEK 1/2/4/6 (same weekday & time);
  // a one-off is a single appointment at the chosen slot.
  const plan =
    service.kind === "programme" && service.sessions?.length
      ? service.sessions.map((s, i) => {
          const week = Number(String(s.label).replace(/\D+/g, "")) || 1;
          return {
            label: s.label,
            title: s.title ?? null,
            position: i,
            scheduledAt: new Date(start.getTime() + (week - 1) * WEEK_MS),
          };
        })
      : [{ label: null, title: null, position: 0, scheduledAt: start }];

  const slots = plan.map((p) => p.scheduledAt);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // Slot locking: no two live bookings may share an instant.
      const clash = await tx.appointment.findFirst({
        where: {
          scheduledAt: { in: slots },
          booking: { status: { notIn: ["DECLINED", "CANCELLED"] } },
        },
        select: { id: true },
      });
      if (clash) throw new Error("SLOT_TAKEN");

      const contact = {
        fullName: input.details.fullName.trim(),
        email: input.details.email.trim(),
        phone: input.details.phone.trim() || null,
        whatsapp: input.details.whatsapp.trim() || null,
        address: input.details.address.trim() || null,
      };

      // Reuse a client record by e-mail, refreshing their latest contact info.
      const existing = await tx.client.findFirst({
        where: { email: contact.email },
        select: { id: true },
      });
      const client = existing
        ? await tx.client.update({ where: { id: existing.id }, data: contact })
        : await tx.client.create({ data: contact });

      return tx.booking.create({
        data: {
          clientId: client.id,
          serviceSlug: service.slug,
          serviceName: service.name,
          kind: KIND_MAP[service.kind],
          flow: "SCHEDULED",
          status: "PENDING",
          paymentStatus: "NOTIFIED",
          paymentNotifiedAt: new Date(),
          note: input.details.note.trim() || null,
          deliverables: service.deliverables ?? [],
          appointments: {
            create: plan.map((p) => ({
              label: p.label,
              title: p.title,
              position: p.position,
              scheduledAt: p.scheduledAt,
            })),
          },
        },
        select: { id: true },
      });
    });

    return { ok: true, bookingId: booking.id };
  } catch (e) {
    if (e instanceof Error && e.message === "SLOT_TAKEN") {
      return {
        ok: false,
        error: "One of those time slots was just taken. Please pick another time.",
      };
    }
    console.error("createScheduledBooking failed", e);
    return {
      ok: false,
      error: "Something went wrong creating your booking. Please try again.",
    };
  }
}

/** ISO instants already taken on a given day (yyyy-MM-dd), for greying out slots. */
export async function getTakenSlots(dayStr: string): Promise<string[]> {
  const [y, m, d] = dayStr.split("-").map(Number);
  if (!y || !m || !d) return [];

  const gte = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  const lte = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));

  const appts = await prisma.appointment.findMany({
    where: {
      scheduledAt: { gte, lte },
      booking: { status: { notIn: ["DECLINED", "CANCELLED"] } },
    },
    select: { scheduledAt: true },
  });

  return appts
    .map((a) => a.scheduledAt?.toISOString())
    .filter((iso): iso is string => Boolean(iso));
}
