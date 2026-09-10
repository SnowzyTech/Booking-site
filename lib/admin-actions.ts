"use server";

import { revalidatePath } from "next/cache";
import { addWeeks } from "date-fns";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toDayInstant } from "@/lib/availability";
import { PREMIUM_SLUG, getService, type ServiceKind } from "@/lib/services";

const KIND_MAP: Record<ServiceKind, "ONE_OFF" | "PROGRAMME" | "CORPORATE"> = {
  "one-off": "ONE_OFF",
  programme: "PROGRAMME",
  corporate: "CORPORATE",
};

/*
 * Admin server actions for the appointments board.
 *
 * SECURITY: Server Actions are reachable by direct POST, so every one of these
 * must confirm the caller is an admin — the route guard in proxy.ts does not
 * cover them. assertAdmin() re-checks the Auth.js session on every call.
 */
async function assertAdmin(): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
}

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Pending -> Confirmed. Badge derives to yellow until the first session starts. */
export async function confirmBooking(id: string): Promise<ActionResult> {
  await assertAdmin();
  try {
    await prisma.booking.update({ where: { id }, data: { status: "CONFIRMED" } });
    revalidatePath("/admin/appointments");
    return { ok: true };
  } catch (e) {
    console.error("confirmBooking failed", e);
    return { ok: false, error: "Could not confirm this booking." };
  }
}

/** Pending -> Declined. Drops off the active board. */
export async function declineBooking(id: string): Promise<ActionResult> {
  await assertAdmin();
  try {
    await prisma.booking.update({ where: { id }, data: { status: "DECLINED" } });
    revalidatePath("/admin/appointments");
    return { ok: true };
  } catch (e) {
    console.error("declineBooking failed", e);
    return { ok: false, error: "Could not decline this booking." };
  }
}

/** Mark the active session done; the next becomes active. When none remain,
 *  the whole booking is completed and leaves the board. */
export async function completeAndContinue(id: string): Promise<ActionResult> {
  await assertAdmin();
  try {
    const appts = await prisma.appointment.findMany({
      where: { bookingId: id },
      orderBy: { position: "asc" },
      select: { id: true, state: true },
    });
    const active = appts.find((a) => a.state !== "DONE");
    if (active) {
      await prisma.appointment.update({
        where: { id: active.id },
        data: { state: "DONE" },
      });
    }
    const stillOpen = appts.some((a) => a.state !== "DONE" && a.id !== active?.id);
    if (!stillOpen) {
      await prisma.booking.update({ where: { id }, data: { status: "COMPLETED" } });
    }
    revalidatePath("/admin/appointments");
    return { ok: true };
  } catch (e) {
    console.error("completeAndContinue failed", e);
    return { ok: false, error: "Could not advance this booking." };
  }
}

/**
 * Manually create a booking from the admin dialog. Admin-added orders are
 * already paid, so they land CONFIRMED / VERIFIED (no Confirm step) and carry
 * the yellow "New" badge until their first session. `slots` are ISO instants,
 * in session order; one for a one-off, several for a programme/corporate.
 */
export async function createAdminBooking(input: {
  serviceSlug: string;
  client: {
    fullName: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
  slots: string[];
}): Promise<ActionResult> {
  await assertAdmin();

  const service = getService(input.serviceSlug);
  if (!service) return { ok: false, error: "Unknown service." };
  if (service.slug === PREMIUM_SLUG) {
    return { ok: false, error: "Premium 1:1 is managed from the Clients page." };
  }
  if (!input.client.fullName.trim() || !input.client.email.trim()) {
    return { ok: false, error: "Name and e-mail are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.client.email.trim())) {
    return { ok: false, error: "Please enter a valid e-mail address." };
  }

  let parsed = input.slots
    .map((iso) => new Date(iso))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (parsed.length === 0) {
    return { ok: false, error: "Add at least one date and time." };
  }
  parsed.sort((a, b) => a.getTime() - b.getTime());

  const tpl = service.sessions ?? [];

  // A programme (Meal Plans) is booked with a single start date; its fixed
  // weekly sessions are derived from the template here so the admin never enters
  // them by hand. "WEEK n" maps to n-1 whole weeks after the start — and adding
  // whole weeks keeps the same weekday, so every session stays on an available
  // day at the same time as the start.
  if (service.kind === "programme" && tpl.length > 1 && parsed.length === 1) {
    const start = parsed[0];
    parsed = tpl.map((s) => {
      const week = parseInt((s.label ?? "").replace(/\D/g, ""), 10) || 1;
      return addWeeks(start, week - 1);
    });
  }
  const appointments = parsed.map((scheduledAt, i) => ({
    scheduledAt,
    position: i,
    label:
      tpl[i]?.label ??
      (service.kind === "corporate"
        ? `Day ${i + 1}`
        : service.kind === "programme"
          ? `WEEK ${i + 1}`
          : null),
    title: tpl[i]?.title ?? null,
  }));

  try {
    await prisma.$transaction(async (tx) => {
      const clash = await tx.appointment.findFirst({
        where: {
          scheduledAt: { in: parsed },
          booking: { status: { notIn: ["DECLINED", "CANCELLED"] } },
        },
        select: { id: true },
      });
      if (clash) throw new Error("SLOT_TAKEN");

      const contact = {
        fullName: input.client.fullName.trim(),
        email: input.client.email.trim(),
        phone: input.client.phone.trim() || null,
        whatsapp: input.client.whatsapp.trim() || null,
        address: input.client.address.trim() || null,
      };
      const existing = await tx.client.findFirst({
        where: { email: contact.email },
        select: { id: true },
      });
      const client = existing
        ? await tx.client.update({ where: { id: existing.id }, data: contact })
        : await tx.client.create({ data: contact });

      await tx.booking.create({
        data: {
          clientId: client.id,
          serviceSlug: service.slug,
          serviceName: service.name,
          kind: KIND_MAP[service.kind],
          flow: service.flow === "assisted" ? "ASSISTED" : "SCHEDULED",
          status: "CONFIRMED",
          paymentStatus: "VERIFIED",
          paymentVerifiedAt: new Date(),
          deliverables: service.deliverables ?? [],
          appointments: { create: appointments },
        },
      });
    });
    revalidatePath("/admin/appointments");
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "SLOT_TAKEN") {
      return { ok: false, error: "One of those slots is already taken." };
    }
    console.error("createAdminBooking failed", e);
    return { ok: false, error: "Could not create the booking." };
  }
}

/** Move a single appointment to a new instant, if that slot is free. */
export async function rescheduleAppointment(
  appointmentId: string,
  startISO: string
): Promise<ActionResult> {
  await assertAdmin();
  const start = new Date(startISO);
  if (Number.isNaN(start.getTime())) {
    return { ok: false, error: "Please choose a new date and time." };
  }
  try {
    await prisma.$transaction(async (tx) => {
      const clash = await tx.appointment.findFirst({
        where: {
          scheduledAt: start,
          id: { not: appointmentId },
          booking: { status: { notIn: ["DECLINED", "CANCELLED"] } },
        },
        select: { id: true },
      });
      if (clash) throw new Error("SLOT_TAKEN");
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { scheduledAt: start },
      });
    });
    revalidatePath("/admin/appointments");
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "SLOT_TAKEN") {
      return { ok: false, error: "That slot is already taken. Please pick another." };
    }
    console.error("rescheduleAppointment failed", e);
    return { ok: false, error: "Could not reschedule this appointment." };
  }
}

