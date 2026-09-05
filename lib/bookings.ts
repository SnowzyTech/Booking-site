import { format, parse } from "date-fns";

/*
 * Shared admin-UI types and static filter labels.
 *
 * The booking data itself is no longer fixtures — it comes from the database
 * via lib/admin-data.ts (getAdminBookings), mapped into the `Booking` shape
 * below that the admin components render. Keeping these types here (free of any
 * Prisma import) lets both the server mapper and the client components share
 * them without pulling Prisma into the client bundle.
 */

export type BookingStatus = "pending" | "confirmed";
export type BookingKind = "one-off" | "programme" | "corporate";
/** New-order badge: red (pending), yellow (confirmed, not started), or hidden. */
export type BookingBadge = "new" | "confirmed" | "none";

export type Session = {
  /** Appointment id — lets the admin reschedule this specific session. */
  id: string;
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
  /** Catalogue slug — what the service dropdown filters on. */
  serviceSlug: string;
  /** Primary appointment day (yyyy-MM-dd) — drives month/day filtering + grouping. */
  dateKey: string;
  /** ISO creation timestamp — newest orders sort to the top of the board. */
  createdAt: string;
  kind: BookingKind;
  status: BookingStatus;
  badge: BookingBadge;
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
  slot?: { appointmentId: string; date: string; time: string; short: string };
};

export type DayGroup = { day: string; monthLabel: string; items: Booking[] };
export type PendingSummary = { count: number; through: string | null };
export type AdminData = {
  bookings: Booking[];
  pendingSummary: PendingSummary;
};

/** Service dropdown options. `all` shows everything; the rest match serviceSlug.
 *  One-on-One Premium is excluded — it lives on the (future) Clients page. */
export const SERVICE_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All Services" },
  { value: "personalized-meal-plans", label: "Meal Plan" },
  { value: "individual-consultation", label: "Consultation" },
  { value: "corporate-wellness", label: "Corporate Wellness Package" },
  { value: "events-training", label: "Health & Nutrition Training" },
];

/** Group a (already-filtered) list of bookings by day, chronologically. */
export function groupBookingsByDay(bookings: Booking[]): DayGroup[] {
  // Newest bookings first, so a freshly-placed order surfaces at the top.
  const sorted = [...bookings].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  const order: string[] = [];
  const map = new Map<string, DayGroup>();
  for (const b of sorted) {
    if (!map.has(b.dateKey)) {
      const d = parse(b.dateKey, "yyyy-MM-dd", new Date());
      map.set(b.dateKey, {
        day: format(d, "EEEE d"),
        monthLabel: format(d, "MMMM"),
        items: [],
      });
      order.push(b.dateKey);
    }
    map.get(b.dateKey)!.items.push(b);
  }
  return order.map((k) => map.get(k)!);
}
