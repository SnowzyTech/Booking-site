import { Button } from "@/components/ui/button";
import { needsIntakeForm } from "@/lib/services";
import { intakeFormUrl } from "@/lib/site";

/*
 * The "one last step" block on a payment confirmation: the hand-off to the
 * health & nutrition intake Google Form. Shared by both ways of paying — the
 * Paystack return page (/book/payment/callback) and the manual bank-transfer
 * confirmation in <PaymentActions> — so the two screens stay identical.
 *
 * Renders nothing for the services the form doesn't apply to (Corporate /
 * Events — see needsIntakeForm).
 */
export function IntakeFormPrompt({ serviceSlug }: { serviceSlug: string }) {
  if (!needsIntakeForm(serviceSlug)) return null;

  return (
    <div className="mt-4">
      <p className="text-[20px] leading-[1.5] text-[#111]">
        One last step: please complete this short pre-assessment form. Your
        answers let Linda&rsquo;s team create a plan perfectly suited to you.
      </p>
      {/* The label is long; at this size it has to be free to wrap on a phone. */}
      <Button
        asChild
        variant="solid"
        size="lg"
        className="mt-3 h-auto min-h-[60px] whitespace-normal py-3 text-center text-[20px] font-bold"
      >
        <a href={intakeFormUrl} target="_blank" rel="noopener noreferrer">
          Complete the pre-assessment
        </a>
      </Button>
    </div>
  );
}
