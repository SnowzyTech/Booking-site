import Image from "next/image";
import {
  Facebook,
  Instagram,
  LinkedIn,
  TikTok,
  WhatsApp,
  XMark,
} from "@/components/icons/social";

import { Reveal } from "@/components/motion/reveal";
import { businessHours, contact, footerColumns, socialLinks } from "@/lib/site";

/* WhatsApp has no profile URL of its own — it reuses the wa.me deep link the
   booking flow already builds from `contact.whatsapp`. */
const socials = [
  { Icon: Instagram, label: "Instagram", href: socialLinks.instagram },
  { Icon: Facebook, label: "Facebook", href: socialLinks.facebook },
  { Icon: TikTok, label: "TikTok", href: socialLinks.tiktok },
  { Icon: LinkedIn, label: "LinkedIn", href: socialLinks.linkedin },
  { Icon: XMark, label: "X", href: socialLinks.x },
  {
    Icon: WhatsApp,
    label: "WhatsApp",
    href: `https://wa.me/234${contact.whatsapp.replace(/^0/, "")}`,
  },
];

export function SiteFooter() {
  return (
    <footer id="contacts" className="bg-footer text-white">
      <div className="mx-auto max-w-[1400px] px-6 pb-6 pt-11 md:px-10 xl:px-[100px]">
        <Reveal className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.5fr_1fr_1.3fr_1.6fr_1fr]">
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
            <ul className="mt-4 space-y-3 break-words text-[12.5px] text-[#cfc9d2]">
              <li>Email: {contact.email}</li>
              <li>Phone: {contact.phone}</li>
              <li>Address: {contact.address}</li>
            </ul>
            {/* -m-1/p-1 grows the tap target to 23px without moving the
                icons apart — the row keeps the mockup's 10px spacing. */}
            <div className="mt-4 flex items-center gap-2.5">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="-m-1 p-1 transition-opacity hover:opacity-70"
                >
                  <Icon className="size-[15px]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-bold">Business Hours</h3>
            <p className="mt-4 text-[12.5px] text-[#cfc9d2]">
              {businessHours.hours}
            </p>
            <p className="mt-3 max-w-[260px] text-[9.5px] leading-[1.5] text-[#cfc9d2] lg:max-w-[150px]">
              {businessHours.note}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[12.5px] text-[#8d8593] lg:mt-16">
          <span>Linda Chikaodi Austin 2026</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
