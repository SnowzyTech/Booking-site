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
import { getTakenSlots } from "@/app/book/actions";

/* Step 2 — date & time (MacBook Pro 14_ - 4.png). */
export default function SchedulePage() {
  const router = useRouter();
  const { service, date, setDate, time, setTime } = useBooking();
  const [month, setMonth] = React.useState(() => new Date(2026, 8, 1));
  const [takenLabels, setTakenLabels] = React.useState<string[]>([]);

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
    <div className="px-[186px] pb-32 pt-[74px]">
      <p className="text-center text-[13.5px] text-[#111]">
        {AVAILABILITY_NOTE}
      </p>

      <div className="mt-[70px] flex flex-wrap items-start gap-y-10">
        <Calendar
          month={month}
          onMonthChange={setMonth}
          selected={date}
          onSelect={setDate}
          isDayAvailable={isDayAvailable}
          className="w-[520px] shrink-0"
        />

        <div className="ml-[37px] shrink-0">
          <TimeSlots value={time} onChange={setTime} taken={takenLabels} />
        </div>

        <div className="ml-[73px] w-[423px] shrink-0">
          <h2 className="text-[17px] font-bold text-[#111]">
            {service?.name ?? "Select a service"}
          </h2>
          <Media
            src={service?.image}
            alt={service?.name ?? ""}
            className="mt-4 aspect-[423/152] w-full rounded-lg"
          />

          {date && time && (
            <p className="mt-6 text-[18px] leading-[1.35] text-[#111]">
              You&rsquo;ve booked your appointment for{" "}
              {ordinal(date.getDate())} of {format(date, "MMMM, yyyy")}, {time}
            </p>
          )}

          <Button
            variant="solid"
            size="lg"
            disabled={!date || !time}
            onClick={() => router.push("/book/details")}
            className="mt-6 px-12"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
