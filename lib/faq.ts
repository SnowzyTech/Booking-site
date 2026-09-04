/*
 * FAQ content, transcribed from _mockups/2x/faq.png.
 *
 * CONTENT GAP — the mockup shows most of the FAQ collapsed, so only the
 * questions below are actually legible in the design:
 *
 *   - "CONSULTATION & MEAL PLAN" and "SUPPORT & PRODUCTS" render collapsed;
 *     none of their questions appear anywhere in the exports.
 *   - Only one answer is expanded in the whole design (the referral question
 *     under GENERAL). Every other answer is unknown.
 *
 * Answers are marked `answer: null` where the real copy has not been supplied.
 * The UI renders those as an explicit "copy pending" state rather than inventing
 * health guidance. Fill these in from the source document and the state clears.
 */
export type FaqQuestion = { q: string; answer: string | null };
export type FaqCategory = { id: string; title: string; questions: FaqQuestion[] };

export const faq: FaqCategory[] = [
  {
    id: "general",
    title: "GENERAL",
    questions: [
      { q: "Who can book a consultation with Linda?", answer: null },
      {
        q: "Is the consultation only for people with health conditions?",
        answer: null,
      },
      {
        q: "Do I need a diagnosis or doctor's referral before booking?",
        answer:
          "No, You can book directly. You don't need a formal diagnosis to seek professional nutrition guidance.\nHowever, if you have a diagnosed medical condition or are currently receiving medical treatment, relevant medical information may be requested to help ensure your nutrition guidance is appropriate.",
      },
    ],
  },
  {
    // Collapsed in the mockup — questions not visible in any export.
    id: "consultation-meal-plan",
    title: "CONSULTATION & MEAL PLAN",
    questions: [],
  },
  {
    // Collapsed in the mockup — questions not visible in any export.
    id: "support-products",
    title: "SUPPORT & PRODUCTS",
    questions: [],
  },
  {
    id: "appointments",
    title: "APPOINTMENTS",
    questions: [
      { q: "Can I reschedule my appointment?", answer: null },
      {
        q: "What if I experience an unexpected change while following my meal plan?",
        answer: null,
      },
    ],
  },
  {
    id: "corporate-events",
    title: "CORPORATE & EVENTS",
    questions: [
      { q: "Does Linda offer corporate wellness training?", answer: null },
      { q: "Can I book Linda to speak or train at an event?", answer: null },
    ],
  },
];
