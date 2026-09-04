import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
  title: "Linda Chikaodi Austin — Health & Nutrition Consultant",
  description:
    "From personalized consultations and meal plans to corporate wellness training and health education, Linda Chikaodi Austin helps people understand their health and turn knowledge into practical, sustainable action.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
