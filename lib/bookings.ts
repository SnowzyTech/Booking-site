/*
 * Admin dashboard fixtures. Names, services, dates and states are transcribed
 * from _mockups/2x/admin-list.png and the per-row exports (admin-row-*.png,
 * admin-expanded-*.png) so every state in the design is represented.
 */
export type BookingStatus = "pending" | "confirmed";
export type BookingKind = "one-off" | "programme" | "corporate";

export type Session = {
  label: string;
  title?: string;
  date?: string;
  time?: string;
  state: "done" | "active" | "upcoming";
};

export type Booking = {
  id: string;
  name: string;
  initial: string;
  avatarTone: string;
  service: string;
  kind: BookingKind;
  status: BookingStatus;
  isNew: boolean;
  day: string;
  nextLabel: string;
  nextValue: string;
  progress?: { total: number; done: number };
  contact: {
    whatsapp: string;
    phone: string;
    email: string;
    address: string;
  };
  sessions?: Session[];
  deliverables?: string[];
  /** One-off bookings carry a single appointment slot (Frame 134 / 204). */
  slot?: { date: string; time: string; short: string };
};

const contactA = {
  whatsapp: "+234 801 234 5678",
  phone: "+234 701 345 6789",
  email: "adewale.ola@example.com",
  address: "14 Allen Avenue, Ikeja, Lagos",
};

