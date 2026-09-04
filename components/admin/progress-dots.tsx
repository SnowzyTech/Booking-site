import { cn } from "@/lib/utils";

/* Session progress dots — green for completed, grey otherwise. */
export function ProgressDots({
  total,
  done,
  className,
}: {
  total: number;
  done: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center">
          {i > 0 && (
            <span className="mx-1.5 w-[26px] border-t border-dashed border-[#cfcfcf]" />
          )}
          <span
            className={cn(
              "grid size-[15px] place-items-center rounded-full text-[8px]",
              i < done
                ? "bg-step-done text-white"
                : "bg-[#e0e0e0] text-[#9a9a9a]"
            )}
          >
            {i + 1}
          </span>
        </div>
      ))}
    </div>
  );
}
