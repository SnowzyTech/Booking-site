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
        // Stand-in icon (the avatar); swap for a square PNG set when branding lands.
        src: "/images/linda-avatar.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
  };
}
