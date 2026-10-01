/* Site chrome: nav, footer, contact and payment details.
   Transcribed from _mockups/2x/navbar.png, footer.png and payment-bank.png. */

/* Root-relative anchors, not bare hashes: this list also renders on /contact,
   where "#about" would resolve against that page instead of the landing one. */
export const nav = [
  { label: "Home", href: "/#home" },
  { label: "About Linda", href: "/#about" },
  { label: "Services & Pricing", href: "/#services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contacts", href: "/contact" },
];

export const contact = {
  email: "nucle.ltd@gmail.com",
  phone: "+234 7079438493",
  whatsapp: "07079438493",
  address: "Gowon Estate, Egbeda, Lagos, Nigeria.",
};

/* wa.me deep link for `contact.whatsapp`. The number is stored in local format
   ("070…"), so the leading 0 is swapped for the +234 country code. Pass a
   message to open the chat with it pre-filled. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/234${contact.whatsapp.replace(/^0/, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const socialLinks = {
  instagram: "https://www.instagram.com/lindachikaodi?igsi=NmJ5Ym0yMXJ0Y3g=",
  facebook: "https://www.facebook.com/share/17tQcvryUY/",
  tiktok: "https://www.tiktok.com/@lindachikaodiaustin?_r=1&_t=ZS-994SL5AUXPm",
  linkedin:
    "https://www.linkedin.com/in/linda-chikaodi-austin-873b15126?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  x: "https://x.com/lindachikaodi",
};

export const bank = {
  accountNumber: "1311973427",
  accountName: "NUCLE LIMITED",
  bank: "Zenith bank",
};

/* Health & nutrition intake Google Form. Shown to an individual client on both
   payment confirmations (the Paystack success page and the bank-transfer one,
   via <IntakeFormPrompt>) and in the card payer's receipt e-mail, so the Team
   can build the best plan — it replaces the old "we WhatsApp you the link"
   step. */
export const intakeFormUrl = "https://forms.gle/84NgCzu6th2uVnvF6";

export const businessHours = {
  hours: "9am-5pm",
  note: "Please note: Our business hours are Monday to Friday, but appointments can only be booked for Tuesdays and Fridays.",
};

/* Footer link. `href` is an external product/programme page opened in a new
   tab; entries without one render as plain text until a URL is supplied. */
export type FooterLink = { label: string; href?: string };

export const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Products",
    links: [
      { label: "Fonio Mill" },
      {
        label: "El-Mana Mixed Spice",
        href: "https://globeherb.com/c/elmana-spice/",
      },
      { label: "Neuro-Vive Balm", href: "https://vitaafri.com/c/neuro-balm-1/" },
      { label: "Niver Mor" },
    ],
  },
  {
    title: "Programmes",
    links: [
      { label: "Crush Your Sugar Academy", href: "https://crushyoursugar.com/" },
      { label: "The Recovery Room", href: "https://mynucle.com/c/recovery-r/" },
      { label: "Founder Parley Podcast" },
    ],
  },
];

/* Contact section copy. The Figma export has no contact frame — the nav's
   "Contacts" link pointed straight at the footer — so this band follows the
   house layout of the other sections. Topics mirror `lib/services.ts` plus a
   general option; they only label the composed message. */
export const contactCopy = {
  headingLead: "Still Have Questions? ",
  headingAccent: "Let's Talk",
  intro:
    "Ask about a consultation, a personalized meal plan, corporate wellness training or an upcoming event. WhatsApp is the fastest way to reach us, and messages are answered within business hours.",
  /* The landing band only teases the form; it lives on /contact. */
  teaserTitle: "Send a message",
  teaserBody:
    "Tell us what you need help with and we will come back to you with the right next step, whether that's a consultation, a meal plan or a training date.",
  teaserCta: "Go to the contact form",
  /* /contact */
  pageEyebrow: "Contact Us",
  pageTitle: "Send a message",
  pageIntro:
    "Fill in the form and we will get back to you within business hours. For anything urgent, the WhatsApp number is the fastest way to reach the team.",
  formTitle: "Send a message",
  formNote:
    "This form opens WhatsApp or your mail app with the message filled in. Nothing is stored on this site.",
};

export const contactTopics = [
  "General enquiry",
  "Individual consultation",
  "Personalized meal plan",
  "One on One Premium",
  "Corporate wellness",
  "Events & training",
];

