import Image from "next/image";
import {
  Facebook,
  Instagram,
  LinkedIn,
  TikTok,
  WhatsApp,
  XMark,
} from "@/components/icons/social";

import { businessHours, contact, footerColumns } from "@/lib/site";

const socials = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook, label: "Facebook" },
  { Icon: TikTok, label: "TikTok" },
  { Icon: LinkedIn, label: "LinkedIn" },
  { Icon: XMark, label: "X" },
  { Icon: WhatsApp, label: "WhatsApp" },
];

export function SiteFooter() {
  return (
    <footer id="contacts" className="bg-footer text-white">
      <div className="mx-auto max-w-[1400px] px-[100px] pb-6 pt-11">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-[1.5fr_1fr_1.3fr_1.6fr_1fr]">
          <div className="flex items-start gap-3">
            <span className="relative size-9 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/images/linda-avatar.jpg"
                alt="Linda Chikaodi Austin"
                fill
                sizes="36px"
                className="object-cover"
              />
            </span>
            <span className="text-[13px] font-medium leading-tight">
              Linda Chikaodi
              <br />
              Austin
            </span>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-bold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l} className="text-[12.5px] text-[#cfc9d2]">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-[12px] font-bold">Contacts</h3>
            <ul className="mt-4 space-y-3 text-[12.5px] text-[#cfc9d2]">
              <li>Email: {contact.email}</li>
              <li>Phone: {contact.phone}</li>
              <li>Address: {contact.address}</li>
            </ul>
            <div className="mt-4 flex items-center gap-2.5">
              {socials.map(({ Icon, label }) => (
                <span key={label} aria-label={label} title={label}>
                  <Icon className="size-[15px]" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-bold">Business Hours</h3>
            <p className="mt-4 text-[12.5px] text-[#cfc9d2]">
              {businessHours.hours}
            </p>
            <p className="mt-3 max-w-[150px] text-[9.5px] leading-[1.5] text-[#cfc9d2]">
              {businessHours.note}
            </p>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between text-[12.5px] text-[#8d8593]">
          <span>Linda Chikaodi Austin 2026</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
