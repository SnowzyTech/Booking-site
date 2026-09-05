import { addMinutes, format, getDay, parse, startOfDay } from "date-fns";

/*
 * Availability rules.
 *
 * The mockups contradicted each other on bookable weekdays (step 2 caption said
 * "Tuesday and Friday"; the footer said "Tuesdays and Thursdays"). The client
 * resolved this: appointments are bookable on Tuesdays and Fridays.
 */
export const AVAILABLE_WEEKDAYS = [2, 5]; // Tue, Fri

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

/*
 * A booked slot is identified by the exact instant it occupies. We encode the
 * chosen calendar day + slot label ("11:00 AM") as a UTC wall-clock instant so
 * slot identity is stable regardless of the server's timezone: 11:00 AM on the
 * 1st is always `...T11:00:00.000Z`, whatever machine reads it back. The app is
 * single-timezone (Nigeria), so we never convert — we just pin the wall clock.
 */
export function toSlotInstant(day: Date, timeLabel: string): Date {
  const t = parse(timeLabel, "h:mm a", startOfDay(day));
  return new Date(
    Date.UTC(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      t.getHours(),
      t.getMinutes(),
      0,
      0
    )
  );
}
