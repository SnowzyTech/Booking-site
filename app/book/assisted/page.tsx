import { WhatsAppChip } from "@/components/booking/whatsapp-block";

/*
 * Assisted flow, step 2 (MacBook Pro 14_ - 8.png).
 *
 * Corporate Wellness and Events Training do not go through the calendar or the
 * bank-transfer step — they hand off to the Executive Assistant on WhatsApp.
 * The stepper still renders four dots; only 1 and 2 are ever reached.
 */
export default function AssistedPage() {
  return (
    <div className="px-[220px] pb-32 pt-[155px]">
      <h1 className="text-[36px] font-bold leading-[1.05] tracking-[-0.01em] text-brand">
        Payment &amp;
        <br />
        Appointment Confirmation
      </h1>

      <p className="mt-6 max-w-[480px] text-[14px] leading-[1.5] text-[#111]">
        Contact the Executive Assistant via the WhatsApp number below to arrange
        your appointment date and other necessary details.
      </p>

      <div className="mt-8">
        <WhatsAppChip className="px-6 py-3.5 text-[19px]" />
      </div>
    </div>
  );
}
