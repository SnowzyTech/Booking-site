import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Media } from "@/components/ui/media";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <section id="services" className="bg-white py-[70px]">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-center text-[30px] font-extrabold tracking-[0.06em]">
          <span className="text-[#5b0f8b]">SERVIC</span>
          <span className="text-[#b06fd6]">E</span>
          <span className="text-[#5b0f8b]">S</span>
        </h2>

        <div className="mt-14 space-y-[72px]">
          {services.map((s, i) => {
            const imageRight = i % 2 === 1;
            return (
              <Reveal
                key={s.slug}
                className="grid grid-cols-1 items-start gap-x-[72px] gap-y-8 lg:grid-cols-2"
              >
                <Media
                  src={s.image}
                  alt={s.name}
                  className={cn(
                    "aspect-[537/249] w-full rounded-lg",
                    imageRight && "lg:order-2"
                  )}
                />

                <div className={cn(imageRight && "lg:order-1")}>
                  <h3 className="text-[28px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111]">
                    {s.name}
                  </h3>

                  {(s.tag || s.price) && (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      {s.tag ? (
                        <span className="rounded-full bg-[#efefef] px-3 py-1 text-[12.5px] font-medium text-[#3d3d3d]">
                          {s.tag}
                        </span>
                      ) : (
                        <span />
                      )}
                      {s.price && (
                        <span className="flex min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-1">
                          {s.listPrice && (
                            <span className="text-[12.5px] text-[#8a8a8a] line-through">
                              {s.listPrice}
                            </span>
                          )}
                          {/* Every price chip follows the first card's
                              pattern now — was solid brand for Premium/Events,
                              per the owner's ask to keep the price treatment
                              consistent across every card. */}
                          <span className="rounded-full bg-[#f7ecff] px-3 py-1 text-[17px] font-extrabold text-[#111]">
                            {s.price}
                          </span>
                        </span>
                      )}
                    </div>
                  )}

                  <hr className="mt-3 border-[#e6e6e6]" />

                  <p className="mt-4 text-justify text-[15.5px] leading-[1.65] text-[#1d1620]">
                    {s.blurb}
                  </p>

                  {s.bullets.length > 0 && (
                    <ul className="mt-5 space-y-2.5 pl-5">
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          className="list-disc text-[15.5px] leading-[1.55] text-[#1d1620] marker:text-[#c9a3dd]"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.extra && (
                    <p className="mt-4 text-justify text-[15.5px] leading-[1.65] text-[#1d1620]">
                      {s.extra}
                    </p>
                  )}

                  <Button
                    asChild
                    variant={s.ctaVariant}
                    size="lg"
                    className="mt-7 w-full font-bold"
                  >
                    {/* Straight to this service's next step, not the /book
                        picker — only the hero's "Explore Services" browses
                        every service. ?service=<slug> is picked up by
                        <ServiceFromQuery> on the target step. */}
                    <Link
                      href={
                        s.flow === "scheduled"
                          ? `/book/schedule?service=${s.slug}`
                          : `/book/assisted?service=${s.slug}`
                      }
                    >
                      {s.cta}
                    </Link>
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
