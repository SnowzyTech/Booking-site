import Image from "next/image";
import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * Floating pill nav. Geometry measured off the 1512px-wide export
 * (_mockups/frontend/MacBook Pro 14_ - 1.png, y 55-140):
 *   page gutter 105px · pill 372 -> 1415 · nav item gap 85px
 *   pill height 56px · CTA sits inside the pill's right edge with a 7px inset
 *
 * The 85px gap only fits from ~1460px up: measured, the row needs 1240px and a
 * 1400px page leaves 1190px between the gutters. So the gap steps 32 -> 70 ->
 * 85px across xl / 1400 / 1460 rather than jumping straight to the export
 * value. Below xl the gutters shrink, the links collapse into <MobileNav> and
 * the pill keeps just the CTA (sm+) and the hamburger.
 *
 * `fixed` (the landing page) pins the bar to the viewport instead of leaving it
 * at the top of the document. The bar itself stays transparent, so once it
 * rides over the sections the logo gets its own chip and the pill turns nearly
 * opaque — otherwise both would be dark text on whatever scrolls underneath.
 * Anchor targets already clear it: see `scroll-margin-top` in globals.css.
 * The bar ignores the pointer except on the logo and the pill, so the empty
 * strip between them doesn't swallow clicks meant for the page beneath.
 */
export function SiteHeader({ fixed = false }: { fixed?: boolean }) {
  return (
    <header
      className={cn(
        "pointer-events-none inset-x-0 top-0 z-40 pt-[18px]",
        fixed ? "fixed" : "absolute"
      )}
    >
      <div className="mx-auto flex max-w-[1512px] items-center gap-4 px-5 sm:px-8 xl:gap-6 xl:px-[105px]">
        <Link
          href="/"
          className={cn(
            "pointer-events-auto flex shrink-0 items-center gap-2 xl:gap-3",
            fixed &&
              "rounded-full bg-white/85 py-1 pl-1 pr-4 shadow-[0_1px_6px_rgba(80,40,100,0.1)] backdrop-blur-sm"
          )}
        >
          <span className="relative size-10 overflow-hidden rounded-full bg-[#e8d5f0] xl:size-11">
            <Image
              src="/images/linda-avatar.jpg"
              alt="Linda Chikaodi Austin"
              fill
              sizes="44px"
              className="object-cover"
            />
          </span>
          <span className="text-[14px] font-semibold leading-[1.3] text-foreground xl:text-[15px]">
            Linda Chikaodi
            <br />
            Austin
          </span>
        </Link>

        <div
          className={cn(
            "pointer-events-auto ml-auto flex h-[52px] items-center gap-1 rounded-full px-[7px] backdrop-blur-sm xl:h-[56px] xl:gap-0 xl:pl-[45px] xl:pr-[7px]",
            fixed
              ? "bg-white/85 shadow-[0_1px_6px_rgba(80,40,100,0.1)]"
              : "bg-white/60 shadow-[0_1px_3px_rgba(80,40,100,0.05)]"
          )}
        >
          {/* Plain anchors, not <Link>: these are hashes on the landing page,
              and a soft navigation from /contact lands at the top of "/" with
              the hash dropped. A document navigation honours it. On the landing
              page itself the browser still treats them as same-document and
              smooth-scrolls without a reload. */}
          <nav className="hidden items-center gap-8 xl:flex min-[1400px]:gap-[70px] min-[1460px]:gap-[85px]">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="whitespace-nowrap text-[14px] font-medium text-[#2e2e2e] transition-colors hover:text-brand"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Button
            asChild
            variant="pill"
            className="hidden h-[40px] px-5 text-[13px] hover:bg-brand sm:inline-flex xl:ml-[28px] xl:h-[44px] xl:px-6"
          >
            <Link href="/book">Explore Services</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
