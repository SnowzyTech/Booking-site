import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Media } from "@/components/ui/media";
import { services } from "@/lib/services";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <section id="services" className="bg-white py-[70px]">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-center text-[26px] font-bold tracking-[0.06em]">
          <span className="text-[#5b0f8b]">SERVIC</span>
          <span className="text-[#b06fd6]">E</span>
          <span className="text-[#5b0f8b]">S</span>
        </h2>

        <div className="mt-14 space-y-[72px]">
          {services.map((s, i) => {
            const imageRight = i % 2 === 1;
            return (
              <div
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
                  <h3 className="text-[25px] font-bold leading-[1.15] tracking-[-0.01em] text-[#111]">
                    {s.name}
                  </h3>

                  {(s.tag || s.price) && (
                    <div className="mt-3 flex items-center justify-between gap-4">
                      {s.tag ? (
                        <span className="rounded-full bg-[#efefef] px-3 py-1 text-[11px] text-[#4a4a4a]">
                          {s.tag}
                        </span>
                      ) : (
                        <span />
                      )}
                      {s.price && (
                        <span className="flex items-center gap-3">
                          {s.listPrice && (
                            <span className="text-[11px] text-[#9a9a9a] line-through">
                              {s.listPrice}
                            </span>
                          )}
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-[15px] font-bold",
                              s.slug === "one-on-one-premium" ||
                                s.slug === "events-training"
                                ? "bg-brand text-white"
                                : "bg-[#f7ecff] text-[#111]"
                            )}
                          >
                            {s.price}
                          </span>
                        </span>
                      )}
                    </div>
                  )}

                  <hr className="mt-3 border-[#e6e6e6]" />

                  <p className="mt-4 text-justify text-[12.5px] leading-[1.6] text-[#3d3d3d]">
                    {s.blurb}
                  </p>

                  {s.bullets.length > 0 && (
                    <ul className="mt-5 space-y-2.5 pl-5">
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          className="list-disc text-[12.5px] leading-[1.5] text-[#3d3d3d] marker:text-[#c9a3dd]"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.extra && (
                    <p className="mt-4 text-justify text-[12.5px] leading-[1.6] text-[#3d3d3d]">
                      {s.extra}
                    </p>
                  )}

                  <Button
                    asChild
                    variant={s.ctaVariant}
                    size="sm"
                    className="mt-7"
                  >
                    <Link href={`/book?service=${s.slug}`}>{s.cta}</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
