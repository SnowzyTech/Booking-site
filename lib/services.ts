/*
 * Service catalogue. Copy, pricing and CTA labels transcribed verbatim from
 * _mockups/2x/services.png and the per-service cards (card-*.png).
 *
 * `flow` drives which booking journey a service enters — see lib/booking-flow.ts:
 *   "scheduled" -> 4 steps, ending at bank transfer  (MacBook Pro 14_ - 2/3/4/5)
 *   "assisted"  -> 2 steps, ending at a WhatsApp hand-off to the Team (MacBook 8)
 */
export type ServiceFlow = "scheduled" | "assisted";
/** Booking shape: a single appointment, a multi-week programme, or a
 *  multi-day corporate package. Drives how many appointments a booking creates. */
export type ServiceKind = "one-off" | "programme" | "corporate";

export type Service = {
  slug: string;
  name: string;
  tag?: string;
  listPrice?: string;
  price?: string;
  priceEmphasis?: "chip" | "plain";
  blurb: string;
  bullets: string[];
  extra?: string;
  cta: string;
  /** Every entry is "pill" — the mockups varied this per card (dark/soft), but
   *  the owner asked for every Services-section CTA in the same brand purple.
   *  The wider type is kept in case a future card needs to break the pattern. */
  ctaVariant: "pill" | "dark" | "soft";
  /** Undefined until a real photograph is supplied; renders the
   *  #D9D9D9 placeholder block the mockups show. */
  image?: string;
  /** CSS aspect-ratio ("width / height") matching the photo's own dimensions,
   *  so the frame never crops it — falls back to the mockup's 537:249 box
   *  when unset (the placeholder, and any photo before this is measured). */
  imageAspect?: string;
  flow: ServiceFlow;
  kind: ServiceKind;
  /** Programme deliverables, shown in the admin timeline (Frame 207). */
  deliverables?: string[];
  /** Session template used by the admin dashboard timeline. */
  sessions?: { label: string; title: string; week?: string }[];
};

