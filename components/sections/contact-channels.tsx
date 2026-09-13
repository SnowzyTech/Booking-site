import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { WhatsApp, socialAccounts } from "@/components/icons/social";
import { Reveal } from "@/components/motion/reveal";
import { businessHours, contact, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * The reachable contact details, shared by the landing band (<Contact>) and the
 * /contact page. Same four values the footer's Contacts column lists, but as
 * tap targets — mailto / tel / wa.me / Maps — instead of plain text.
 */
const channels = [
  {
    Icon: Mail,
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
  },
  {
    Icon: Phone,
    label: "Phone",
    value: contact.phone,
    href: `tel:${contact.phone.replace(/\s/g, "")}`,
  },
  {
    Icon: WhatsApp,
    label: "WhatsApp",
    value: contact.whatsapp,
    href: whatsappLink(),
    external: true,
  },
  {
    Icon: MapPin,
    label: "Office",
    value: contact.address,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      contact.address
    )}`,
    external: true,
  },
];

const card =
  "rounded-xl border border-[#f0e4f7] bg-white p-4 flex items-start gap-3.5";

export function ContactChannels({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Reveal
        stagger
        as="ul"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1"
      >
        {channels.map(({ Icon, label, value, href, external }) => (
          <li key={label}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className={cn(
                card,
                "h-full transition-[border-color,box-shadow] duration-[var(--dur-fast)] ease-quart hover:border-brand/40 hover:shadow-[0_2px_12px_rgba(80,40,100,0.07)]"
              )}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f7ecff] text-brand">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-extrabold uppercase tracking-[0.08em] text-brand-ink">
                  {label}
                </span>
                <span className="mt-1 block break-words text-[15px] leading-[1.55] text-[#1d1620]">
                  {value}
                </span>
              </span>
            </a>
          </li>
        ))}
      </Reveal>

      <Reveal delay={120} className={cn(card, "mt-3")}>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f7ecff] text-brand">
          <Clock className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-brand-ink">
            Business Hours
          </p>
          <p className="mt-1 text-[15px] leading-[1.55] text-[#1d1620]">
            {businessHours.hours}
          </p>
          <p className="mt-1.5 text-[13px] leading-[1.55] text-[#4a4a4a]">
            {businessHours.note}
          </p>
        </div>
      </Reveal>

      <Reveal delay={160} className="mt-6 px-1">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-brand-ink">
          Follow Linda
        </p>
        {/* Same -m-1/p-1 trick as the footer: a 23px tap target without
            pushing the icons apart. */}
        <div className="mt-3 flex items-center gap-3">
          {socialAccounts.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
              className="-m-1 p-1 text-[#6c1e9a] transition-opacity hover:opacity-60"
            >
              <Icon className="size-[17px]" />
            </a>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
