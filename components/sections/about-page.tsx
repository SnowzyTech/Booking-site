import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import {
  aboutBelief,
  aboutClosing,
  aboutPageCopy,
  aboutStory,
} from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * The bands of /about — Linda's full story, told in chapters. The landing
 * page's <About> carries a two-paragraph summary and links here.
 *
 * There is no Figma frame for this page, so it borrows the house geometry: the
 * hero-wash intro of /contact, the alternating image / text rows of <Services>,
 * and the lavender wash for the closing band. Type runs at the landing page's
 * enlarged sizes — most visitors are older readers.
 *
 * <SiteHeader> is fixed over the top of the page, so the intro
 * band wears enough top padding to clear it.
 */
export function StoryIntro() {
  return (
    <section className="bg-wash-hero pb-[70px] pt-[132px]">
      <Reveal className="mx-auto max-w-[1100px] px-6 text-center">
        <p className="text-[18px] font-extrabold uppercase tracking-[0.14em] text-brand-ink">
          {aboutPageCopy.eyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-[900px] text-[40px] font-bold leading-[1.12] tracking-[-0.02em] text-[#1d1620] sm:text-[54px]">
          {aboutPageCopy.title}
        </h1>
        <p className="mx-auto mt-5 max-w-[760px] text-[24px] leading-[1.6] text-[#1d1620]">
          {aboutPageCopy.intro}
        </p>
      </Reveal>
    </section>
  );
}

export function StoryChapters() {
  return (
    <section className="bg-white py-[70px]">
      <div className="mx-auto max-w-[1100px] px-6">
        {aboutStory.map((chapter, i) => {
          const imageRight = i % 2 === 1;
          return (
            <Reveal
              key={chapter.title}
              className={cn(
                i > 0 && "mt-[64px] border-t border-[#e6e6e6] pt-[64px]"
              )}
            >
              <p className="text-[18px] font-extrabold tracking-[0.14em] text-[#b06fd6]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 text-[36px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#5b0f8b] sm:text-[40px]">
                {chapter.title}
              </h2>

              <div
                className={cn(
                  "mt-8 grid grid-cols-1 items-start gap-x-[64px] gap-y-8",
                  chapter.image && "lg:grid-cols-2"
                )}
              >
                {chapter.image && (
                  <div
                    className={cn(
                      "relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#d9d9d9]",
                      imageRight && "lg:order-2"
                    )}
                  >
                    <Image
                      src={chapter.image.src}
                      alt={chapter.image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 520px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div
                  className={cn(
                    "space-y-5",
                    chapter.image ? imageRight && "lg:order-1" : "max-w-[860px]"
                  )}
                >
                  {chapter.stat && (
                    <div className="rounded-xl bg-[#f7ecff] px-6 py-5">
                      <p className="text-[52px] font-extrabold leading-none text-[#5b0f8b]">
                        {chapter.stat.value}
                      </p>
                      <p className="mt-2 text-[21px] leading-[1.5] text-[#1d1620]">
                        {chapter.stat.label}
                      </p>
                    </div>
                  )}
                  {chapter.paragraphs.map((p) => (
                    <p
                      key={p.slice(0, 40)}
                      className="text-[23px] leading-[1.7] text-[#1d1620]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function StoryClosing() {
  return (
    <section className="bg-wash-lavender py-[70px]">
      <div className="mx-auto max-w-[900px] px-6 text-center">
        <Reveal>
          <p className="text-[23px] leading-[1.6] text-[#1d1620]">
            {aboutBelief.lead}
          </p>
          <blockquote className="mt-5 text-[30px] font-bold leading-[1.35] tracking-[-0.01em] text-[#4a1063] sm:text-[36px]">
            &ldquo;{aboutBelief.quote}&rdquo;
          </blockquote>
          <p className="mt-6 text-[24px] font-extrabold leading-[1.5] text-brand-ink">
            {aboutBelief.tagline}
          </p>
        </Reveal>

        <Reveal
          delay={80}
          className="mt-12 rounded-2xl border border-[#f0e4f7] bg-white p-6 shadow-[0_2px_16px_rgba(80,40,100,0.05)] sm:p-9"
        >
          <p className="text-[23px] font-extrabold leading-[1.6] text-[#111]">
            {aboutClosing}
          </p>
          <Button
            asChild
            variant="pill"
            size="lg"
            className="mt-7 h-[60px] px-9 text-[20px] hover:bg-brand"
          >
            <Link href="/book">
              Explore Services
              <ArrowRight className="ml-2.5 size-5" strokeWidth={2} />
            </Link>
          </Button>
        </Reveal>

        <div className="mt-10">
          {/* Plain anchor so the hash is honoured — see site-header.tsx. The
              document navigation is the point here, hence the rule waiver. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/#about"
            className="inline-flex items-center gap-2 text-[19px] font-medium text-[#2e2e2e] transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-5" strokeWidth={1.75} />
            Back to the home page
          </a>
        </div>
      </div>
    </section>
  );
}
