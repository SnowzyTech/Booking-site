"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { optOutClient } from "@/lib/admin-actions";
import type { PremiumClient } from "@/lib/bookings";

/*
 * One premium client (_mockups/2x/update/Frame 210.png — an 86px white card:
 * 20px padding, a 46px mint avatar, the name at 20px, and the "Opt out" pill
 * inset 40px from the right edge). Unlike a booking row it does not expand;
 * the whole screen is a roster.
 *
 * Opting out cancels a paid engagement, so the pill asks once before firing.
 * The design has no confirm dialog and this keeps the row's geometry identical
 * either way — the label swaps, nothing moves.
 */
export function ClientRow({ client }: { client: PremiumClient }) {
  const router = useRouter();
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

  function onClick() {
    if (!arming) {
      setArming(true);
      return;
    }
    setArming(false);
    startTransition(async () => {
      const res = await optOutClient(client.id);
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  return (
    <div className="flex h-[86px] items-center rounded-2xl bg-white pl-5 pr-10 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <span className="grid size-[46px] shrink-0 place-items-center rounded-full bg-[#e1ffe4] text-[13px] font-medium text-[#002d04]">
        {client.initial}
      </span>

      <span className="ml-[18px] flex min-w-0 flex-col">
        <span className="truncate text-[20px] font-medium text-[#111]">
          {client.name}
        </span>
        {error && <span className="text-[12px] text-[#a33]">{error}</span>}
      </span>

      <Button
        variant="softViolet"
        title={`Premium since ${client.startedOn} · ${client.email}`}
        className="ml-auto h-[38px] w-[141px] shrink-0 text-[20px] font-normal"
        disabled={pending}
        onClick={onClick}
      >
        {pending ? "Removing…" : arming ? "Confirm?" : "Opt out"}
      </Button>
    </div>
  );
}
