"use client";

import * as React from "react";

/*
 * Fragment arrival.
 *
 * The browser's own jump to `/#faq`, `/#contacts` etc. does not survive this
 * page: it is long and streamed, and `html { scroll-behavior: smooth }` turns
 * the initial jump into an animation that gets cancelled, so a fragment URL
 * that is typed, shared, or followed from /contact lands at the top instead.
 * Same-page nav clicks are unaffected — those are what the CSS was written for.
 *
 * One attempt is not enough, and the moment to make it differs per build: in
 * dev the bundle is still loading when this mounts, in production the page is
 * prerendered and `readyState` is already "complete", and either way hydration
 * and late layout can undo a jump made too early. So it retries across a short
 * window instead of guessing the one right moment — and stops the instant the
 * visitor takes over, so the page is never yanked under them.
 */

/** Matches `scroll-margin-top` on the anchor targets in globals.css. */
const HEADER_OFFSET = 96;

export function HashScroll() {
  React.useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    let surrendered = false;
    const surrender = () => {
      surrendered = true;
    };

    const jump = () => {
      if (surrendered) return;
      const el = document.getElementById(id);
      if (!el) return;
      // Already parked under the floating header — nothing to correct.
      if (Math.abs(el.getBoundingClientRect().top - HEADER_OFFSET) <= 2) return;
      el.scrollIntoView({ behavior: "instant", block: "start" });
    };

    const passive = { passive: true } as const;
    window.addEventListener("wheel", surrender, passive);
    window.addEventListener("touchstart", surrender, passive);
    window.addEventListener("keydown", surrender, passive);
    window.addEventListener("load", jump);

    jump();
    const timers = [60, 180, 400, 800].map((d) => window.setTimeout(jump, d));

    return () => {
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("load", jump);
      window.removeEventListener("wheel", surrender);
      window.removeEventListener("touchstart", surrender);
      window.removeEventListener("keydown", surrender);
    };
  }, []);

  return null;
}
