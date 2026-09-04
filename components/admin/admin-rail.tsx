"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Settings, Users } from "lucide-react";

import { cn } from "@/lib/utils";

/*
 * Fixed 93px icon rail (admin-rail.png). The active item sits in a rounded
 * #EBEBEB tile.
 *
 * Settings and Clients have no designs in _mockups/ — they render and are
 * reachable, but their destination pages are intentionally not invented.
 */
const items = [
  { href: "/appointments", Icon: CalendarDays, label: "Appointments" },
  { href: "/settings", Icon: Settings, label: "Settings" },
  { href: "/clients", Icon: Users, label: "Clients" },
];

export function AdminRail() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[93px] flex-col items-center bg-white pt-6">
      <Link href="/" className="relative size-[52px] overflow-hidden rounded-full">
        <Image
          src="/images/linda-avatar.jpg"
          alt="Linda Chikaodi Austin"
          fill
          sizes="52px"
          className="object-cover"
        />
      </Link>

      <nav className="mt-12 flex flex-col items-center gap-3">
        {items.map(({ href, Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              className={cn(
                "grid size-[52px] place-items-center rounded-2xl transition-colors",
                active ? "bg-rail-active" : "hover:bg-[#f4f4f4]"
              )}
            >
              <Icon
                className={cn(
                  "size-[26px]",
                  active ? "text-[#3a3a3a]" : "text-[#6f6f6f]"
                )}
                strokeWidth={1.6}
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
