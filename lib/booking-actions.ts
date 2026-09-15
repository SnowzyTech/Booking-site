"use server";

import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { timeSlots } from "@/lib/availability";
import { notifyNewBooking } from "@/lib/email";
import {
  initializeTransaction,
  newReference,
  verifyTransaction,
} from "@/lib/paystack";
import {
  getService,
  needsEnquiry,
  priceToKobo,
  type Service,
  type ServiceKind,
} from "@/lib/services";

/*
 * Public booking server actions.
 *
 * A scheduled booking is written to the DB once its payment is settled. Two ways
 * in, both funnelling through the private finalizeBooking():
 *   - Manual bank transfer: the customer taps "I've Made the Payment" on
 *     /book/payment → createScheduledBooking() writes it as PENDING / NOTIFIED
 *     (awaiting an admin's bank check).
 *   - Paystack card: startPaystackCheckout() sends the customer to Paystack's
 *     hosted page; when the payment succeeds, finalizePaystackPayment() (called
 *     by the webhook and the return page) writes it as PENDING / VERIFIED.
 *
 * Corporate Wellness and Events Training take the same calendar step but pay
 * nothing up front: createEnquiryBooking() writes them as PENDING / AWAITING
 * with the event brief attached, and the Team takes it from there over WhatsApp.
 *
 * Premium still writes nothing here — it is a pure WhatsApp hand-off, added
 * later by an admin from /admin/clients.
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

/** The event brief behind a Corporate Wellness / Events Training booking,
 *  collected on /book/enquiry. The date of the event is not here — it is the
 *  slot picked on the calendar step, like every other booking. */
export type EnquiryInput = {
  organization: string;
  location: string;
  audienceSize: string;
  topic: string;
  duration: string;
};

/** The data a booking is built from — shared by the manual action, the Paystack
 *  checkout, (via metadata) the Paystack finalize step, and the enquiry action. */
type BookingInput = {
  serviceSlug: string;
  /** The chosen slot as an ISO instant (see toSlotInstant in lib/availability). */
  startISO: string;
  /** Virtual call or in-person, picked on the schedule step. Anything other
   *  than "physical" is treated as virtual — the safe default. */
  mode: "virtual" | "physical";
  details: BookingDetails;
  /** Only the two enquiry services carry this — see needsEnquiry. */
  enquiry?: EnquiryInput;
};

