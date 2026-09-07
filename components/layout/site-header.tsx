import Image from "next/image";
import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { nav } from "@/lib/site";

/*
 * Floating pill nav. Geometry measured off the 1512px-wide export
 * (_mockups/frontend/MacBook Pro 14_ - 1.png, y 55-140):
 *   page gutter 105px · pill 372 -> 1415 · nav item gap 85px
 *   pill height 56px · CTA sits inside the pill's right edge with a 7px inset
 *
 * The measured geometry only holds from 1400px up — the 85px item gap needs
 * ~1385px of pill before the logo. From xl to 1400 the gap tightens to 32px;
 * below xl the gutters shrink, the links collapse into <MobileNav> and the pill
 * keeps just the CTA (sm+) and the hamburger.
 */
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 pt-[18px]">
      <div className="mx-auto flex max-w-[1512px] items-center gap-4 px-5 sm:px-8 xl:gap-6 xl:px-[105px]">
        <Link href="/" className="flex shrink-0 items-center gap-2 xl:gap-3">
          <span className="relative size-10 overflow-hidden rounded-full bg-[#e8d5f0] xl:size-11">
            <Image
              src="/images/linda-avatar.jpg"
              alt="Linda Chikaodi Austin"
              fill
              sizes="44px"
              className="object-cover"
            />
          </span>
          <span className="text-[13px] font-medium leading-[1.3] text-foreground xl:text-[14px]">
            Linda Chikaodi
            <br />
            Austin
          </span>
        </Link>

        <div className="ml-auto flex h-[52px] items-center gap-1 rounded-full bg-white/60 px-[7px] shadow-[0_1px_3px_rgba(80,40,100,0.05)] backdrop-blur-sm xl:h-[56px] xl:gap-0 xl:pl-[45px] xl:pr-[7px]">
          <nav className="hidden items-center gap-8 xl:flex min-[1400px]:gap-[85px]">
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
            className="hidden h-[38px] px-5 text-[12px] sm:inline-flex xl:ml-[28px] xl:h-[44px] xl:px-6"
          >
            <Link href="/book">Explore Services</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
