"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

/*
 * Collapsible admin sidebar. Collapsed it's a 93px icon rail; expanded it
 * slides out to 240px with labels. Sticky so it stays put while content
 * scrolls. Toggle state lives in AdminShell.
 */
const items = [
  { href: "/admin/appointments", Icon: CalendarDays, label: "Appointments" },
  { href: "/admin/settings", Icon: Settings, label: "Settings" },
  { href: "/admin/clients", Icon: Users, label: "Clients" },
];

export function AdminRail({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 flex h-screen shrink-0 flex-col bg-white pt-5 transition-[width] duration-200 ease-out",
        expanded ? "w-[240px] px-4" : "w-[93px] items-center"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        className={cn(
          "grid size-9 place-items-center rounded-lg text-[#6f6f6f] transition-colors hover:bg-[#f4f4f4]",
          expanded && "self-end"
        )}
      >
        {expanded ? (
          <ChevronsLeft className="size-5" />
        ) : (
          <ChevronsRight className="size-5" />
        )}
      </button>

      <Link
        href="/"
        className={cn(
          "mt-3 flex items-center gap-3",
          expanded ? "px-1" : "flex-col"
        )}
      >
        <span className="relative size-[52px] shrink-0 overflow-hidden rounded-full">
          <Image
            src="/images/linda-avatar.jpg"
            alt="Linda Chikaodi Austin"
            fill
            sizes="52px"
            className="object-cover"
          />
        </span>
        {expanded && (
          <span className="text-[14px] font-semibold leading-tight text-[#111]">
            Linda Austin
          </span>
        )}
      </Link>

      <nav
        className={cn(
          "mt-10 flex flex-col gap-2",
          expanded ? "w-full" : "items-center"
        )}
      >
        {items.map(({ href, Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              className={cn(
                "flex items-center rounded-2xl transition-colors",
                expanded ? "w-full gap-3 px-3 py-3" : "size-[52px] justify-center",
                active ? "bg-rail-active" : "hover:bg-[#f4f4f4]"
              )}
            >
              <Icon
                className={cn(
                  "size-[26px] shrink-0",
                  active ? "text-[#3a3a3a]" : "text-[#6f6f6f]"
                )}
                strokeWidth={1.6}
              />
              {expanded && (
                <span
                  className={cn(
                    "text-[14px]",
                    active ? "font-medium text-[#3a3a3a]" : "text-[#6f6f6f]"
                  )}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <form action={logout} className={cn("mt-auto pb-6", expanded && "w-full")}>
        <button
          type="submit"
          aria-label="Sign out"
          title="Sign out"
          className={cn(
            "flex items-center rounded-2xl text-[#6f6f6f] transition-colors hover:bg-[#f4f4f4]",
            expanded ? "w-full gap-3 px-3 py-3" : "size-[52px] justify-center"
          )}
        >
          <LogOut className="size-[24px] shrink-0" strokeWidth={1.6} />
          {expanded && <span className="text-[14px]">Sign out</span>}
        </button>
      </form>
    </aside>
  );
}