const KIND_MAP: Record<ServiceKind, "ONE_OFF" | "PROGRAMME" | "CORPORATE"> = {
  "one-off": "ONE_OFF",
  programme: "PROGRAMME",
  corporate: "CORPORATE",
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const enquiryComplete = (e?: EnquiryInput): e is EnquiryInput =>
  Boolean(
    e &&
      e.organization.trim() &&
      e.location.trim() &&
      e.audienceSize.trim() &&
      e.topic.trim() &&
      e.duration.trim()
  );

/** Shared validation: the service must be the kind `expect` says it is, and the
 *  slot, name and e-mail must be usable. `expect` is what keeps an enquiry out
 *  of the card-payment path and a paid service out of the enquiry action — the
 *  two differ only in which services they accept and whether a brief is required. */
function validateBooking(
  input: BookingInput,
  expect: "scheduled" | "enquiry"
): { ok: true; service: Service; start: Date } | { ok: false; error: string } {
  const service = getService(input.serviceSlug);
  const allowed =
    service &&
    (expect === "enquiry" ? needsEnquiry(service) : service.flow === "scheduled");
  if (!service || !allowed) {
    return { ok: false, error: "This service isn't booked through the calendar." };
  }
  const start = new Date(input.startISO);
  if (Number.isNaN(start.getTime())) {
    return { ok: false, error: "Please choose an appointment date and time." };
  }
  if (!input.details.fullName?.trim() || !input.details.email?.trim()) {
    return { ok: false, error: "Your name and e-mail are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.details.email.trim())) {
    return { ok: false, error: "Please enter a valid e-mail address." };
  }
  if (expect === "enquiry" && !enquiryComplete(input.enquiry)) {
    return { ok: false, error: "Please complete the event details." };
  }
  return { ok: true, service, start };
}

/** A meal-plan programme fans out to WEEK 1/2/4/6 (same weekday & time); a
 *  one-off is a single appointment at the chosen slot. */
function buildPlan(service: Service, start: Date) {
  return service.kind === "programme" && service.sessions?.length
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
}

/** The payment state a booking is created in — the one thing that differs
 *  between the manual and the card paths. */
type PaymentInfo = {
  status: "PENDING" | "CONFIRMED";
  paymentStatus: "AWAITING" | "NOTIFIED" | "VERIFIED";
  paymentNotifiedAt?: Date | null;
  paymentVerifiedAt?: Date | null;
  paymentReference?: string | null;
  paymentProvider?: string | null;
};

/**
 * Persist a booking + its appointment(s) + any event brief, then fire the
 * notification e-mails. The single place that writes a public booking, whether
 * it was paid for or sent in as an enquiry.
 *
 * `onClash` decides what happens if the slot was taken while the customer was
 * elsewhere: "reject" (manual — nothing was charged, so bounce it back) or
 * "keep" (a card payment already went through, so the booking must not be lost —
 * persist it anyway and log the collision for a manual reschedule).
 *
 * Returns a friendly result for SLOT_TAKEN; re-throws anything else (e.g. a
 * duplicate paymentReference P2002) so specific callers can handle it.
 */
async function finalizeBooking(
  input: BookingInput,
  payment: PaymentInfo,
  opts: { expect?: "scheduled" | "enquiry"; onClash?: "reject" | "keep" } = {}
): Promise<CreateBookingResult> {
  const { expect = "scheduled", onClash = "reject" } = opts;
  const v = validateBooking(input, expect);
  if (!v.ok) return v;
  const { service, start } = v;

  const plan = buildPlan(service, start);
  const slots = plan.map((p) => p.scheduledAt);

  let bookingId: string;
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
      if (clash) {
        if (onClash === "reject") throw new Error("SLOT_TAKEN");
        // "keep": the customer has already paid, so dropping the booking would
        // lose their money. Persist it and log loudly — the two bookings share
        // the instant on the admin board, where Linda reschedules one.
        console.error(
          `[booking] slot clash kept for a paid booking (ref ${
            payment.paymentReference ?? "?"
          }) at ${slots.map((s) => s.toISOString()).join(", ")}`
        );
      }

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
          flow: service.flow === "assisted" ? "ASSISTED" : "SCHEDULED",
          status: payment.status,
          paymentStatus: payment.paymentStatus,
          mode: input.mode === "physical" ? "PHYSICAL" : "VIRTUAL",
          paymentNotifiedAt: payment.paymentNotifiedAt ?? null,
          paymentVerifiedAt: payment.paymentVerifiedAt ?? null,
          paymentReference: payment.paymentReference ?? null,
          paymentProvider: payment.paymentProvider ?? null,
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
          ...(enquiryComplete(input.enquiry) && {
            enquiry: {
              create: {
                organization: input.enquiry.organization.trim(),
                location: input.enquiry.location.trim(),
                audienceSize: input.enquiry.audienceSize.trim(),
                topic: input.enquiry.topic.trim(),
                duration: input.enquiry.duration.trim(),
              },
            },
          }),
        },
        select: { id: true },
      });
    });

    bookingId = booking.id;
  } catch (e) {
    if (e instanceof Error && e.message === "SLOT_TAKEN") {
      return {
        ok: false,
        error: "One of those time slots was just taken. Please pick another time.",
      };
    }
    // Let specific callers decide (e.g. the Paystack path maps P2002 on the
    // unique paymentReference to "already processed").
    throw e;
  }

  /* Past this line the booking is committed, so nothing below may turn it into
     an error the customer sees — notifyNewBooking already swallows its own
     failures (lib/email.ts) and the catch here is the belt to that braces. It
     is awaited rather than floated so a serverless invocation isn't torn down
     with the request still in flight. */
  await notifyNewBooking({
    bookingId,
    serviceName: service.name,
    price: service.price,
    appointments: plan.map((p) => p.scheduledAt),
    mode: input.mode === "physical" ? "physical" : "virtual",
    paid: payment.paymentStatus === "VERIFIED",
    fullName: input.details.fullName.trim(),
    email: input.details.email.trim(),
    phone: input.details.phone.trim() || null,
    whatsapp: input.details.whatsapp.trim() || null,
    address: input.details.address.trim() || null,
    note: input.details.note.trim() || null,
    enquiry: enquiryComplete(input.enquiry) ? input.enquiry : null,
  }).catch((e) => console.error("notifyNewBooking failed", e));

  return { ok: true, bookingId };
}

/**
 * Manual bank transfer. Writes the booking as PENDING with its payment NOTIFIED
 * (awaiting an admin's bank check), exactly as before.
 */
export async function createScheduledBooking(
  input: BookingInput
): Promise<CreateBookingResult> {
  try {
    return await finalizeBooking(input, {
      status: "PENDING",
      paymentStatus: "NOTIFIED",
      paymentNotifiedAt: new Date(),
      paymentProvider: "manual",
    });
  } catch (e) {
    console.error("createScheduledBooking failed", e);
    return {
      ok: false,
      error: "Something went wrong creating your booking. Please try again.",
    };
  }
}

/**
 * Corporate Wellness / Events Training. Nothing is charged up front, so the
 * booking lands PENDING / AWAITING with its event brief attached; the slot is
 * held exactly like a paid one so nobody gets booked on top of a training.
 */
