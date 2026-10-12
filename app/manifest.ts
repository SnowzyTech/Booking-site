import type { MetadataRoute } from "next";

import { siteDescription } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Linda Chikaodi Austin — Health & Nutrition Consultant",
    short_name: "Linda Chikaodi",
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5b0f8b",
    icons: [
      {
        // The site's real icon (app/icon.jpg), served at /icon.jpg.
        src: "/icon.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
  };
}
