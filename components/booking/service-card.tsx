"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Media } from "@/components/ui/media";
import { useBooking } from "@/components/booking/booking-context";
import type { Service } from "@/lib/services";

export function ServiceCard({ service }: { service: Service }) {
  const router = useRouter();
  const { setService } = useBooking();
  const [pending, startTransition] = React.useTransition();

  function choose() {
    setService(service);
    // Without the transition the button sits inert until the next route paints.
    startTransition(() => {
      router.push(
        service.flow === "scheduled" ? "/book/schedule" : "/book/assisted"
      );
    });
  }

  return (
    <div className="group flex flex-col">
      <Media
        src={service.image}
        alt={service.name}
        className="aspect-[474/213] w-full rounded-xl"
        imageClassName="transition-transform duration-500 ease-soft group-hover:scale-[1.03]"
      />

      <h2 className="mt-8 text-[25px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111] sm:text-[29px] xl:mt-[70px]">
        {service.name}
      </h2>

      {(service.tag || service.price) && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          {service.tag ? (
            <span className="rounded-full bg-[#efefef] px-3 py-1 text-[12.5px] font-medium text-[#3d3d3d]">
              {service.tag}
            </span>
          ) : (
            <span />
          )}
          {service.price && (
            <span className="flex min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-1">
              {service.listPrice && (
                <span className="rounded-full bg-[#efefef] px-2.5 py-1 text-[12.5px] text-[#8a8a8a] line-through">
                  {service.listPrice}
                </span>
              )}
              {/* Every price chip follows the first card's pattern now — was
                  solid brand for Premium/Events, per the owner's ask to keep
                  the price treatment consistent across every card; matches
                  the same chip in the landing page's Services section. */}
              <span className="rounded-full bg-[#f7ecff] px-3 py-1 text-[18px] font-extrabold text-[#111]">
                {service.price}
              </span>
            </span>
          )}
        </div>
      )}

      <hr className="mt-3 border-[#e6e6e6]" />

      <p className="mt-4 text-justify text-[15.5px] leading-[1.65] text-[#1d1620]">
        {service.blurb}
      </p>

      {service.bullets.length > 0 && (
        <ul className="mt-5 space-y-2.5 pl-5">
          {service.bullets.map((b) => (
            <li
              key={b}
              className="list-disc text-[15.5px] leading-[1.55] text-[#1d1620] marker:text-[#c9a3dd]"
            >
              {b}
            </li>
          ))}
        </ul>
      )}

      {service.extra && (
        <p className="mt-4 text-justify text-[15.5px] leading-[1.65] text-[#1d1620]">
          {service.extra}
        </p>
      )}

      <Button
        variant={service.ctaVariant}
        size="lg"
        onClick={choose}
        disabled={pending}
        className="mt-7 w-full font-bold"
      >
        {service.cta}
      </Button>
    </div>
  );
}
