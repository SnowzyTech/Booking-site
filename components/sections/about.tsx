import Image from "next/image";

import { aboutClosing, aboutParagraphs } from "@/lib/site";

export function About() {
  return (
    <section id="about" className="bg-wash-lavender py-[60px]">
      <div className="mx-auto max-w-[930px] px-6">
        <div className="relative aspect-[926/365] w-full overflow-hidden rounded-xl">
          <Image
            src="/images/about-header.jpg"
            alt="Linda Chikaodi Austin"
            fill
            sizes="(max-width: 1024px) 100vw, 930px"
            className="object-cover"
          />
          {/* The supplied artwork has this heading baked into the image, so it
              is exposed to assistive tech only — rendering it again would
              double up visually. Swap to a text-free crop of the art and this
              becomes a normal visible heading. */}
          <h2 className="sr-only">
            Meet Your Health &amp; Nutrition Consultant, Linda Chikaodi Austin
          </h2>
        </div>

        <div className="mt-9 space-y-5 px-2">
          {aboutParagraphs.map((p) => (
            <p
              key={p.slice(0, 40)}
              className="text-justify text-[12.5px] leading-[1.65] text-[#2e2e2e]"
            >
              {p}
            </p>
          ))}
          <p className="pt-2 text-justify text-[12.5px] font-bold leading-[1.65] text-[#111]">
            {aboutClosing}
          </p>
        </div>
      </div>
    </section>
  );
}
