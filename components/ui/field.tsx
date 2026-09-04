import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-input bg-white px-4 text-sm outline-none placeholder:uppercase placeholder:tracking-wide placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/15",
        className
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-lg border border-input bg-white px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/15",
        className
      )}
      {...props}
    />
  );
}

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("text-[13px] font-semibold text-[#4b4b4b]", className)}
      {...props}
    />
  );
}

export { Input, Textarea, Label };
