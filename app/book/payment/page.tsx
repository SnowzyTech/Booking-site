import { PaymentActions } from "@/components/booking/payment-actions";
import { WhatsAppChip } from "@/components/booking/whatsapp-block";

/*
 * Step 4 — payment + confirmation (MacBook Pro 14_ - 5.png).
 *
 * The mockup printed the bank details in a column beside the copy. They now sit
 * behind "Manually Pay" in <PaymentActions> instead: the customer first picks
 * how they want to pay, so someone paying by card is never shown an account
 * number they don't need.
 */
export default function PaymentPage() {
  return (
    <div className="px-6 pb-32 pt-14 md:px-12 lg:pt-[80px] xl:px-[222px]">
      <h1 className="text-[26px] font-bold leading-[1.05] tracking-[-0.01em] text-brand sm:text-[30px] lg:text-[36px]">
        Payment &amp;
        <br />
        Appointment Confirmation
      </h1>

      <div className="mt-8 max-w-[560px]">
        <p className="text-[14px] leading-[1.5] text-[#111]">
          Choose how you would like to pay. If you pay by bank transfer, confirm
          it on the next screen so we can verify your payment.
        </p>

        <p className="mt-6 pl-5 text-[14px] font-bold text-[#111]">
          Once your payment is verified:
        </p>
        <ul className="mt-2 space-y-4 pl-9">
          <li className="list-disc text-[14px] leading-[1.5] text-[#111]">
            Your appointment will be scheduled and reflected on your account
            page.
          </li>
          <li className="list-disc text-[14px] leading-[1.5] text-[#111]">
            A confirmation email will be sent to your provided email address.
          </li>
        </ul>

        <div className="mt-10">
          <PaymentActions />
        </div>

        <hr className="mt-10 border-[#e0d3e8]" />

        <p className="mt-8 text-[14px] font-bold text-[#111]">
          Need help before making payment?
        </p>
        <p className="mt-1 text-[14px] leading-[1.55] text-[#111]">
          You can message us on WhatsApp for any questions or clarification
          before proceeding with payment.
        </p>

        <div className="mt-5">
          <WhatsAppChip />
        </div>
      </div>
    </div>
  );
}
