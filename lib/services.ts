/*
 * Service catalogue. Copy, pricing and CTA labels transcribed verbatim from
 * _mockups/2x/services.png and the per-service cards (card-*.png).
 *
 * `flow` and `kind` together decide which booking journey a service enters.
 * Every service now ends at the payment step; what differs is what is collected
 * on the way (see needsSchedule / needsEnquiry below):
 *   "scheduled"            -> 4 steps: calendar, contact, payment
 *                             (MacBook Pro 14_ - 2/3/4/5)
 *   "assisted" + corporate -> 5 steps: the above with the event brief after the
 *                             calendar
 *   "assisted" + programme -> 3 steps: no calendar at all (Premium)
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
  /** Extra frames of the same subject. When a service has more than one, the
   *  Services section cross-fades through them instead of showing a still;
   *  every other surface (booking cards, admin dialogs) keeps `image`, so the
   *  first entry should be the same photo. They share one frame, so they must
   *  share `imageAspect` too. */
  images?: string[];
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
    image: "/images/individual-heal.jpeg",
    imageAspect: "2752 / 1536",
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
    image: "/images/corp1.jpeg",
    images: ["/images/corp1.jpeg", "/images/corp2.jpeg"],
    imageAspect: "2400 / 1792",
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
    /* The banner crop the site launched with, plus three frames from the same
       room. They share one frame, so it takes the 3:2 the three new photos were
       shot at and the wider banner centre-crops into it. */
    images: [
      "/images/service-events.jpg",
      "/images/training-1.jpeg",
      "/images/training-2.jpeg",
      "/images/training-3.jpeg",
    ],
    imageAspect: "3 / 2",
    flow: "assisted",
    kind: "corporate",
  },
  {
    slug: "one-on-one-premium",
    name: "One on One Premium work with me",
    // The mockup struck through N150,000, below the N265,500 being charged —
    // a crossed-out price has to be the higher one or the card reads as a
    // price rise. Raised to N300,000 on the owner's instruction.
    listPrice: "N300,000",
    price: "#265,500/month",
    priceEmphasis: "chip",
    blurb:
      "A premium experience for individuals who want to work closely with Linda to understand their health, transform their nutrition, and build sustainable lifestyle habits with personalized guidance and accountability.",
    bullets: [],
    extra:
      "Includes Comprehensive Health & Nutrition Assessment, Personalized Health Strategy, Personalized Meal Plan, Direct One-on-One Sessions with Linda, Ongoing Accountability, Progress Monitoring, Adjustments and Priority Communication",
    cta: "Start Your Journey",
    ctaVariant: "pill",
    image: "/images/one-on-one.jpg",
    imageAspect: "2757 / 2426",
    // "assisted" + "programme" is what needsSchedule() reads to skip the
    // calendar: a monthly engagement has no slot to pick. It still pays through
    // /book/payment like everything else, and is managed from the Clients page
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

/** The individual plans whose paying customer fills the health & nutrition
 *  intake form after paying (the two individual plans plus Premium). Corporate
 *  Wellness / Events Training are excluded — that intake is for one person. */
const INTAKE_FORM_SLUGS: string[] = [
  "individual-consultation",
  "personalized-meal-plans",
  PREMIUM_SLUG,
];

export const needsIntakeForm = (slug: string) => INTAKE_FORM_SLUGS.includes(slug);

/** Corporate Wellness and Events Training: arranged over WhatsApp like Premium,
 *  but the wizard collects the event brief first (/book/enquiry) so the Team
 *  isn't starting from a cold message. Premium is `kind: "programme"`, which is
 *  what keeps it out. */
export const needsEnquiry = (s: Service) =>
  s.flow === "assisted" && s.kind === "corporate";

/**
 * Does this service pick a slot on the calendar?
 *
 * Everything does except One-on-One Premium: it is a monthly engagement, not a
 * meeting, so there is nothing to put on a calendar at booking time — the
 * sessions inside the month are arranged afterwards. It still pays like every
 * other service, so its booking is written with an Appointment whose
 * `scheduledAt` is null (the schema already allows that) and it surfaces on
 * /admin/clients rather than the appointments board.
 */
export const needsSchedule = (s: Service) =>
  s.flow === "scheduled" || needsEnquiry(s);

/** Which wizard step a service's CTA drops the visitor into: the calendar, or
 *  straight to the contact form for the one service that skips it. */
export const bookingEntryPath = (s: Service) =>
  needsSchedule(s) ? "/book/schedule" : "/book/details";

/**
 * A catalogue `price` string (e.g. "N65,000", "#265,500/month") as an integer
 * number of *kobo* — the unit Paystack charges in (₦1 = 100 kobo; integer money
 * avoids floating-point rounding). The prices are hand-written display strings,
 * so we read only the leading amount: everything up to the first "/" (dropping a
 * "/month" or "/1hr30min" suffix), with the currency mark and thousands
 * separators stripped. Returns null when there is no usable amount, so a caller
 * can refuse to start a payment rather than charge ₦0.
 *
 * Every service that reaches /book/payment can call this. Corporate Wellness is
 * the one with no catalogue `price`, so it gets null back and card checkout is
 * refused for it — bank transfer still works.
 */
export function priceToKobo(price?: string): number | null {
  if (!price) return null;
  const digits = price.split("/")[0].replace(/[^\d]/g, "");
  if (!digits) return null;
  const naira = parseInt(digits, 10);
  if (!Number.isFinite(naira) || naira <= 0) return null;
  return naira * 100;
}
