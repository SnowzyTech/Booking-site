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

      <div className="mx-auto max-w-[1180px] px-6 pb-[380px] pt-[150px] text-center">
        <h1 className="mx-auto max-w-[1000px] animate-in text-[54px] font-medium leading-[1.12] tracking-[-0.03em] text-[#1d1620] duration-700 ease-quart fade-in-0 fill-mode-both slide-in-from-bottom-3">
          Transforming Health Through Nutrition,
          <br />
          Education &amp; Expert Guidance
        </h1>
        <p className="mx-auto mt-6 max-w-[720px] animate-in text-[15px] leading-[1.6] text-[#8a8a8a] delay-100 duration-700 ease-quart fade-in-0 fill-mode-both slide-in-from-bottom-3">
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