export const howItWorks = [
  {
    step: "1",
    title: "BOOK",
    lines: ["Choose Your Service", "Select the service that best fits your needs."],
  },
  {
    step: "2",
    title: "TELL US ABOUT YOU",
    lines: [
      "Complete Your Health Assessment. Share relevant information about your health, lifestyle, goals and concerns.",
    ],
  },
  {
    step: "3",
    title: "GET YOUR PLAN",
    lines: [
      "Consultation & Recommendations Receive personalized guidance and practical recommendations based on your needs.",
    ],
  },
  {
    step: "4",
    title: "MOVE FORWARD",
    lines: [
      "Support & Follow-Up. Receive the guidance, resources and follow-up included with your selected service.",
    ],
  },
];

/* The landing page's About band is a short summary that hands off to /about,
   where the full biography below is told in chapters. The summary is condensed
   from the same copy — nothing in it is new information. */
export const aboutSummary = [
  "Linda Chikaodi Austin is a Certified Clinical Nutritionist, Health Consultant, and the CEO of Nucle Limited and its subsidiary, Nutriticare. She is also the Lead Consultant behind the Crush Your Sugar Challenge, which more than 6,000 people have taken part in.",
  "Her approach is practical and personal: evidence based nutrition, culturally relevant food guidance, and counselling that fit your lifestyle, your health needs, and your goals.",
];

export const aboutStoryCta = "Full Story";

export const aboutPageCopy = {
  eyebrow: "About Linda",
  title: "Meet Linda Chikaodi Austin",
  intro:
    "Certified Clinical Nutritionist, Health Consultant, and CEO of Nucle Limited and Nutriticare.",
};

/* /about, one entry per chapter. `image` is optional — a chapter without one
   runs as a single text column. `stat` renders as a highlighted figure. */
export type StoryChapter = {
  title: string;
  paragraphs: string[];
  image?: { src: string; alt: string };
  stat?: { value: string; label: string };
};

export const aboutStory: StoryChapter[] = [
  {
    title: "Who She Is",
    image: {
      src: "/images/individual-heal.jpeg",
      alt: "Linda Chikaodi Austin working at her desk",
    },
    paragraphs: [
      "Linda Chikaodi Austin is a Certified Clinical Nutritionist, Health Consultant, and the visionary CEO of Nucle Limited and its subsidiary, Nutriticare.",
      "She is also the Lead Consultant behind the Crush Your Sugar Challenge, a practical health education programme focused on helping people better understand and improve their metabolic health through nutrition, lifestyle, and consistent support.",
    ],
  },
  {
    title: "Her Approach",
    image: {
      src: "/images/one-on-one.jpg",
      alt: "Linda Chikaodi Austin in a consultation with a client",
    },
    paragraphs: [
      "With experience working across metabolic health, nutrition, weight management, and healthy living, Linda takes a holistic and practical approach to helping individuals make better health decisions.",
      "Linda understands that healthy living is not about following a generic diet or eliminating everything you enjoy. It is about understanding your body's needs, making informed choices, and developing habits that can realistically become part of your everyday life.",
      "She combines evidence based nutrition, culturally relevant food guidance, behavioural coaching, and personalized counselling to create practical solutions that work within each individual's lifestyle, preferences, health needs, and goals.",
    ],
  },
  {
    title: "Who She Helps",
    paragraphs: [
      "Her work extends beyond managing specific health conditions. She supports individuals who want to improve their eating habits, lose weight, manage metabolic health concerns, prevent nutrition-related health challenges, or simply learn how to eat and live healthier.",
      "Whether you are looking to manage a health condition, lose weight, improve your metabolic health, eat healthier, or equip your team with practical health knowledge, Linda's approach is centred on giving you clarity, practical direction, and strategies you can actually implement.",
    ],
  },
  {
    title: "Her Impact",
    image: {
      src: "/images/training-1.jpeg",
      alt: "Linda Chikaodi Austin speaking at The Recovery Room",
    },
    stat: {
      value: "6,000+",
      label: "people have participated in the Crush Your Sugar Challenge",
    },
    paragraphs: [
      "Through the Crush Your Sugar Challenge, The Recovery Room, and other health initiatives, Linda has reached thousands of people with practical, science driven health education. Participants report measurable improvements in their blood sugar management and overall health behaviours.",
      "Beyond one-on-one consultations, Linda also works with organisations, companies, and event audiences, delivering engaging health and nutrition training designed to make healthy living easier to understand and apply.",
    ],
  },
];

export const aboutBelief = {
  lead: "Her work is built on a simple belief:",
  quote:
    "People deserve to understand their health and have the knowledge, tools, and support to take ownership of it.",
  tagline: "Your health is personal. Your nutrition should be too.",
};

export const aboutClosing =
  "Book a consultation, personalized meal plan, corporate wellness training, or health education session with Linda today.";
