import { ServiceCard } from "@/components/booking/service-card";
import { WhatsAppHelp } from "@/components/booking/whatsapp-block";
import { services } from "@/lib/services";

/* Step 1 — service picker. Two-column grid, with the WhatsApp help block
   occupying the final cell (MacBook Pro 14_ - 2.png). */
export default function ChooseServicePage() {
  return (
    <div className="px-[144px] pb-32 pt-[130px]">
      <div className="grid grid-cols-1 gap-x-[114px] gap-y-[95px] lg:grid-cols-2">
        {services.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
        <div className="flex items-center">
          <WhatsAppHelp />
        </div>
      </div>
    </div>
  );
}