/*
 * Clients page (Frame 209 / MacBook Pro 14_ - 9).
 *
 * A One-on-One Premium engagement is arranged over WhatsApp and billed monthly,
 * so the dialog collects contact details plus a start date only — no time slot,
 * no payment step. It is created CONFIRMED / VERIFIED like any other
 * admin-entered order.
 */
export async function createPremiumClient(input: {
  client: {
    fullName: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
  /** Optional free-text note about the engagement. */
  notes?: string;
  /** Start date as yyyy-MM-dd (the calendar day the admin picked). */
  startDate: string;
}): Promise<ActionResult> {
  await assertAdmin();

  const service = getService(PREMIUM_SLUG);
  if (!service) return { ok: false, error: "Unknown service." };
  // Every contact field except the note is required for a premium client.
  const c = input.client;
  if (
    !c.fullName.trim() ||
    !c.phone.trim() ||
    !c.whatsapp.trim() ||
    !c.email.trim() ||
    !c.address.trim()
  ) {
    return { ok: false, error: "All fields except Notes are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) {
    return { ok: false, error: "Please enter a valid e-mail address." };
  }

  const [y, m, d] = input.startDate.split("-").map(Number);
  if (!y || !m || !d) {
    return { ok: false, error: "Pick a start date." };
  }
  const startsAt = toDayInstant(new Date(y, m - 1, d));

  try {
    const contact = {
      fullName: input.client.fullName.trim(),
      email: input.client.email.trim(),
      phone: input.client.phone.trim() || null,
      whatsapp: input.client.whatsapp.trim() || null,
      address: input.client.address.trim() || null,
    };
    await prisma.$transaction(async (tx) => {
      const existing = await tx.client.findFirst({
        where: { email: contact.email },
        select: { id: true },
      });
      const client = existing
        ? await tx.client.update({ where: { id: existing.id }, data: contact })
        : await tx.client.create({ data: contact });

      // A previously opted-out engagement carries an endsAt, so it no longer
      // blocks re-subscribing — only a live, still-running plan does.
      const live = await tx.booking.findFirst({
        where: {
          clientId: client.id,
          serviceSlug: PREMIUM_SLUG,
          status: { in: ["PENDING", "CONFIRMED"] },
          endsAt: null,
        },
        select: { id: true },
      });
      if (live) throw new Error("ALREADY_PREMIUM");

      await tx.booking.create({
        data: {
          clientId: client.id,
          serviceSlug: service.slug,
          serviceName: service.name,
          kind: KIND_MAP[service.kind],
          flow: "ASSISTED",
          status: "CONFIRMED",
          paymentStatus: "VERIFIED",
          paymentVerifiedAt: new Date(),
          note: input.notes?.trim() || null,
          appointments: {
            create: [{ position: 0, label: "Start", scheduledAt: startsAt }],
          },
        },
      });
    });
    revalidatePath("/admin/clients");
    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "ALREADY_PREMIUM") {
      return { ok: false, error: "That client already has a live premium plan." };
    }
    console.error("createPremiumClient failed", e);
    return { ok: false, error: "Could not add this client." };
  }
}

/** Unsubscribe a premium client from the viewed month onward. Rather than
 *  cancelling the booking outright, this records endsAt at the first day of that
 *  month: the roster filter (monthKey < endKey) then hides the client from that
 *  month and every later one, while earlier months keep showing them. `monthKey`
 *  is the yyyy-MM the admin was viewing when they tapped Opt out. */
export async function optOutClient(
  bookingId: string,
  monthKey: string
): Promise<ActionResult> {
  await assertAdmin();
  const [y, m] = monthKey.split("-").map(Number);
  if (!y || !m) return { ok: false, error: "Could not opt this client out." };
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { endsAt: toDayInstant(new Date(y, m - 1, 1)) },
    });
    revalidatePath("/admin/clients");
    return { ok: true };
  } catch (e) {
    console.error("optOutClient failed", e);
    return { ok: false, error: "Could not opt this client out." };
  }
}
