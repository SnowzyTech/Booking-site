import Link from "next/link";

import { IntakeFormPrompt } from "@/components/booking/intake-form-prompt";
import { WhatsAppChip } from "@/components/booking/whatsapp-block";
import { Button } from "@/components/ui/button";
import { finalizePaystackPayment } from "@/lib/booking-actions";

/*
 * Where Paystack redirects the customer after the hosted checkout. Paystack
 * appends ?reference=…&trxref=… to the callback URL. We re-verify with Paystack
 * (never trust the query param) and write the booking here too — the same
 * idempotent finalize the webhook calls — so the customer sees a confirmed
 * result even if the webhook hasn't landed yet.
 */
export const dynamic = "force-dynamic";

export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const { reference, trxref } = await searchParams;
  const ref = reference ?? trxref;

  const result = ref
    ? await finalizePaystackPayment(ref)
    : ({ ok: false, error: "No payment reference was provided." } as const);

  return (
    <div className="px-6 pb-32 pt-14 md:px-12 lg:pt-[80px] xl:px-[222px]">
      <h1 className="text-[34px] font-bold leading-[1.05] tracking-[-0.01em] text-brand sm:text-[40px] lg:text-[46px]">
        Payment &amp;
        <br />
        Appointment Confirmation
      </h1>

      <div className="mt-8 max-w-[680px]">
        {result.ok ? (
          <div className="max-w-[560px] animate-in rounded-lg bg-white/70 px-6 py-5 duration-500 ease-soft fade-in-0 fill-mode-both slide-in-from-bottom-2">
            <p className="text-[21px] font-bold text-[#111]">
              Thank you — your payment was received.
            </p>
            <p className="mt-1 text-[20px] leading-[1.5] text-[#111]">
              Linda&rsquo;s team will confirm your appointment shortly and reach
              out to you. A confirmation e-mail is on its way to your inbox.
            </p>
            <IntakeFormPrompt serviceSlug={result.serviceSlug} />
          </div>
        ) : (
          <div className="max-w-[560px] rounded-lg bg-white/70 px-6 py-5">
            <p className="text-[21px] font-bold text-[#111]">
              We couldn&rsquo;t confirm your payment.
            </p>
            <p className="mt-1 text-[20px] leading-[1.5] text-[#111]">
              {result.error}
            </p>
            <div className="mt-5">
              <Button asChild variant="solid" size="lg" className="h-[60px] text-[20px] font-bold">
                <Link href="/book/payment">Back to payment</Link>
              </Button>
            </div>
          </div>
        )}

        <hr className="mt-10 border-[#e0d3e8]" />

        <p className="mt-8 text-[20px] font-bold text-[#111]">Need help?</p>
        <p className="mt-1 text-[20px] leading-[1.55] text-[#111]">
          Message us on WhatsApp if you have any questions about your payment or
          your appointment.
        </p>

        <div className="mt-5">
          <WhatsAppChip />
        </div>
      </div>
    </div>
  );
}