export const bookings: Booking[] = [
  {
    id: "elizabeth-ifeoluwa",
    name: "Elizabeth Ifeoluwa",
    initial: "E",
    avatarTone: "bg-[#f3d9ff] text-[#7b3fa0]",
    service: "Meal Plan Program",
    kind: "programme",
    status: "pending",
    isNew: true,
    day: "Tuesday 1",
    nextLabel: "Next Appointment",
    nextValue: "1 Tuesday",
    progress: { total: 4, done: 1 },
    contact: contactA,
    deliverables: ["Personalized Meal Plan", "Daily Blood Sugar Tracking Sheet"],
    sessions: [
      { label: "WEEK 1", title: "Initial Consultation", date: "1 Tue. Sept. 2026", time: "11:00 AM", state: "active" },
      { label: "WEEK 2", title: "Meal Plan Guide & Q&A Session", date: "8 Tue. Sept. 2026", state: "upcoming" },
      { label: "WEEK 4", title: "Two-Week Follow up", date: "23 Tue. Sept. 2026", state: "upcoming" },
      { label: "WEEK 6", title: "One Month Follow up", date: "13 Tue. Oct. 2026", state: "upcoming" },
    ],
  },
  {
    id: "david-obi",
    name: "David Obi",
    initial: "D",
    avatarTone: "bg-[#d9f5df] text-[#2f7d4a]",
    service: "Meal Plan Program",
    kind: "programme",
    status: "confirmed",
    isNew: true,
    day: "Tuesday 1",
    nextLabel: "Next Appointment",
    nextValue: "1 Tuesday",
    progress: { total: 4, done: 0 },
    contact: contactA,
    sessions: [
      { label: "WEEK 1", title: "Initial Consultation", date: "1 Tue. Sept. 2026", time: "11:00 AM", state: "active" },
      { label: "WEEK 2", title: "Meal Plan Guide & Q&A Session", date: "8 Tue. Sept. 2026", state: "upcoming" },
      { label: "WEEK 4", title: "Two-Week Follow up", date: "23 Tue. Sept. 2026", state: "upcoming" },
      { label: "WEEK 6", title: "One Month Follow up", date: "13 Tue. Oct. 2026", state: "upcoming" },
    ],
  },
  {
    id: "folasade-balogun",
    name: "Folasade Balogun",
    initial: "F",
    avatarTone: "bg-[#ff9b52] text-white",
    service: "Consultation",
    kind: "one-off",
    status: "confirmed",
    isNew: false,
    day: "Tuesday 1",
    nextLabel: "One - Off",
    nextValue: "1 Tue Sept",
    contact: contactA,
    slot: { date: "1 Tue. Sept. 2026", time: "11:00 AM", short: "Sept 1" },
  },
  {
    id: "strava-ltd",
    name: "Strava Ltd",
    initial: "Z",
    avatarTone: "bg-[#7a6a80] text-white",
    service: "Corporate Wellness Package",
    kind: "corporate",
    status: "confirmed",
    isNew: true,
    day: "Tuesday 1",
    nextLabel: "Appointment",
    nextValue: "10 Tue - 14 Sat",
    progress: { total: 2, done: 0 },
    contact: {
      ...contactA,
      email: "Strava.ng@run.com",
      address: "14 Moshoos VI, Lagos",
    },
    sessions: [
      { label: "Day 1", date: "1 Tue. Sept. 2026", time: "11:00 AM", state: "active" },
      { label: "Day 2", date: "8 Tue. Sept. 2026", time: "11:00 AM", state: "upcoming" },
      { label: "Day 3", date: "8 Tue. Sept. 2026", time: "11:00 AM", state: "upcoming" },
      { label: "Day 4", date: "8 Tue. Sept. 2026", time: "11:00 AM", state: "upcoming" },
      { label: "Day 5", date: "8 Tue. Sept. 2026", time: "11:00 AM", state: "upcoming" },
    ],
  },
  {
    id: "obinna-chukwu",
    name: "Obinna Chukwu",
    initial: "F",
    avatarTone: "bg-[#d9f5df] text-[#2f7d4a]",
    service: "Health & Nutrition Training",
    kind: "programme",
    status: "confirmed",
    isNew: false,
    day: "Tuesday 1",
    nextLabel: "Appointment",
    nextValue: "9 Mon - 14 Sat",
    progress: { total: 4, done: 1 },
    contact: contactA,
  },
  {
    id: "zainab-abdullahi",
    name: "Zainab Abdullahi",
    initial: "Z",
    avatarTone: "bg-[#7a6a80] text-white",
    service: "Meal Plan Program",
    kind: "programme",
    status: "confirmed",
    isNew: false,
    day: "Tuesday 1",
    nextLabel: "Next Appointment",
    nextValue: "10 Tuesday",
    progress: { total: 4, done: 2 },
    contact: contactA,
  },
  {
    id: "yusuf-mohammed",
    name: "Yusuf Mohammed",
    initial: "E",
    avatarTone: "bg-[#f3d9ff] text-[#7b3fa0]",
    service: "Consultation",
    kind: "one-off",
    status: "pending",
    isNew: true,
    day: "Thursday 3",
    nextLabel: "",
    nextValue: "One-off",
    contact: contactA,
    slot: { date: "1 Tue. Sept. 2026", time: "11:00 AM", short: "Sept 1" },
  },
  {
    id: "femi-afolayan",
    name: "Femi Afolayan",
    initial: "E",
    avatarTone: "bg-[#f3d9ff] text-[#7b3fa0]",
    service: "Meal Plan Program",
    kind: "programme",
    status: "pending",
    isNew: true,
    day: "Thursday 3",
    nextLabel: "",
    nextValue: "One-off",
    contact: contactA,
    sessions: [],
  },
  {
    id: "emeka-nwosu",
    name: "Emeka Nwosu",
    initial: "F",
    avatarTone: "bg-[#ff9b52] text-white",
    service: "Consultation",
    kind: "one-off",
    status: "confirmed",
    isNew: false,
    day: "Thursday 18",
    nextLabel: "",
    nextValue: "One-off",
    contact: contactA,
    slot: { date: "18 Thu. Sept. 2026", time: "11:00 AM", short: "Sept 18" },
  },
];

/** Day-strip counts, matching the badges in the mockup. */
export const dayCounts: Record<number, number> = {
  1: 4, 3: 2, 10: 1, 18: 1, 23: 2, 25: 2, 29: 2, 30: 2,
};

export const PENDING_SUMMARY = {
  count: 12,
  through: "20 September 2026",
};

export const serviceFilters = [
  "Meal Plan",
  "Consultation",
  "Corporate Wellness Package",
  "Health & Nutrition Training",
];

/** Bookings grouped by their day heading, in mockup order. */
export function groupedByDay() {
  const order: string[] = [];
  const map = new Map<string, Booking[]>();
  for (const b of bookings) {
    if (!map.has(b.day)) {
      map.set(b.day, []);
      order.push(b.day);
    }
    map.get(b.day)!.push(b);
  }
  return order.map((day) => ({ day, items: map.get(day)! }));
}
