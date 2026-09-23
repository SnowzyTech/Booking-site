"use client";

import type { CSSProperties } from "react";
import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/*
 * A <Media> frame that holds more than one photograph and cross-fades between
 * them. Corporate Wellness is the only service shot more than once, so this is
 * deliberately the narrow case: same geometry and same object-cover framing as
 * `Media`, with the extra frames stacked behind the first.
 *
 * The rotation is paused whenever the frame is off screen or the tab is hidden,
 * so returning to the page doesn't replay a queue of transitions, and it never
 * starts at all under `prefers-reduced-motion` — the slideshow then settles on
 * the first photo, the same finished-state contract the reveals keep.
 */
export function MediaSlideshow({
  images,
  alt,
  className,
  imageClassName,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  style,
  interval = 4500,
}: {
  images: string[];
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  style?: CSSProperties;
  /** Hold time per photo, in ms — the cross-fade runs on top of it. */
  interval?: number;
}) {
  const [index, setIndex] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Run only while the frame is actually being looked at.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);

    const onVisibility = () => {
      if (document.hidden) setRunning(false);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  React.useEffect(() => {
    if (!running || images.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      interval
    );
    return () => window.clearInterval(id);
  }, [running, images.length, interval]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={style}
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          /* Only the first frame is described: the others are the same subject
             from a second angle, and announcing each one would read as three
             separate images sitting on top of each other. */
          alt={i === 0 ? alt : ""}
          aria-hidden={i === 0 ? undefined : true}
          fill
          sizes={sizes}
          className={cn(
            "object-cover transition-[opacity,transform] duration-[var(--dur-slow)] ease-soft",
            i === index ? "scale-100 opacity-100" : "scale-[1.05] opacity-0",
            imageClassName
          )}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full bg-white transition-all duration-[var(--dur-base)] ease-quart",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                i === index ? "w-5 opacity-95" : "w-1.5 opacity-55 hover:opacity-80"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
