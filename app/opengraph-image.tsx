import { ImageResponse } from "next/og";

import { siteName } from "@/lib/seo";

/* Site-wide social share image (WhatsApp / Facebook / X link previews).
   Generated at build time so there's no asset to maintain. */
export const alt =
  "Linda Chikaodi Austin — Health & Nutrition Consultant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "linear-gradient(135deg, #5b0f8b 0%, #8b1fb0 60%, #b14fd1 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Health & Nutrition Consultant
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            lineHeight: 1.35,
            opacity: 0.92,
            maxWidth: 940,
          }}
        >
          Consultations, personalized meal plans, corporate wellness &amp;
          health education.
        </div>
      </div>
    ),
    size
  );
}
