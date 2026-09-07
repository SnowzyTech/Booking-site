import { PaymentActions } from "@/components/booking/payment-actions";
import { WhatsAppChip } from "@/components/booking/whatsapp-block";
import { bank } from "@/lib/site";

/* Step 4 — bank transfer + confirmation (MacBook Pro 14_ - 5.png). */
export default function PaymentPage() {
  return (
    <div className="px-6 pb-32 pt-14 md:px-12 lg:pt-[80px] xl:px-[222px]">
      <h1 className="text-[26px] font-bold leading-[1.05] tracking-[-0.01em] text-brand sm:text-[30px] lg:text-[36px]">
        Payment &amp;
        <br />
        Appointment Confirmation
      </h1>

      <div className="mt-8 flex flex-wrap gap-y-10">
        <div className="w-full shrink-0 xl:w-[477px]">
          <p className="text-[14px] leading-[1.5] text-[#111]">
            After making payment to the account provided, send your payment
            receipt to our WhatsApp number to confirm your appointment.
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

          <p className="mt-6 text-[14px] font-bold text-[#111]">
            Need help before making payment?
          </p>
          <p className="mt-1 text-[14px] leading-[1.55] text-[#111]">
            You can message us on WhatsApp for any questions or clarification
            before proceeding with payment.
          </p>

          <div className="mt-5">
            <WhatsAppChip />
          </div>

          <div className="mt-11">
            <PaymentActions />
          </div>
        </div>

        <div className="w-full self-start xl:ml-[137px] xl:w-auto xl:border-l xl:border-[#d9d9d9] xl:pl-[107px]">
          <dl className="space-y-7">
            <div>
              <dt className="text-[13px] text-[#4a4a4a]">Account Number</dt>
              <dd className="mt-0.5 text-[22px] font-medium text-[#111]">
                {bank.accountNumber}
              </dd>
            </div>
            <div>
              <dt className="text-[13px] text-[#4a4a4a]">Account Name</dt>
              <dd className="mt-0.5 text-[22px] font-medium text-[#111]">
                {bank.accountName}
              </dd>
            </div>
            <div>
              <dt className="text-[13px] text-[#4a4a4a]">Bank</dt>
              <dd className="mt-0.5 text-[22px] font-medium text-[#111]">
                {bank.bank}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
