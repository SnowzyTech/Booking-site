/*
 * Service catalogue. Copy, pricing and CTA labels transcribed verbatim from
 * _mockups/2x/services.png and the per-service cards (card-*.png).
 *
 * `flow` drives which booking journey a service enters — see lib/booking-flow.ts:
 *   "scheduled" -> 4 steps, ending at bank transfer  (MacBook Pro 14_ - 2/3/4/5)
 *   "assisted"  -> 2 steps, ending at a WhatsApp hand-off to the EA (MacBook 8)
 */
export type ServiceFlow = "scheduled" | "assisted";

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
  ctaVariant: "pill" | "dark" | "soft";
  /** Undefined until a real photograph is supplied; renders the
   *  #D9D9D9 placeholder block the mockups show. */
  image?: string;
  flow: ServiceFlow;
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
    flow: "scheduled",
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
    ctaVariant: "dark",
    flow: "scheduled",
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
    ctaVariant: "soft",
    flow: "assisted",
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
    ctaVariant: "soft",
    image: "/images/service-events.jpg",
    flow: "assisted",
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
    ctaVariant: "soft",
    image: "/images/service-premium.jpg",
    flow: "scheduled",
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);
