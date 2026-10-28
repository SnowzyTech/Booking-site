import type { Metadata } from "next";

import { verifyTransaction } from "@/lib/paystack";
import { SCA_AMOUNT_KOBO, SCA_PRICE_LABEL } from "@/lib/sca";
import { whatsappLink } from "@/lib/site";

import "../sca.css";

/*
 * Where Paystack returns the buyer after the hosted checkout for the Sugar
 * Control Accelerator (see lib/sca-actions.ts). Paystack appends
 * ?reference=…&trxref=…. We re-verify with Paystack (never trust the query
 * param), but — unlike the booking callback — we write NOTHING: an SCA purchase
 * is not a booking. The page just confirms the payment and points the buyer at
 * WhatsApp to get started.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment confirmation",
  robots: { index: false, follow: false },
};

export default async function ScaThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const { reference, trxref } = await searchParams;
  const ref = reference ?? trxref;

  const txn = ref ? await verifyTransaction(ref) : null;
  const paid = Boolean(
    txn && txn.status === "success" && txn.amount === SCA_AMOUNT_KOBO
  );

  const waHref = whatsappLink(
    paid
      ? `Hello, I've just paid ${SCA_PRICE_LABEL} for the Sugar Control Accelerator${
          ref ? ` (ref ${ref})` : ""
        }. I'd like to get started.`
      : `Hello, I tried to pay for the Sugar Control Accelerator${
          ref ? ` (ref ${ref})` : ""
        } and need some help.`
  );

  return (
    <main className="sca-ty">
      <div className="sca-ty-card">
        {paid ? (
          <>
            <h1 className="sca-ty-title">Payment received 🎉</h1>
            <p className="sca-ty-text">
              Thank you — your payment for the Sugar Control Accelerator came
              through. Tap below to message us on WhatsApp and we’ll get you
              started right away.
            </p>
            {ref && <p className="sca-ty-ref">Reference: {ref}</p>}
            <a className="sca-wa" href={waHref} target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp to begin
            </a>
          </>
        ) : (
          <>
            <h1 className="sca-ty-title">We couldn’t confirm your payment</h1>
            <p className="sca-ty-text">
              If you were charged, don’t worry — message us on WhatsApp with your
              details and we’ll sort it out straight away.
            </p>
            {ref && <p className="sca-ty-ref">Reference: {ref}</p>}
            <a className="sca-wa" href={waHref} target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp
            </a>
            <a className="sca-ty-back" href="/sca">
              ← Back to the Sugar Control Accelerator
            </a>
          </>
        )}
      </div>
    </main>
  );
}
