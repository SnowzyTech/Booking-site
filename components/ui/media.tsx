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
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        aria-label={`${alt} (image pending)`}
        role="img"
        className={cn("bg-placeholder", className)}
      />
    );
  }
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
