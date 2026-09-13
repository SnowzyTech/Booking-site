import Image from "next/image";

import { socialAccounts } from "@/components/icons/social";
import { Reveal } from "@/components/motion/reveal";
import { businessHours, contact, footerColumns } from "@/lib/site";

/* The #contacts anchor now lands on <Contact>, the band above this one; this
   column stays as the at-a-glance copy of the same details. */
export function SiteFooter() {
  return (
    <footer className="bg-footer text-white">
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
            <span className="text-[14px] font-semibold leading-tight">
              Linda Chikaodi
              <br />
              Austin
            </span>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[14px] font-extrabold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label} className="text-[14px] text-[#e4dfe8]">
                    {l.href ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-opacity hover:text-white hover:opacity-70"
                      >
                        {l.label}
                      </a>
                    ) : (
                      l.label
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-[14px] font-extrabold">Contacts</h3>
            <ul className="mt-4 space-y-3 break-words text-[14px] text-[#e4dfe8]">
              <li>Email: {contact.email}</li>
              <li>Phone: {contact.phone}</li>
              <li>Address: {contact.address}</li>
            </ul>
            {/* -m-1/p-1 grows the tap target to 23px without moving the
                icons apart — the row keeps the mockup's 10px spacing. */}
            <div className="mt-4 flex items-center gap-2.5">
              {socialAccounts.map(({ Icon, label, href }) => (
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
            <h3 className="text-[14px] font-extrabold">Business Hours</h3>
            <p className="mt-4 text-[14px] text-[#e4dfe8]">
              {businessHours.hours}
            </p>
            <p className="mt-3 max-w-[260px] text-[11.5px] leading-[1.55] text-[#cfc9d2] lg:max-w-[170px]">
              {businessHours.note}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13.5px] text-[#a99fb0] lg:mt-16">
          <span>Linda Chikaodi Austin 2026</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
