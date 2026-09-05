"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/*
 * Admin top bar: section title + today's date on the left, the signed-in
 * admin's identity on the right. Sticky, sits above the page content.
 */
const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/admin/appointments", title: "Appointments" },
  { prefix: "/admin/clients", title: "Clients" },
  { prefix: "/admin/settings", title: "Settings" },
];

export function AdminTopNav({ adminEmail }: { adminEmail?: string | null }) {
  const pathname = usePathname();
  const title = TITLES.find((t) => pathname.startsWith(t.prefix))?.title ?? "Dashboard";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const initial = (adminEmail?.trim()[0] ?? "A").toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-black/5 bg-white/80 px-8 backdrop-blur">
      <div>
        <h1 className="text-[18px] font-bold leading-tight text-[#111]">{title}</h1>
        <p className="text-[12px] text-[#8a8a8a]">{today}</p>
      </div>

      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "grid size-9 place-items-center rounded-full bg-brand text-[13px] font-semibold text-white"
          )}
        >
          {initial}
        </span>
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-[13px] font-medium text-[#111]">Admin</span>
          {adminEmail && (
            <span className="text-[11px] text-[#8a8a8a]">{adminEmail}</span>
          )}
        </span>
      </div>
    </header>
  );
}
