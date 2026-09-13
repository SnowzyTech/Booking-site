import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ContactChannels } from "@/components/sections/contact-channels";
import { ContactForm } from "@/components/sections/contact-form";
import { contactCopy } from "@/lib/site";

/*
 * The two bands of /contact. They live here rather than in the route file for
 * the same reason the landing sections do: `app/(public)/*` stays a thin shell
 * that composes sections, and all the styling sits under components/.
 *
 * <SiteHeader> is absolutely positioned over the top of the page, so the intro
 * band wears the hero wash and enough top padding to clear it.
 */
export function ContactIntro() {
  return (
    <section className="bg-wash-hero pb-[70px] pt-[132px]">
      <Reveal className="mx-auto max-w-[1100px] px-6 text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-ink">
          {contactCopy.pageEyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-[760px] text-[33px] font-medium leading-[1.12] tracking-[-0.02em] text-[#1d1620] sm:text-[41px]">
          {contactCopy.pageTitle}
        </h1>
        <p className="mx-auto mt-5 max-w-[620px] text-[14.5px] leading-[1.7] text-[#3d3d3d]">
          {contactCopy.pageIntro}
        </p>
      </Reveal>
    </section>
  );
}

export function ContactBody() {
  return (
    <section className="bg-white py-[60px]">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-8 px-6 lg:grid-cols-[0.85fr_1fr] lg:gap-10">
        <ContactChannels />
        <Reveal delay={80}>
          <ContactForm />
        </Reveal>
      </div>

      <div className="mx-auto mt-12 max-w-[1100px] px-6">
        {/* Plain anchor so the hash is honoured — see site-header.tsx. The
            document navigation is the point here, hence the rule waiver. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/#contacts"
          className="inline-flex items-center gap-2 text-[12.5px] text-[#4a4a4a] transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} />
          Back to the home page
        </a>
      </div>
    </section>
  );
}
