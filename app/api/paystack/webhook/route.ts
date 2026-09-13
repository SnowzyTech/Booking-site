import { finalizePaystackPayment } from "@/lib/booking-actions";
import { verifyWebhookSignature } from "@/lib/paystack";

/*
 * Paystack webhook — the source of truth for a completed payment.
 *
 * Paystack calls this server-to-server after a charge, independent of the
 * customer's browser (which may have closed the tab before the return page
 * loaded). The return page at /book/payment/callback finalizes too; both funnel
 * through finalizePaystackPayment(), which is idempotent, so whichever arrives
 * first wins and the other is a no-op.
 *
 * Uses node:crypto (signature check) and Prisma, so it must run on the Node
 * runtime, not the edge.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // The signature is computed over the exact raw bytes — read text(), not json().
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(raw, signature)) {
    console.error("[paystack] webhook rejected — bad or missing signature");
    return new Response("Invalid signature", { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    const res = await finalizePaystackPayment(event.data.reference);
    if (!res.ok) {
      // Log but still ack with 200: Paystack retries non-2xx, and a retry won't
      // fix a bad-amount/bad-metadata rejection. The return page is a second
      // chance for genuine transients, and failures are visible in the logs.
      console.error(
        `[paystack] webhook could not finalize ${event.data.reference}: ${res.error}`
      );
    }
  }

  // Acknowledge quickly so Paystack marks the event delivered.
  return new Response("ok", { status: 200 });
}