export async function createEnquiryBooking(
  input: BookingInput
): Promise<CreateBookingResult> {
  try {
    return await finalizeBooking(
      input,
      { status: "PENDING", paymentStatus: "AWAITING" },
      { expect: "enquiry" }
    );
  } catch (e) {
    console.error("createEnquiryBooking failed", e);
    return {
      ok: false,
      error: "Something went wrong sending your enquiry. Please try again.",
    };
  }
}

// ---------------------------------------------------------------------------
// Paystack card flow
// ---------------------------------------------------------------------------

/** The absolute URL Paystack redirects the customer back to after paying.
 *  Derived from the request headers so dev and prod both work; an explicit
 *  APP_URL wins when set (useful behind a proxy that rewrites the host).
 *  We leave off the query string — Paystack appends ?reference=…&trxref=…. */
async function paystackCallbackUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = process.env.APP_URL?.replace(/\/$/, "") ?? `${proto}://${host}`;
  return `${base}/book/payment/callback`;
}

/**
 * Start a card payment. Validates the booking, re-checks the slot is free, then
 * initializes a Paystack transaction whose amount is computed here (never trusted
 * from the browser) and whose metadata carries the whole booking payload. No
 * booking is written yet — that happens in finalizePaystackPayment() once the
 * payment is confirmed. Returns the hosted-checkout URL to redirect to.
 */
export async function startPaystackCheckout(
  input: BookingInput
): Promise<{ ok: true; authorizationUrl: string } | { ok: false; error: string }> {
  // "scheduled" here is load-bearing: an enquiry service has no price to charge.
  const v = validateBooking(input, "scheduled");
  if (!v.ok) return v;
  const { service, start } = v;

  const amountKobo = priceToKobo(service.price);
  if (!amountKobo) {
    return { ok: false, error: "This service can't be paid for by card yet." };
  }

  // Fail fast if the slot is already gone, before sending anyone off to pay.
  const plan = buildPlan(service, start);
  const clash = await prisma.appointment.findFirst({
    where: {
      scheduledAt: { in: plan.map((p) => p.scheduledAt) },
      booking: { status: { notIn: ["DECLINED", "CANCELLED"] } },
    },
    select: { id: true },
  });
  if (clash) {
    return { ok: false, error: "That time was just taken. Please pick another slot." };
  }

  const reference = newReference();
  const init = await initializeTransaction({
    email: input.details.email.trim(),
    amountKobo,
    reference,
    callbackUrl: await paystackCallbackUrl(),
    metadata: {
      booking: {
        serviceSlug: service.slug,
        startISO: input.startISO,
        mode: input.mode === "physical" ? "physical" : "virtual",
        details: {
          fullName: input.details.fullName.trim(),
          phone: input.details.phone.trim(),
          whatsapp: input.details.whatsapp.trim(),
          address: input.details.address.trim(),
          email: input.details.email.trim(),
          note: input.details.note.trim(),
        },
      },
    },
  });

  if (!init.ok) return { ok: false, error: init.error };
  return { ok: true, authorizationUrl: init.authorizationUrl };
}

/** Pull the booking payload back out of a transaction's metadata (Paystack may
 *  hand it back as an object or a JSON string). Returns null if it isn't there
 *  or is malformed. */
function readBookingMetadata(metadata: unknown): BookingInput | null {
  let meta = metadata;
  if (typeof meta === "string") {
    try {
      meta = JSON.parse(meta);
    } catch {
      return null;
    }
  }
  const booking = (meta as { booking?: unknown } | null)?.booking;
  if (!booking || typeof booking !== "object") return null;

  const b = booking as Record<string, unknown>;
  const details = b.details as Record<string, unknown> | undefined;
  if (typeof b.serviceSlug !== "string" || typeof b.startISO !== "string" || !details) {
    return null;
  }

  return {
    serviceSlug: b.serviceSlug,
    startISO: b.startISO,
    mode: b.mode === "physical" ? "physical" : "virtual",
    details: {
      fullName: String(details.fullName ?? ""),
      phone: String(details.phone ?? ""),
      whatsapp: String(details.whatsapp ?? ""),
      address: String(details.address ?? ""),
      email: String(details.email ?? ""),
      note: String(details.note ?? ""),
    },
  };
}

export type FinalizePaymentResult =
  | { ok: true; bookingId: string; alreadyProcessed?: boolean }
  | { ok: false; error: string };

/**
 * Confirm a Paystack payment and write the booking. Called by BOTH the webhook
 * (server-to-server, the source of truth) and the customer's return page, so it
 * is idempotent: a reference maps to at most one booking.
 *
 *   1. Verify the transaction with Paystack (never trust the URL param).
 *   2. If a booking already carries this reference, return it — no double write.
 *   3. Only "success" transactions proceed.
 *   4. Assert the paid amount matches this service's catalogue price.
 *   5. Write the booking as PENDING / VERIFIED (see finalizeBooking).
 */
