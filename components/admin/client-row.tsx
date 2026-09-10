"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { optOutClient } from "@/lib/admin-actions";
import type { PremiumClient } from "@/lib/bookings";

/*
 * One premium client (_mockups/2x/update/Frame 210.png — an 86px white card:
 * 20px padding, a 46px mint avatar, the name at 20px, and the "Opt out" pill
 * inset 40px from the right edge). Clicking the card body expands it to reveal
 * the full order details underneath; the "Opt out" pill and the chevron sit at
 * the right.
 *
 * Opting out unsubscribes a client from the viewed month onward, so the pill
 * asks once before firing. Confirming keeps the row's geometry identical — the
 * label swaps, nothing moves.
 */
export function ClientRow({
  client,
  monthKey,
}: {
  client: PremiumClient;
  monthKey: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [arming, setArming] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  // Drop the armed state if the admin looks away rather than leaving a live
  // destructive button sitting in the list.
  React.useEffect(() => {
    if (!arming) return;
    const t = setTimeout(() => setArming(false), 4000);
    return () => clearTimeout(t);
  }, [arming]);

  function onOptOut(e: React.MouseEvent) {
    // Never let the pill toggle the card open/closed.
    e.stopPropagation();
    if (!arming) {
      setArming(true);
      return;
    }
    setArming(false);
    startTransition(async () => {
      const res = await optOutClient(client.id, monthKey);
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className="flex h-[86px] cursor-pointer items-center pl-5 pr-10"
      >
        <span className="grid size-[46px] shrink-0 place-items-center rounded-full bg-[#e1ffe4] text-[13px] font-medium text-[#002d04]">
          {client.initial}
        </span>

        <span className="ml-[18px] flex min-w-0 flex-col">
          <span className="truncate text-[20px] font-medium text-[#111]">
            {client.name}
          </span>
          {error && <span className="text-[12px] text-[#a33]">{error}</span>}
        </span>

        <div className="ml-auto flex shrink-0 items-center gap-4">
          <Button
            variant="softViolet"
            className="h-[38px] w-[141px] text-[20px] font-normal"
            disabled={pending}
            onClick={onOptOut}
          >
            {pending ? "Removing…" : arming ? "Confirm?" : "Opt out"}
          </Button>
          <ChevronDown
            className={`size-5 text-[#8a8a8a] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {open && (
        <dl className="grid grid-cols-2 gap-x-10 gap-y-3 border-t border-[#eee] px-6 py-5 text-[14px]">
          <Detail label="E-mail" value={client.email} />
          <Detail label="Phone Number" value={client.phone} />
          <Detail label="Whatsapp Number" value={client.whatsapp} />
          <Detail label="Address" value={client.address} />
          <Detail label="Service" value={client.serviceName} />
          <Detail label="Premium since" value={client.startedOn} />
          {client.note && (
            <div className="col-span-2">
              <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
                Notes
              </dt>
              <dd className="mt-0.5 whitespace-pre-wrap text-[#333]">
                {client.note}
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
        {label}
      </dt>
      <dd className="mt-0.5 text-[#333]">{value?.trim() || "—"}</dd>
    </div>
  );
}
