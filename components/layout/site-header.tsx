import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { nav } from "@/lib/site";

/*
 * Floating pill nav. Geometry measured off the 1512px-wide export
 * (_mockups/frontend/MacBook Pro 14_ - 1.png, y 55-140):
 *   page gutter 105px · pill 372 -> 1415 · nav item gap 85px
 *   pill height 56px · CTA sits inside the pill's right edge with a 7px inset
 */
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 pt-[18px]">
      <div className="mx-auto flex max-w-[1512px] items-center gap-6 px-[105px]">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="relative size-11 overflow-hidden rounded-full bg-[#e8d5f0]">
            <Image
              src="/images/linda-avatar.jpg"
              alt="Linda Chikaodi Austin"
              fill
              sizes="44px"
              className="object-cover"
            />
          </span>
          <span className="text-[14px] font-medium leading-[1.3] text-foreground">
            Linda Chikaodi
            <br />
            Austin
          </span>
        </Link>

        <div className="ml-auto flex h-[56px] items-center rounded-full bg-white/60 pl-[45px] pr-[7px] shadow-[0_1px_3px_rgba(80,40,100,0.05)] backdrop-blur-sm">
          <nav className="hidden items-center gap-[85px] xl:flex">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="whitespace-nowrap text-[13px] text-[#4a4a4a] transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button
            asChild
            variant="pill"
            className="ml-[28px] h-[44px] px-6 text-[12px]"
          >
            <Link href="/book">Explore Services</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
