"use client";

import * as React from "react";

/*
 * Scroll entrance wrapper.
 *
 * This is the only client component the motion system adds to the landing page.
 * Every section stays a server component and simply wraps its existing inner
 * container with <Reveal> — the styling lives in globals.css under
 * [data-reveal] / [data-reveal-stagger], so nothing here ships CSS.
 *
 * The observer disconnects the first time an element lands in view. Reveals are
 * a one-time arrival, not a scroll-linked effect: replaying them on the way back
 * up is what makes scroll animation tiring.
 */
type RevealProps<T extends React.ElementType> = {
  as?: T;
  /** Sequence the direct children instead of the wrapper itself. */
  stagger?: boolean;
  /** Hold the entrance back, in ms — for offsetting a sibling. */
  delay?: number;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">;

export function Reveal<T extends React.ElementType = "div">({
  as,
  stagger = false,
  delay,
  style,
  children,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as React.ElementType;
  const ref = React.useRef<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    // Older browsers and any environment without the API just show the content.
    // Deferred to the next frame rather than set synchronously here, which
    // would be a cascading render.
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      // Pull the trigger line up slightly so a section commits to appearing
      // once it is properly on screen, not as its first pixel crosses.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  const state = shown ? "in" : "out";

  return (
    <Tag
      ref={ref}
      {...(stagger ? { "data-reveal-stagger": state } : { "data-reveal": state })}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
