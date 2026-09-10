/*
 * FAQ content, transcribed from _mockups/2x/faq.png and completed with the
 * copy supplied by the client. All five categories now carry their real
 * questions and answers; nothing is left in the "copy pending" state.
 *
 * Answers may contain "\n\n" for paragraph breaks — the UI renders them with
 * `whitespace-pre-line` (see components/sections/faq.tsx).
 */
export type FaqQuestion = { q: string; answer: string | null };
export type FaqCategory = { id: string; title: string; questions: FaqQuestion[] };

export const faq: FaqCategory[] = [
  {
    id: "general",
    title: "GENERAL QUESTIONS",
    questions: [
      {
        q: "Who can book a consultation with Linda?",
        answer:
          "Anyone looking for professional nutrition and health guidance can book. This includes people managing health conditions like diabetes, hypertension or cholesterol, people looking to lose or manage weight, individuals seeking to improve their eating habits, and those who simply want to live healthier.",
      },
      {
        q: "Do I need a diagnosis or doctor's referral before booking?",
        answer:
          "No, You can book directly. You don't need a formal diagnosis to seek professional nutrition guidance.\n\nHowever, if you have a diagnosed medical condition or are currently receiving medical treatment, relevant medical information may be requested to help ensure your nutrition guidance is appropriate.",
      },
      {
        q: "Is the consultation only for people with health conditions?",
        answer:
          "No, You can book even if you are generally healthy and simply want to improve your nutrition, manage your weight, build healthier eating habits, or take a more proactive approach to your health.",
      },
    ],
  },
  {
    id: "consultation-meal-plan",
    title: "CONSULTATION & MEAL PLAN",
    questions: [
      {
        q: "What happens during the consultation?",
        answer:
          "Linda will review relevant information about your health, dietary habits, lifestyle, goals, and concerns. The session is designed to help you understand your nutritional needs and receive practical, personalized guidance.",
      },
      {
        q: "Does every consultation include a meal plan?",
        answer:
          "Not necessarily. A consultation and a personalized meal plan are separate services. If you book the meal plan service, your consultation/assessment provides the information needed to create a meal plan specifically for you.",
      },
      {
        q: "How is my meal plan created?",
        answer:
          "Your meal plan is developed after a detailed dietary assessment. Information about your health needs, food preferences, allergies, dislikes, lifestyle, routine, and goals is considered so that your plan is practical and personalized not a generic diet template.",
      },
      {
        q: "Will I have to stop eating the foods I love?",
        answer:
          "Not necessarily. The goal is not to give you a list of foods you can never eat again. Your meal plan is designed around your individual needs while considering the foods you enjoy, your preferences, and what is realistic for your lifestyle. Where appropriate, you'll also receive guidance on portions, preparation, combinations, and healthier ways to incorporate familiar foods.",
      },
      {
        q: "When will I receive my meal plan?",
        answer:
          "Your personalized meal plan will be delivered one week after your initial dietary assessment, giving time to carefully review your information and develop your plan.",
      },
      {
        q: "What happens after I receive my meal plan?",
        answer:
          "You will have a follow-up session where the meal plan is explained to you, your questions are answered, and you are guided on how to implement it. Depending on your programme, you'll also have follow-up sessions to review your progress and experience.",
      },
    ],
  },
  {
    id: "support-products",
    title: "SUPPORT & PRODUCTS",
    questions: [
      {
        q: "Are the products compulsory?",
        answer:
          "No, any products recommended are optional and are intended to support your nutrition journey or make your meal plan easier to implement. Your consultation or meal plan is not dependent on purchasing additional products.",
      },
      {
        q: "Can I purchase products without booking a meal plan?",
        answer:
          "Yes, you can. Where products are recommended as part of your nutrition journey, appropriate guidance will be provided.",
      },
      {
        q: "Is the consultation/meal plan payment a one-time payment?",
        answer:
          "Yes, The payment covers the specific service you selected. Additional products are separate and optional. If you choose to subscribe to product support or purchase additional products, those will be charged separately according to the selected option.",
      },
    ],
  },
  {
    id: "appointments",
    title: "APPOINTMENTS",
    questions: [
      {
        q: "Can I reschedule my appointment?",
        answer:
          "Yes. You can reschedule provided you notify us at least 24 hours before your scheduled session. This allows us to adjust the schedule and make the appointment slot available to someone else. Requests made less than 24 hours before the appointment may not be accommodated.",
      },
      {
        q: "What if I experience an unexpected change while following my meal plan?",
        answer:
          "You can reach out through the designated communication channel if you have a question or notice a change you don't understand.",
      },
    ],
  },
  {
    id: "corporate-events",
    title: "CORPORATE & EVENTS",
    questions: [
      {
        q: "Does Linda offer corporate wellness training?",
        answer:
          "Yes. Linda provides health and nutrition training for organizations looking to equip their employees with practical knowledge around nutrition, healthy living, metabolic health, and wellness.",
      },
      {
        q: "Can I book Linda to speak or train at an event?",
        answer:
          "Yes. Linda is available for health and nutrition training at conferences, workshops, corporate events, community programmes, and other relevant events. Event and corporate bookings can be made through the appropriate enquiry option.",
      },
    ],
  },
];
