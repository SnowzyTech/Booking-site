import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, siteDescription, siteName, siteUrl } from "@/lib/seo";

/*
 * STAND-IN FONT.
 *
 * The mockups are PNG exports, which carry no font metadata. Both families in
 * the designs read as a geometric grotesk (double-story `a`, spurred `G`,
 * straight-tailed `y`) — Plus Jakarta Sans is the closest Google Fonts match.
 *
 * To swap in the real families: change the import and the two calls below.
 * Nothing else in the codebase references a font by name — everything goes
 * through `--font-display` / `--font-body`, which globals.css maps onto
 * Tailwind's `font-heading` and `font-sans`.
 */
const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Linda Chikaodi Austin — Health & Nutrition Consultant",
    // Child pages set a short title; this appends the brand (e.g. "About Linda").
    template: "%s — Linda Chikaodi Austin",
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    "clinical nutritionist",
    "nutritionist Lagos",
    "nutritionist Nigeria",
    "personalized meal plan",
    "nutrition consultation",
    "corporate wellness training",
    "diabetes nutrition",
    "metabolic health",
    "Linda Chikaodi Austin",
    "Nutriticare",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: `${siteUrl}/`,
    siteName,
    title: "Linda Chikaodi Austin — Health & Nutrition Consultant",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Linda Chikaodi Austin — Health & Nutrition Consultant",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} antialiased`}
    >
      <body>
        <JsonLd data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
