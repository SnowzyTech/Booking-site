import { WhatsAppChip } from "@/components/booking/whatsapp-block";
import { Button } from "@/components/ui/button";
import { bank } from "@/lib/site";

/* Step 4 — bank transfer + confirmation (MacBook Pro 14_ - 5.png). */
export default function PaymentPage() {
  return (
    <div className="px-[222px] pb-32 pt-[80px]">
      <h1 className="text-[36px] font-bold leading-[1.05] tracking-[-0.01em] text-brand">
        Payment &amp;
        <br />
        Appointment Confirmation
      </h1>

      <div className="mt-8 flex flex-wrap gap-y-10">
        <div className="w-[477px] shrink-0">
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
            <Button variant="solid" size="lg" className="px-9">
              Sent Notification of Payment
            </Button>
          </div>
        </div>

        <div className="ml-[137px] self-start border-l border-[#d9d9d9] pl-[107px]">
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
