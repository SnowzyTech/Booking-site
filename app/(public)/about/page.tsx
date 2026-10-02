import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";
import {
  StoryChapters,
  StoryClosing,
  StoryIntro,
} from "@/components/sections/about-page";
import { aboutSummary } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Linda — Linda Chikaodi Austin",
  description: aboutSummary[0],
};

/* Linda's full story, in chapters. The landing band (<About>) carries a short
   summary and its "Full Story" button links here. */
export default function AboutPage() {
  return (
    <>
      <SiteHeader fixed />
      <main>
        <StoryIntro />
        <StoryChapters />
        <StoryClosing />
      </main>
    </>
  );
}
