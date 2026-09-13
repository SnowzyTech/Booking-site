/*
 * Paystack, over its REST API.
 *
 * Same shape as lib/email.ts: no SDK, one fetch per call, the secret key read
 * from the environment. Server-only — the secret key must never reach the
 * browser, so nothing here is exported to a client component.
 *
 * This is the redirect (hosted-checkout) flow: we talk to Paystack
 * server-to-server with the SECRET key, and the customer is sent to Paystack's
 * own page to pay. The NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is only needed by the
 * inline/popup widget, which this flow doesn't use.
 *
 * Env (.env):
 *   PAYSTACK_SECRET_KEY   from the Paystack dashboard (sk_test_… / sk_live_…)
 */

import crypto from "node:crypto";

const BASE = "https://api.paystack.co";

function config() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();
  return { secretKey };
}

/** A fresh, unique transaction reference. Paystack allows only alphanumerics
 *  and - . = , so a hyphen-joined UUID is safe. */
export function newReference(): string {
  return `nutri-${crypto.randomUUID()}`;
}

export type PaystackInitResult =
  | { ok: true; authorizationUrl: string; reference: string }
  | { ok: false; error: string };

/**
 * Create a transaction and return the hosted-checkout URL to redirect the
 * customer to. The amount is in kobo (see priceToKobo in lib/services.ts) and is
 * decided here on the server — never taken from the browser.
 */
export async function initializeTransaction(input: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<PaystackInitResult> {
  const { secretKey } = config();
  if (!secretKey) {
    console.error("[paystack] PAYSTACK_SECRET_KEY is not set — cannot initialize.");
    return { ok: false, error: "Card payment isn't set up yet." };
  }

  try {
    const res = await fetch(`${BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: input.amountKobo,
        reference: input.reference,
        callback_url: input.callbackUrl,
        currency: "NGN",
        metadata: input.metadata,
      }),
    });

    const body = (await res.json().catch(() => null)) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; reference?: string };
    } | null;

    if (!res.ok || !body?.status || !body.data?.authorization_url) {
      console.error(
        `[paystack] initialize failed (${res.status})`,
        body?.message ?? ""
      );
      return { ok: false, error: "Could not start the card payment. Please try again." };
    }

    return {
      ok: true,
      authorizationUrl: body.data.authorization_url,
      reference: body.data.reference ?? input.reference,
    };
  } catch (e) {
    console.error("[paystack] initialize threw", e);
    return {
      ok: false,
      error: "Could not reach the payment provider. Please try again.",
    };
  }
}

/** The subset of a Paystack transaction we rely on. `status` is "success",
 *  "failed", "abandoned", … and `amount` is in kobo. */
export type PaystackTransaction = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  metadata: unknown;
  customer?: { email?: string | null };
};

/**
 * Ask Paystack for the authoritative state of a transaction. Returns null on any
 * failure (bad key, network, unknown reference) so callers treat "couldn't
 * confirm" the same as "not paid" and never finalize a booking on a guess.
 */
export async function verifyTransaction(
  reference: string
): Promise<PaystackTransaction | null> {
  const { secretKey } = config();
  if (!secretKey) {
    console.error("[paystack] PAYSTACK_SECRET_KEY is not set — cannot verify.");
    return null;
  }
  if (!reference) return null;

  try {
    const res = await fetch(
      `${BASE}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${secretKey}` },
        // A payment check must never be served from a cache.
        cache: "no-store",
      }
    );

    const body = (await res.json().catch(() => null)) as {
      status?: boolean;
      data?: PaystackTransaction;
    } | null;

    if (!res.ok || !body?.status || !body.data) {
      console.error(`[paystack] verify failed (${res.status}) for ${reference}`);
      return null;
    }
    return body.data;
  } catch (e) {
    console.error("[paystack] verify threw", e);
    return null;
  }
}

/**
 * Whether a webhook POST really came from Paystack. Paystack signs the raw
 * request body with HMAC-SHA512 keyed by your secret key and sends the hex
 * digest in the `x-paystack-signature` header. We recompute the digest over the
 * exact bytes we received and compare: a forged POST can't produce a valid
 * signature without the secret key. The compare is constant-time so we don't
 * leak how much of a guessed signature was correct via timing.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null
): boolean {
  const { secretKey } = config();
  if (!secretKey || !signature) return false;

  const expected = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
