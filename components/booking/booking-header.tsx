import Image from "next/image";
import Link from "next/link";

/* Branded, sticky topbar for the booking wizard — same logo + name as the site
   header, so each step still signifies whose site you're on. A bottom border
   marks it as a navbar; sticky so it stays visible while scrolling. */
export function BookingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e7d8f2] bg-[#f6e9fd]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1512px] items-center px-6 py-3.5 lg:px-[105px]">
        <Link href="/" className="inline-flex items-center gap-3">
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
      </div>
    </header>
  );
}
