"use server";

import { headers } from "next/headers";

import { initializeTransaction, newReference } from "@/lib/paystack";
import { SCA_AMOUNT_KOBO } from "@/lib/sca";

/*
 * Sugar Control Accelerator (/sca) — card payment.
 *
 * The SCA sales page is deliberately standalone: it is NOT a booking. Nothing is
 * written to the database and nothing reaches the admin dashboard. This action
 * only starts a Paystack transaction for the flat programme price and hands back
 * the hosted-checkout URL; the buyer is then sent to /sca/thank-you, which just
 * verifies the payment with Paystack and points them at WhatsApp.
 *
 * The transaction is tagged `metadata.sca = true` so the shared Paystack webhook
 * (lib/booking-actions.ts) can tell these apart from real bookings and ignore
 * them instead of trying to finalize a booking that was never created.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Absolute URL Paystack redirects the buyer back to after paying. Derived from
 *  the request headers so dev and prod both work; an explicit APP_URL wins when
 *  set. Mirrors paystackCallbackUrl() in lib/booking-actions.ts, but returns to
 *  /sca/thank-you instead of the booking callback. */
async function scaCallbackUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = process.env.APP_URL?.replace(/\/$/, "") ?? `${proto}://${host}`;
  return `${base}/sca/thank-you`;
}

export async function startScaPaystack(
  email: string
): Promise<{ ok: true; authorizationUrl: string } | { ok: false; error: string }> {
  const clean = email.trim();
  if (!EMAIL_RE.test(clean)) {
    return { ok: false, error: "Please enter a valid e-mail address." };
  }

  const init = await initializeTransaction({
    email: clean,
    amountKobo: SCA_AMOUNT_KOBO,
    reference: newReference(),
    callbackUrl: await scaCallbackUrl(),
    metadata: { sca: true },
  });

  if (!init.ok) return { ok: false, error: init.error };
  return { ok: true, authorizationUrl: init.authorizationUrl };
}
