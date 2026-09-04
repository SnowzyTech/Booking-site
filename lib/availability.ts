import { addMinutes, format, getDay, startOfDay } from "date-fns";

/*
 * Availability rules.
 *
 * NOTE — the designs contradict each other on which weekdays are bookable:
 *   - Booking step 2 (MacBook Pro 14_ - 4.png):  "every Tuesday and Friday"
 *   - Footer (Frame 70.png):                     "Tuesdays and Thursdays"
 *
 * The calendar in the step-2 mockup enables 2, 4, 9, 11, 16, 18, 23, 25, 30
 * September 2026 — which are Tuesdays and Thursdays. The rendered calendar is
 * the more reliable signal than its own caption, so Tue/Thu is implemented here
 * and the step-2 caption is reproduced verbatim as designed. Flagged for the
 * client to resolve.
 */
export const AVAILABLE_WEEKDAYS = [2, 4]; // Tue, Thu

export const AVAILABILITY_NOTE =
  "Appointments are available every Tuesday and Friday, from 9:00 AM to 5:00 PM. Please schedule your appointment within these available days and hours.";

export const isDayAvailable = (d: Date) =>
  AVAILABLE_WEEKDAYS.includes(getDay(d));

/** 9:00 AM - 5:00 PM in 30-minute increments. */
export function timeSlots(day: Date = new Date()) {
  const base = startOfDay(day);
  return Array.from({ length: 17 }, (_, i) => {
    const t = addMinutes(base, 9 * 60 + i * 30);
    return { value: format(t, "h:mm a"), date: t };
  });
}

/** Slots shown as taken in the mockup (9:30 AM and 12:30 PM are dimmed). */
export const BOOKED_SLOTS = ["9:30 AM", "12:30 PM"];
