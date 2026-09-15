import type { CSSProperties } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/*
 * The mockups show a flat #D9D9D9 block wherever a photograph has not been
 * supplied. `Placeholder` reproduces that block exactly, so an unshot service
 * row looks like the design rather than like a broken image. Pass a real `src`
 * and it renders the photo instead — swapping one in is a data change in
 * lib/services.ts, not a component change.
 */
export function Media({
  src,
  alt,
  className,
  imageClassName,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority,
  style,
}: {
  src?: string;
  alt: string;
  className?: string;
  /** Styles the inner <Image> — for hover/reveal effects inside the mask. */
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** e.g. `{ aspectRatio: "6000 / 3368" }` to match a specific photo's own
   *  dimensions — Tailwind's `aspect-[…]` can't take a per-item runtime value. */
  style?: CSSProperties;
}) {
  if (!src) {
    return (
      <div
        aria-label={`${alt} (image pending)`}
        role="img"
        className={cn("bg-placeholder", className)}
        style={style}
      />
    );
  }
  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
