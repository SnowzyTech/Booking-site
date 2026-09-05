"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getService, type ServiceKind } from "@/lib/services";

const KIND_MAP: Record<ServiceKind, "ONE_OFF" | "PROGRAMME" | "CORPORATE"> = {
  "one-off": "ONE_OFF",
  programme: "PROGRAMME",
  corporate: "CORPORATE",
};

/*
 * Admin server actions for the appointments board.
 *
 * SECURITY: Server Actions are reachable by direct POST, so every one of these
 * must confirm the caller is an admin. Auth.js isn't wired yet (planned before
 * deploy), so assertAdmin() is a single stub to fill in then — do NOT ship
 * without it.
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
  if (service.slug === "one-on-one-premium") {
    return { ok: false, error: "Premium 1:1 is managed from the Clients page." };
  }
  if (!input.client.fullName.trim() || !input.client.email.trim()) {
    return { ok: false, error: "Name and e-mail are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.client.email.trim())) {
    return { ok: false, error: "Please enter a valid e-mail address." };
  }

  const parsed = input.slots
    .map((iso) => new Date(iso))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (parsed.length === 0) {
    return { ok: false, error: "Add at least one date and time." };
  }
  parsed.sort((a, b) => a.getTime() - b.getTime());

  const tpl = service.sessions ?? [];
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