export const services: Service[] = [
  {
    slug: "individual-consultation",
    name: "Individual Health & Nutrition Consultation",
    tag: "One-Off Session",
    listPrice: "N80,000",
    price: "N65,000",
    priceEmphasis: "chip",
    blurb:
      "A one-time 30 minutes consultation to discuss your health history, current blood sugar levels, and nutrition concerns. Ideal if you want expert advice without committing to a full plan.",
    bullets: [
      "30-minute one-on-one session with Linda",
      "Personalized nutrition guidance",
      "Answers to your specific questions",
    ],
    cta: "Book a Consultation",
    ctaVariant: "pill",
    image: "/images/service-consultation.jpg",
    imageAspect: "6000 / 3368",
    flow: "scheduled",
    kind: "one-off",
  },
  {
    slug: "personalized-meal-plans",
    name: "Personalized Meal Plans",
    tag: "3 - Months Program",
    listPrice: "N150,000",
    price: "N120,000",
    priceEmphasis: "chip",
    blurb:
      "Tailored meal plans for a range of health and lifestyle goals, including metabolic health management (Diabetes, High blood pressure, Cholesterol), weight loss, healthy living, and improved nutrition.",
    bullets: [
      "Consultation / dietary assessment",
      "30-day meal plan (valid for 3 months)",
      "Blood sugar tracking sheet",
      "Meal plan guide session(walkthrough of how to follow your plan)",
      "Ongoing support throughout the program",
    ],
    cta: "Start Your Journey",
    ctaVariant: "pill",
    image: "/images/service-meal-plan.jpg",
    imageAspect: "2160 / 1440",
    flow: "scheduled",
    kind: "programme",
    deliverables: ["Personalized Meal Plan", "Daily Blood Sugar Tracking Sheet"],
    sessions: [
      { label: "WEEK 1", week: "WEEK 1", title: "Initial Consultation" },
      { label: "WEEK 2", week: "WEEK 2", title: "Meal Plan Guide & Q&A Session" },
      { label: "WEEK 4", week: "WEEK 4", title: "Two-Week Follow up" },
      { label: "WEEK 6", week: "WEEK 6", title: "One Month Follow up" },
    ],
  },
  {
    slug: "corporate-wellness",
    name: "Corporate Wellness Package",
    blurb:
      "Practical nutrition and wellness training designed to help employees build healthier habits, improve their understanding of health, and create a healthier workplace culture.",
    bullets: [],
    cta: "Start Your Journey",
    ctaVariant: "pill",
    flow: "assisted",
    kind: "corporate",
    sessions: [
      { label: "Day 1", title: "Day 1" },
      { label: "Day 2", title: "Day 2" },
      { label: "Day 3", title: "Day 3" },
      { label: "Day 4", title: "Day 4" },
      { label: "Day 5", title: "Day 5" },
    ],
  },
  {
    slug: "events-training",
    name: "Health & Nutrition Training for Events",
    // Pricing appears only in the per-card export (card-events.png / Frame 182);
    // the full-page mockup omits it.
    listPrice: "N1,500,000",
    price: "#1,000,000/1hr30min",
    priceEmphasis: "chip",
    blurb:
      "Interactive and engaging health education sessions for conferences, workshops, organizations, communities, and special events.",
    bullets: [],
    cta: "Book Training",
    ctaVariant: "pill",
    image: "/images/service-events.jpg",
    imageAspect: "1102 / 506",
    flow: "assisted",
    kind: "corporate",
  },
  {
    slug: "one-on-one-premium",
    name: "One on One Premium work with me",
    listPrice: "N150,000",
    price: "#265,500/month",
    priceEmphasis: "chip",
    blurb:
      "A premium experience for individuals who want to work closely with Linda to understand their health, transform their nutrition, and build sustainable lifestyle habits with personalized guidance and accountability.",
    bullets: [],
    extra:
      "Includes Comprehensive Health & Nutrition Assessment, Personalized Health Strategy, Personalized Meal Plan, Direct One-on-One Sessions with Linda, Ongoing Accountability, Progress Monitoring, Adjustments and Priority Communication",
    cta: "Start Your Journey",
    ctaVariant: "pill",
    image: "/images/service-premium.jpg",
    imageAspect: "1100 / 520",
    // WhatsApp hand-off like Corporate/Events; managed from the Clients page
    // rather than the appointments dashboard.
    flow: "assisted",
    kind: "programme",
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

/** The one service that is managed from /admin/clients rather than the
 *  appointments board: it is billed monthly and arranged over WhatsApp. */
export const PREMIUM_SLUG = "one-on-one-premium";

/** Corporate Wellness and Events Training: arranged over WhatsApp like Premium,
 *  but the wizard collects the event brief first (/book/enquiry) so the Team
 *  isn't starting from a cold message. Premium is `kind: "programme"`, which is
 *  what keeps it out. */
export const needsEnquiry = (s: Service) =>
  s.flow === "assisted" && s.kind === "corporate";

/** Which wizard step a service's CTA drops the visitor into. Everything but
 *  Premium now starts at the calendar — the flows only diverge after it. */
export const bookingEntryPath = (s: Service) =>
  s.flow === "scheduled" || needsEnquiry(s) ? "/book/schedule" : "/book/assisted";

/**
 * A catalogue `price` string (e.g. "N65,000", "#265,500/month") as an integer
 * number of *kobo* — the unit Paystack charges in (₦1 = 100 kobo; integer money
 * avoids floating-point rounding). The prices are hand-written display strings,
 * so we read only the leading amount: everything up to the first "/" (dropping a
 * "/month" or "/1hr30min" suffix), with the currency mark and thousands
 * separators stripped. Returns null when there is no usable amount, so a caller
 * can refuse to start a payment rather than charge ₦0.
 *
 * Only the two `flow: "scheduled"` services reach this — Paystack checkout lives
 * on /book/payment; the assisted services are arranged over WhatsApp.
 */
export function priceToKobo(price?: string): number | null {
  if (!price) return null;
  const digits = price.split("/")[0].replace(/[^\d]/g, "");
  if (!digits) return null;
  const naira = parseInt(digits, 10);
  if (!Number.isFinite(naira) || naira <= 0) return null;
  return naira * 100;
}
