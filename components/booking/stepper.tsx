"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/*
 * Four-dot stepper. Dot states are taken from the mockups:
 *   complete -> #6BDD00 green      (MacBook Pro 14_ - 3/5)
 *   current  -> #6F7F60 olive      (MacBook Pro 14_ - 2/3/4/5/8)
 *   upcoming -> #DFDFDF grey
 *
 * The assisted flow (Corporate / Events) still renders four dots but only ever
 * reaches step 2 — see MacBook Pro 14_ - 8.png.
 */
const STEP_BY_PATH: Record<string, number> = {
  "/book": 1,
  "/book/schedule": 2,
  "/book/details": 3,
  "/book/payment": 4,
  "/book/assisted": 2,
};

export function Stepper() {
  const pathname = usePathname();
  const current = STEP_BY_PATH[pathname] ?? 1;

  return (
    <div className="mx-auto flex w-full max-w-[1058px] items-center px-6 pt-9">
      {[1, 2, 3, 4].map((n, i) => (
        <div key={n} className={cn("flex items-center", i > 0 && "flex-1")}>
          {i > 0 && (
            <div className="mx-4 h-px flex-1 border-t border-dashed border-[#c9b7cf]" />
          )}
          <span
            className={cn(
              "grid size-[46px] shrink-0 place-items-center rounded-full text-[15px] transition-colors",
              n < current && "bg-step-done text-white",
              n === current && "bg-step-current text-white",
              n > current && "bg-step-idle text-[#a5a5a5]"
            )}
          >
            {n}
          </span>
        </div>
      ))}
    </div>
  );
}
