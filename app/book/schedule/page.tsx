"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { useBooking } from "@/components/booking/booking-context";
import { TimeSlots } from "@/components/booking/time-slots";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Media } from "@/components/ui/media";
import {
  AVAILABILITY_NOTE,
  isDayAvailable,
  timeSlots,
  toSlotInstant,
} from "@/lib/availability";
import { getFullyBookedDays, getTakenSlots } from "@/lib/booking-actions";
import { cn } from "@/lib/utils";

/* Step 2 — date & time (MacBook Pro 14_ - 4.png). */
export default function SchedulePage() {
  const router = useRouter();
  const { service, date, setDate, time, setTime } = useBooking();
  const [month, setMonth] = React.useState(() => new Date(2026, 8, 1));
  const [navigating, startNavigation] = React.useTransition();
  const [takenLabels, setTakenLabels] = React.useState<string[]>([]);
  const [fullyBooked, setFullyBooked] = React.useState<Set<string>>(new Set());
  const timeRef = React.useRef<HTMLDivElement>(null);

  // On small screens the times reveal under the calendar once a day is picked;
  // bring them into view so the user never has to hunt for them. Desktop shows
  // the column beside the calendar, so no scroll is needed there (>= xl).
  React.useEffect(() => {
    if (!date) return;
    if (!window.matchMedia("(max-width: 1279px)").matches) return;
    timeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [date]);

  // Disable only days whose every hourly slot is already booked. A day with
  // some free slots stays selectable — its taken times grey out individually,
  // so a single booking never makes a whole day look unavailable.
  React.useEffect(() => {
    let active = true;
    getFullyBookedDays(format(month, "yyyy-MM")).then((days) => {
      if (active) setFullyBooked(new Set(days));
    });
    return () => {
      active = false;
    };
  }, [month]);

  // Load already-booked slots for the selected day and grey them out.
  React.useEffect(() => {
    if (!date) {
      setTakenLabels([]);
      return;
    }
    let active = true;
    getTakenSlots(format(date, "yyyy-MM-dd")).then((takenIso) => {
      if (!active) return;
      const taken = new Set(takenIso);
      const labels = timeSlots(date)
        .filter((s) => taken.has(toSlotInstant(date, s.value).toISOString()))
        .map((s) => s.value);
      setTakenLabels(labels);
      // If the slot the user had picked is now taken, clear it.
      if (time && labels.includes(time)) setTime("");
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div className="px-6 pb-32 pt-12 lg:pt-[74px]">
      <p className="text-center text-[13.5px] text-[#111]">
        {AVAILABILITY_NOTE}
      </p>

      <div className="mt-10 flex flex-col items-center gap-y-10 lg:mt-[70px] xl:flex-row xl:items-start xl:justify-center">
        <Calendar
          month={month}
          onMonthChange={setMonth}
          selected={date}
          onSelect={setDate}
          isDayAvailable={(d) =>
            isDayAvailable(d) && !fullyBooked.has(format(d, "yyyy-MM-dd"))
          }
          className="w-full max-w-[520px] shrink-0"
        />

        {/* Desktop: the tall slot column sits beside the calendar. */}
        <div className="hidden shrink-0 xl:ml-[37px] xl:block">
          <TimeSlots value={time} onChange={setTime} taken={takenLabels} />
        </div>

        {/* Mobile/tablet: times reveal as a compact chip grid under the calendar
            once a day is chosen, so the flow is pick-a-day → pick-a-time without
            a long scroll past a narrow column. */}
        {date && (
          <div
            ref={timeRef}
            className="w-full max-w-[520px] animate-in duration-[var(--dur-base)] ease-quart fade-in-0 slide-in-from-bottom-2 xl:hidden"
          >
            <h2 className="mb-3 text-[15px] font-semibold text-[#111]">
              Choose a time
            </h2>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {timeSlots(date).map((s) => {
                const booked = takenLabels.includes(s.value);
                const active = time === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    disabled={booked}
                    onClick={() => setTime(s.value)}
                    className={cn(
                      "h-[46px] rounded-lg text-[14px] transition-[background-color,color] duration-[var(--dur-fast)] ease-quart",
                      active
                        ? "bg-brand-deep font-medium text-white"
                        : booked
                          ? "cursor-default bg-slot-idle text-[#cfcfcf]"
                          : "bg-slot-idle text-[#111] hover:bg-[#efe6f5]"
                    )}
                  >
                    {s.value}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="w-full max-w-[423px] shrink-0 xl:ml-[73px]">
          <h2 className="text-[17px] font-bold text-[#111]">
            {service?.name ?? "Select a service"}
          </h2>
          <Media
            src={service?.image}
            alt={service?.name ?? ""}
            className="mt-4 aspect-[423/152] w-full rounded-lg"
          />

          {date && time && (
            <p className="mt-6 animate-in text-[18px] leading-[1.35] text-[#111] duration-[var(--dur-base)] ease-quart fade-in-0 fill-mode-both slide-in-from-bottom-1">
              You&rsquo;ve booked your appointment for{" "}
              {ordinal(date.getDate())} of {format(date, "MMMM, yyyy")}, {time}
            </p>
          )}

          <Button
            variant="solid"
            size="lg"
            disabled={!date || !time || navigating}
            onClick={() => startNavigation(() => router.push("/book/details"))}
            className="mt-6 px-12"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
