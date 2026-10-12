/*
 * SEO helpers: the canonical site URL plus the JSON-LD (schema.org) builders.
 *
 * All structured data is generated from the same content sources the pages
 * render from (lib/site.ts, lib/services.ts, lib/faq.ts) so it can never drift
 * from what a visitor actually sees.
 *
 * The production domain is lindachikaodi.com; override it per-environment with
 * NEXT_PUBLIC_SITE_URL (e.g. a Vercel preview URL) — the trailing slash is
 * stripped so callers can always append their own path.
 */
import { faq } from "@/lib/faq";
import { priceToKobo, services } from "@/lib/services";
import { aboutSummary, contact, socialLinks } from "@/lib/site";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lindachikaodi.com"
).replace(/\/$/, "");

export const siteName = "Linda Chikaodi Austin";

export const siteDescription =
  "From personalized consultations and meal plans to corporate wellness training and health education, Linda Chikaodi Austin helps people understand their health and turn knowledge into practical, sustainable action.";

/* Stable @id anchors so the graph nodes can reference each other. */
const BUSINESS_ID = `${siteUrl}/#business`;
const PERSON_ID = `${siteUrl}/#linda`;
const WEBSITE_ID = `${siteUrl}/#website`;

const socialProfiles = Object.values(socialLinks);

/* "+234 7079438493" -> "+2347079438493" (E.164). */
const telephone = `+${contact.phone.replace(/[^\d]/g, "")}`;

/* Site-wide graph: the website, Linda (the Person people search for), and the
   practice as a local/medical business with hours, location and offers. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${siteUrl}/`,
        name: siteName,
        description: siteDescription,
        inLanguage: "en",
        publisher: { "@id": BUSINESS_ID },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: siteName,
        jobTitle: "Certified Clinical Nutritionist & Health Consultant",
        description: aboutSummary[0],
        url: `${siteUrl}/about`,
        image: `${siteUrl}/images/linda-avatar.jpg`,
        sameAs: socialProfiles,
        worksFor: { "@id": BUSINESS_ID },
      },
      {
        "@type": ["MedicalBusiness", "LocalBusiness"],
        "@id": BUSINESS_ID,
        name: "Nutriticare — Linda Chikaodi Austin",
        legalName: "Nucle Limited",
        url: `${siteUrl}/`,
        image: `${siteUrl}/images/linda-avatar.jpg`,
        description: siteDescription,
        email: contact.email,
        telephone,
        founder: { "@id": PERSON_ID },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Gowon Estate, Egbeda",
          addressLocality: "Lagos",
          addressCountry: "NG",
        },
        areaServed: "NG",
        priceRange: "₦₦",
        sameAs: socialProfiles,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
            opens: "09:00",
            closes: "17:00",
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services & Pricing",
          itemListElement: services.map((s) => {
            const kobo = priceToKobo(s.price);
            const offer: Record<string, unknown> = {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: s.name,
                description: s.blurb,
                provider: { "@id": BUSINESS_ID },
              },
            };
            if (kobo) {
              offer.price = String(kobo / 100);
              offer.priceCurrency = "NGN";
            }
            return offer;
          }),
        },
      },
    ],
  };
}

/* FAQPage from the answered questions only (a null answer is still "copy
   pending" and must not be advertised to search engines as real content). */
export function faqJsonLd() {
  const answered = faq
    .flatMap((category) => category.questions)
    .filter((q): q is { q: string; answer: string } => Boolean(q.answer));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: answered.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}
