import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Variants map 1:1 onto the button treatments in the mockups:
 *
 *   pill      "Explore Services", "Book a Consultation"      solid brand, fully round
 *   solid     "Confirm", "Complete & Continue"               solid brand, 8px radius
 *   dark      "Start Your Journey" on the meal-plan card      near-black, fully round
 *   soft      "Start Your Journey" (Corporate / Events)       #FFF4F4 pink, fully round
 *   softViolet "Decline" in the admin card                    #F7E6FF, 8px radius
 *   outline   "Re-Schedule"                                   brand border, transparent
 *   fab       the admin "+" button                            40px brand circle
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        pill: "rounded-full bg-brand text-white hover:bg-brand/90",
        solid: "rounded-lg bg-brand text-white hover:bg-brand/90",
        dark: "rounded-full bg-[#1d0b26] text-white hover:bg-[#2c1438]",
        soft: "rounded-full bg-btn-soft text-foreground hover:bg-[#ffe9e9]",
        softViolet:
          "rounded-lg bg-btn-soft-purple text-brand hover:bg-[#f0d6ff]",
        outline:
          "rounded-lg border border-brand bg-transparent text-brand hover:bg-brand/5",
        ghost: "rounded-lg hover:bg-surface-muted",
        fab: "rounded-full bg-brand text-white hover:bg-brand/90",
      },
      size: {
        xs: "h-7 px-3 text-[11px]",
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-[15px]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "pill", size: "md" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
