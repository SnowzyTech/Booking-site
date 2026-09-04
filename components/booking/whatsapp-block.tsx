import { WhatsApp } from "@/components/icons/social";
import { contact } from "@/lib/site";
import { cn } from "@/lib/utils";

export function WhatsAppChip({ className }: { className?: string }) {
  return (
    <a
      href={`https://wa.me/234${contact.whatsapp.replace(/^0/, "")}`}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex items-center gap-2.5 rounded bg-[#f0f0f0] px-4 py-2.5 text-[15px] font-semibold text-[#111]",
        className
      )}
    >
      <WhatsApp className="size-5 text-[#25D366]" />
      {contact.whatsapp}
    </a>
  );
}

export function WhatsAppHelp() {
  return (
    <div className="max-w-[420px]">
      <p className="text-[14px] font-bold text-[#111]">
        Need help before making payment?
      </p>
      <p className="mt-1 text-[14px] leading-[1.55] text-[#111]">
        You can message us on WhatsApp for any questions or clarification before
        proceeding with payment.
      </p>
      <WhatsAppChip className="mt-5" />
    </div>
  );
}
