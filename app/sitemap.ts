import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

/* Only the public, indexable pages. The booking wizard (/book/*) and the admin
   dashboard (/admin/*) are intentionally left out and blocked in robots.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
