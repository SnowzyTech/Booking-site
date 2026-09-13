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
 * So the jump is re-run here after hydration, and again once the document has
 * finished loading, since the images landing underneath can undo it. Both
 * passes bail the moment anything has scrolled, which leaves the browser's own
 * restoration (and the visitor) in charge whenever it does work.
 * `scroll-margin-top` in globals.css keeps the floating header off the heading.
 */
export function HashScroll() {
  React.useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    const jump = () => {
      if (window.scrollY > 0) return;
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    };

    jump();
    if (document.readyState === "complete") return;

    window.addEventListener("load", jump, { once: true });
    return () => window.removeEventListener("load", jump);
  }, []);

  return null;
}
