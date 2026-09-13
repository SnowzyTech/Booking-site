import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/*
 * hero-bg.webp is the full 1512x976 hero backdrop from the design: a mostly
 * empty lavender field with the purple arc and three floating cards occupying
 * the lower third. It is positioned behind the whole section rather than in a
 * strip beneath the copy, which is how the mockup composes it.
 *
 * The copy stack animates on load rather than on scroll — it is above the fold,
 * so there is nothing to wait for. Deliberately no motion on the backdrop: it is
 * the LCP element, and its "floating cards" are baked into the WebP anyway.
 */
export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-wash-hero"
    >
      <Image
        src="/images/hero-bg.webp"
        alt=""
        width={1512}
        height={976}
        priority
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 w-full select-none"
      />

      {/* Padding and heading size both scale down below lg. At one flat size
          the heading alone ran 400px+ tall on a phone and, with the
          desktop-tuned 150/380px padding (sized to clear the floating cards
          baked into hero-bg.webp at its full-width desktop render), pushed the
          hero past two phone screens before the CTA appeared. The lg end is
          free to be large; the mobile end is the one that has to stay in
          check. */}
      <div className="mx-auto max-w-[1180px] px-6 pb-[140px] pt-[100px] text-center sm:pb-[220px] sm:pt-[120px] lg:pb-[380px] lg:pt-[150px]">
        <h1 className="mx-auto max-w-[1000px] animate-in text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-[#1d1620] duration-700 ease-quart fade-in-0 fill-mode-both slide-in-from-bottom-3 sm:text-[44px] md:text-[52px] lg:text-[60px] lg:leading-[1.1] lg:tracking-[-0.03em]">
          {/* The manual break matches the design's two-line layout from sm up;
              below that it would just cut a word short mid-wrap, so the line
              flows on its own and the trailing space keeps the words apart
              when the <br> is hidden. */}
          Transforming Health Through Nutrition,{" "}
          <br className="hidden sm:block" />
          Education &amp; Expert Guidance
        </h1>
        {/* #8a8a8a measured at 3:1 against the hero wash — under the 4.5:1
            minimum for body text — so this uses the site's standard body-copy
            gray instead, same as every other section's supporting line. */}
        <p className="mx-auto mt-6 max-w-[720px] animate-in text-[18px] font-medium leading-[1.6] text-[#2e2e2e] delay-100 duration-700 ease-quart fade-in-0 fill-mode-both slide-in-from-bottom-3">
          From personalized consultations and meal plans to corporate wellness
          training and health education, Linda Chikaodi Austin helps people
          understand their health and turn knowledge into practical, sustainable
          action.
        </p>
        <Button
          asChild
          variant="pill"
          size="lg"
          className="mt-9 animate-in px-9 delay-200 duration-700 ease-quart fade-in-0 fill-mode-both slide-in-from-bottom-3"
        >
          <Link href="/book">Explore Services</Link>
        </Button>
      </div>
    </section>
  );
}
