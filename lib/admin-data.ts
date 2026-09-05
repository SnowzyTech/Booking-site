import { format } from "date-fns";

import { prisma } from "@/lib/prisma";
import type { AdminData, Booking, BookingKind, Session } from "@/lib/bookings";

/*
 * Reads bookings from the database and maps them into the `Booking` shape the
 * admin components render. Only live orders (PENDING / CONFIRMED) are listed;
 * declined, cancelled and completed orders drop out of the active board.
 */

const TONES = [
  "bg-[#f3d9ff] text-[#7b3fa0]",
  "bg-[#d9f5df] text-[#2f7d4a]",
  "bg-[#ff9b52] text-white",
  "bg-[#7a6a80] text-white",
];

const SHORT_SERVICE: Record<string, string> = {
  "individual-consultation": "Consultation",
  "personalized-meal-plans": "Meal Plan Program",
  "corporate-wellness": "Corporate Wellness Package",
  "events-training": "Health & Nutrition Training",
  "one-on-one-premium": "Premium 1:1",
};

const KIND: Record<string, BookingKind> = {
  ONE_OFF: "one-off",
  PROGRAMME: "programme",
  CORPORATE: "corporate",
};

/** Render a stored UTC-wall-clock instant back to its intended local wall clock
 *  (see toSlotInstant in lib/availability) so formatting is timezone-stable. */
function wall(d: Date): Date {
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    0,
    0
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export async function getAdminBookings(): Promise<AdminData> {
  const rows = await prisma.booking.findMany({
    where: { status: { in: ["PENDING", "CONFIRMED"] } },
    include: { client: true, appointments: { orderBy: { position: "asc" } } },
  });

  const now = new Date();

  const mapped = rows.map((row) => {
    const appts = row.appointments;
    const primary = appts[0]?.scheduledAt ?? row.createdAt;
    const doneCount = appts.filter((a) => a.state === "DONE").length;
    const activeIndex = appts.findIndex((a) => a.state !== "DONE");
    const earliest = appts[0]?.scheduledAt ?? null;
    const started = earliest ? wall(earliest) <= now : false;

    const kind = KIND[row.kind];
    const status: Booking["status"] =
      row.status === "PENDING" ? "pending" : "confirmed";
    const badge: Booking["badge"] =
      row.status === "PENDING" ? "new" : started ? "none" : "confirmed";

    const sessions: Session[] | undefined =
      kind === "one-off"
        ? undefined
        : appts.map((a, i) => {
            const state: Session["state"] =
              a.state === "DONE"
                ? "done"
                : i === activeIndex
                  ? "active"
                  : "upcoming";
            return {
              id: a.id,
              label: a.label ?? `Session ${i + 1}`,
              title: a.title ?? undefined,
              date: a.scheduledAt
                ? format(wall(a.scheduledAt), "d EEE. MMM. yyyy")
                : undefined,
              time:
                state === "active" && a.scheduledAt
                  ? format(wall(a.scheduledAt), "h:mm a")
                  : undefined,
              state,
            };
          });

    let nextLabel = "";
    let nextValue = "";
    if (kind === "one-off") {
      nextLabel = "One - Off";
      nextValue = format(wall(primary), "d EEE MMM");
    } else if (kind === "corporate") {
      nextLabel = "Appointment";
      const first = appts[0]?.scheduledAt;
      const last = appts[appts.length - 1]?.scheduledAt;
      nextValue =
        first && last
          ? `${format(wall(first), "d EEE")} - ${format(wall(last), "d EEE")}`
          : "";
    } else {
      nextLabel = "Next Appointment";
      const next = appts[activeIndex >= 0 ? activeIndex : 0]?.scheduledAt;
      nextValue = next ? format(wall(next), "d EEEE") : "";
    }

    const booking: Booking = {
      id: row.id,
      name: row.client.fullName,
      initial: (row.client.fullName.trim()[0] ?? "?").toUpperCase(),
      avatarTone: TONES[hash(row.id) % TONES.length],
      service: SHORT_SERVICE[row.serviceSlug] ?? row.serviceName,
      serviceSlug: row.serviceSlug,
      dateKey: format(wall(primary), "yyyy-MM-dd"),
      createdAt: row.createdAt.toISOString(),
      kind,
      status,
      badge,
      nextLabel,
      nextValue,
      progress:
        kind === "one-off"
          ? undefined
          : { total: appts.length, done: doneCount },
      contact: {
        whatsapp: row.client.whatsapp ?? "—",
        phone: row.client.phone ?? "—",
        email: row.client.email,
        address: row.client.address ?? "—",
      },
      sessions,
      deliverables: row.deliverables.length ? row.deliverables : undefined,
      slot:
        kind === "one-off"
          ? {
              appointmentId: appts[0]?.id ?? "",
              date: format(wall(primary), "d EEE. MMM. yyyy"),
              time: format(wall(primary), "h:mm a"),
              short: format(wall(primary), "MMM d"),
            }
          : undefined,
    };

    return { booking, primary };
  });

  // Newest first so new orders appear at the top of the board.
  mapped.sort((a, b) => b.booking.createdAt.localeCompare(a.booking.createdAt));
  const bookings = mapped.map((m) => m.booking);

  const pendingRows = rows.filter((r) => r.status === "PENDING");
  const throughDate = pendingRows
    .flatMap((r) => r.appointments.map((a) => a.scheduledAt))
    .filter((d): d is Date => Boolean(d))
    .sort((a, b) => wall(b).getTime() - wall(a).getTime())[0];

  const pendingSummary = {
    count: pendingRows.length,
    through: throughDate ? format(wall(throughDate), "d MMMM yyyy") : null,
  };

  return { bookings, pendingSummary };
}
