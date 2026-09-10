"use client";

import * as React from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";

import { ClientRow } from "@/components/admin/client-row";
import { NewClientDialog } from "@/components/admin/new-client-dialog";
import { Button } from "@/components/ui/button";
import type { ClientsData } from "@/lib/bookings";

/*
 * Clients dashboard (_mockups/2x/update/MacBook Pro 14_ - 9.png).
 *
 * The One-on-One Premium roster: a count line, a month stepper, and one card
 * per client. Premium is billed monthly, so stepping to a month shows everyone
 * whose plan had started by then — not only those who signed up in it.
 *
 * The stepper is drawn as the frame shows it (chevrons in their own outlined
 * tiles on the wash, the month in a white pill) rather than as the appointments
 * board's joined segmented control.
 */
export function ClientsClient({ clients }: ClientsData) {
  const [month, setMonth] = React.useState(() => new Date(2026, 8, 1));
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const monthKey = format(month, "yyyy-MM");
  // Listed from the start month onward, until (but not including) the month they
  // opted out of. A null endKey means the engagement is still running.
  const visible = clients.filter(
    (c) => c.startKey <= monthKey && (c.endKey == null || monthKey < c.endKey)
  );

  const changeMonth = (delta: number) =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

  return (
    <div className="px-[68px] pb-24 pt-8">
      <div className="flex items-center justify-between gap-8">
        {/* Copy transcribed verbatim from the frame, spacing included. */}
        <p className="text-[17px] text-[#111]">
          You have{" "}
          <strong className="font-bold">
            {visible.length} One- on One Clients this month
          </strong>
        </p>

        <Button
          variant="fab"
          size="icon"
          aria-label="Add a premium client"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="size-5" strokeWidth={2.5} />
        </Button>
      </div>

      <div className="mt-8 flex items-center gap-[3px]">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => changeMonth(-1)}
          className="grid h-[34px] w-[38px] place-items-center rounded-md border border-[#dcdcdc] text-[15px] text-[#cfcfcf] transition-colors hover:bg-white"
        >
          &lsaquo;
        </button>
        <span className="grid h-[34px] min-w-[138px] place-items-center rounded-md bg-white text-[16px] font-medium text-[#111]">
          {month.toLocaleString("en-US", { month: "long" })}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => changeMonth(1)}
          className="grid h-[34px] w-[38px] place-items-center rounded-md border border-[#dcdcdc] text-[15px] text-[#cfcfcf] transition-colors hover:bg-white"
        >
          &rsaquo;
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-[15px] text-[#9a9a9a]">
          No premium clients yet for {format(month, "MMMM yyyy")}.
        </p>
      ) : (
        <div className="mt-4 space-y-2.5">
          {visible.map((c) => (
            <ClientRow key={c.id} client={c} monthKey={monthKey} />
          ))}
        </div>
      )}

      <NewClientDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
