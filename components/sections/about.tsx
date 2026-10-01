import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { aboutStoryCta, aboutSummary } from "@/lib/site";

export function About() {
  return (
    <section id="about" className="bg-wash-lavender py-[60px]">
      <div className="mx-auto max-w-[930px] px-6">
        <Reveal className="group relative aspect-[926/365] w-full overflow-hidden rounded-xl">
          <Image
            src="/images/about-header.jpg"
            alt="Linda Chikaodi Austin"
            fill
            sizes="(max-width: 1024px) 100vw, 930px"
            className="scale-[1.04] object-cover transition-transform duration-700 ease-soft group-data-[reveal=in]:scale-100"
          />
          {/* The supplied artwork has this heading baked into the image, so it
              is exposed to assistive tech only — rendering it again would
              double up visually. Swap to a text-free crop of the art and this
              becomes a normal visible heading. */}
          <h2 className="sr-only">
            Meet Your Health &amp; Nutrition Consultant, Linda Chikaodi Austin
          </h2>
        </Reveal>

        {/* Summary only — the full biography is told in chapters on /about. */}
        <Reveal className="mt-9 space-y-5 px-2">
          {aboutSummary.map((p) => (
            <p
              key={p.slice(0, 40)}
              className="text-[23px] leading-[1.75] text-[#1d1620]"
            >
              {p}
            </p>
          ))}
          <div className="pt-3">
            <Button
              asChild
              variant="pill"
              size="lg"
              className="h-[60px] px-9 text-[20px] hover:bg-brand"
            >
              <Link href="/about">
                {aboutStoryCta}
                <ArrowRight className="ml-2.5 size-5" strokeWidth={2} />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
