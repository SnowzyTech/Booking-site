import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ContactChannels } from "@/components/sections/contact-channels";
import { Button } from "@/components/ui/button";
import { contactCopy, whatsappLink } from "@/lib/site";

/*
 * Contact band, between the FAQ and the footer.
 *
 * The Figma export stops at the footer, so there is no frame for this one — it
 * borrows the geometry of the other bands: the 1100px column of <Services> /
 * <Faq>, the centred two-tone heading of <BetterHealth>, and the lavender wash
 * that separates the two white sections around it.
 *
 * The form itself lives on /contact; this band carries the reachable details
 * and hands off to that page, so the landing page stays a single scroll.
 */
export function Contact() {
  return (
    <section id="contacts" className="bg-wash-lavender py-[70px]">
      <div className="mx-auto max-w-[1100px] px-6">
        <Reveal className="text-center">
          <h2 className="text-[30px] font-bold tracking-[-0.01em]">
            <span className="text-[#4a1063]">{contactCopy.headingLead}</span>
            <span className="text-brand-ink">{contactCopy.headingAccent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[760px] text-[16.5px] leading-[1.7] text-[#1d1620]">
            {contactCopy.intro}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.85fr_1fr] lg:gap-10">
          <ContactChannels />

          <Reveal
            delay={80}
            className="rounded-2xl border border-[#f0e4f7] bg-white p-6 shadow-[0_2px_16px_rgba(80,40,100,0.05)] sm:p-8"
          >
            <h3 className="text-[21px] font-extrabold text-[#111]">
              {contactCopy.teaserTitle}
            </h3>
            <p className="mt-3 text-[15.5px] leading-[1.65] text-[#1d1620]">
              {contactCopy.teaserBody}
            </p>

            <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button asChild variant="pill" size="lg" className="sm:px-7">
                <Link href="/contact">
                  {contactCopy.teaserCta}
                  <ArrowRight className="ml-2.5 size-4" strokeWidth={2} />
                </Link>
              </Button>
              <Button asChild variant="soft" size="lg">
                <a href={whatsappLink()} target="_blank" rel="noreferrer">
                  Chat on WhatsApp
                </a>
              </Button>
            </div>

            <p className="mt-5 text-[13.5px] leading-[1.6] text-[#4a4a4a]">
              Prefer to get straight to a date?{" "}
              <Link
                href="/book"
                className="font-semibold text-brand-ink underline"
              >
                Book a service
              </Link>{" "}
              and pick your slot in the booking wizard.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