export async function finalizePaystackPayment(
  reference: string
): Promise<FinalizePaymentResult> {
  if (!reference) return { ok: false, error: "Missing payment reference." };

  const txn = await verifyTransaction(reference);
  if (!txn) {
    return {
      ok: false,
      error:
        "We couldn't confirm this payment. If you were charged, please contact us and we'll sort it out.",
    };
  }

  // Idempotency guard: the webhook and the return page can both land here.
  const existing = await prisma.booking.findUnique({
    where: { paymentReference: reference },
    select: { id: true },
  });
  if (existing) return { ok: true, bookingId: existing.id, alreadyProcessed: true };

  if (txn.status !== "success") {
    return { ok: false, error: "This payment didn't go through." };
  }

  const payload = readBookingMetadata(txn.metadata);
  if (!payload) {
    console.error(`[paystack] transaction ${reference} is missing booking metadata`);
    return {
      ok: false,
      error: "This payment is missing its booking details. Please contact us.",
    };
  }

  // Never trust the amount from anywhere but our own catalogue.
  const service = getService(payload.serviceSlug);
  const expected = service ? priceToKobo(service.price) : null;
  if (!expected || txn.amount !== expected) {
    console.error(
      `[paystack] amount mismatch on ${reference}: paid ${txn.amount}, expected ${expected}`
    );
    return {
      ok: false,
      error: "The amount paid didn't match this service. Please contact us.",
    };
  }

  try {
    return await finalizeBooking(
      payload,
      {
        status: "PENDING",
        paymentStatus: "VERIFIED",
        paymentVerifiedAt: new Date(),
        paymentReference: reference,
        paymentProvider: "paystack",
      },
      { onClash: "keep" }
    );
  } catch (e) {
    // A webhook/return-page race can both pass the guard above and race to
    // insert; the unique paymentReference makes the loser throw P2002. Treat
    // that as already-processed rather than an error.
    if ((e as { code?: string })?.code === "P2002") {
      const row = await prisma.booking.findUnique({
        where: { paymentReference: reference },
        select: { id: true },
      });
      if (row) return { ok: true, bookingId: row.id, alreadyProcessed: true };
    }
    console.error("finalizePaystackPayment failed", e);
    return {
      ok: false,
      error:
        "We received your payment but couldn't record the booking. Please contact us.",
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

/** Day keys (yyyy-MM-dd) in a given month (yyyy-MM) that already have at least
 *  one booked appointment. Used by the admin dialog to flag days with activity. */
export async function getTakenDays(monthStr: string): Promise<string[]> {
  const [y, m] = monthStr.split("-").map(Number);
  if (!y || !m) return [];

  const gte = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
  const lt = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));

  const appts = await prisma.appointment.findMany({
    where: {
      scheduledAt: { gte, lt },
      booking: { status: { notIn: ["DECLINED", "CANCELLED"] } },
    },
    select: { scheduledAt: true },
  });

  const days = new Set<string>();
  for (const a of appts) {
    if (a.scheduledAt) days.add(a.scheduledAt.toISOString().slice(0, 10));
  }
  return [...days];
}

/** Day keys (yyyy-MM-dd) in a given month whose *every* hourly slot is booked,
 *  so the public calendar can disable them. A day with only some slots taken
 *  stays selectable — its free times are still offered. Slot instants are pinned
 *  as UTC wall-clock (see toSlotInstant), so a slot's clock hour is its UTC hour. */
export async function getFullyBookedDays(monthStr: string): Promise<string[]> {
  const [y, m] = monthStr.split("-").map(Number);
  if (!y || !m) return [];

  const gte = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
  const lt = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));

  const appts = await prisma.appointment.findMany({
    where: {
      scheduledAt: { gte, lt },
      booking: { status: { notIn: ["DECLINED", "CANCELLED"] } },
    },
    select: { scheduledAt: true },
  });

  // The clock hours a day must cover to count as full (9…17 for the hourly grid).
  const requiredHours = timeSlots().map((s) => s.date.getHours());

  const hoursByDay = new Map<string, Set<number>>();
  for (const a of appts) {
    if (!a.scheduledAt) continue;
    const key = a.scheduledAt.toISOString().slice(0, 10);
    let set = hoursByDay.get(key);
    if (!set) hoursByDay.set(key, (set = new Set()));
    set.add(a.scheduledAt.getUTCHours());
  }

  const full: string[] = [];
  for (const [key, hours] of hoursByDay) {
    if (requiredHours.every((h) => hours.has(h))) full.push(key);
  }
  return full;
}
