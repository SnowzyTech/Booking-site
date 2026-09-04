"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Media } from "@/components/ui/media";
import { useBooking } from "@/components/booking/booking-context";
import type { Service } from "@/lib/services";
import { cn } from "@/lib/utils";

export function ServiceCard({ service }: { service: Service }) {
  const router = useRouter();
  const { setService } = useBooking();

  function choose() {
    setService(service);
    router.push(service.flow === "scheduled" ? "/book/schedule" : "/book/assisted");
  }

  return (
    <div className="flex flex-col">
      <Media
        src={service.image}
        alt={service.name}
        className="aspect-[474/213] w-full rounded-xl"
      />

      <h2 className="mt-[70px] text-[26px] font-bold leading-[1.15] tracking-[-0.01em] text-[#111]">
        {service.name}
      </h2>

      {(service.tag || service.price) && (
        <div className="mt-3 flex items-center justify-between gap-4">
          {service.tag ? (
            <span className="rounded-full bg-[#efefef] px-3 py-1 text-[11px] text-[#4a4a4a]">
              {service.tag}
            </span>
          ) : (
            <span />
          )}
          {service.price && (
            <span className="flex items-center gap-3">
              {service.listPrice && (
                <span className="rounded-full bg-[#efefef] px-2.5 py-1 text-[11px] text-[#9a9a9a] line-through">
                  {service.listPrice}
                </span>
              )}
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[16px] font-bold",
                  service.slug === "one-on-one-premium" ||
                    service.slug === "events-training"
                    ? "bg-brand text-white"
                    : "text-[#111]"
                )}
              >
                {service.price}
              </span>
            </span>
          )}
        </div>
      )}

      <hr className="mt-3 border-[#e6e6e6]" />

      <p className="mt-4 text-justify text-[12.5px] leading-[1.6] text-[#3d3d3d]">
        {service.blurb}
      </p>

      {service.bullets.length > 0 && (
        <ul className="mt-5 space-y-2.5 pl-5">
          {service.bullets.map((b) => (
            <li
              key={b}
              className="list-disc text-[12.5px] leading-[1.5] text-[#3d3d3d] marker:text-[#c9a3dd]"
            >
              {b}
            </li>
          ))}
        </ul>
      )}

      {service.extra && (
        <p className="mt-4 text-justify text-[12.5px] leading-[1.6] text-[#3d3d3d]">
          {service.extra}
        </p>
      )}

      <Button
        variant={service.ctaVariant}
        size="sm"
        onClick={choose}
        className="mt-7 self-start"
      >
        {service.cta}
      </Button>
    </div>
  );
}
