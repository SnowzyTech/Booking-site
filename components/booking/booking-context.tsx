"use client";

import * as React from "react";

import type { Service } from "@/lib/services";

export type Details = {
  fullName: string;
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
  note: string;
};

/* Where the session happens, chosen alongside the date and time. Mirrors the
   BookingMode enum in prisma/schema.prisma. */
export type BookingMode = "virtual" | "physical";

type Ctx = {
  service?: Service;
  setService: (s: Service) => void;
  date?: Date;
  setDate: (d: Date) => void;
  time?: string;
  setTime: (t: string) => void;
  mode: BookingMode;
  setMode: (m: BookingMode) => void;
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
};

const emptyDetails: Details = {
  fullName: "",
  phone: "",
  whatsapp: "",
  address: "",
  email: "",
  note: "",
};

const BookingContext = React.createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [service, setService] = React.useState<Service>();
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>();
  // Virtual by default — see the BookingMode comment in schema.prisma.
  const [mode, setMode] = React.useState<BookingMode>("virtual");
  const [details, setDetails] = React.useState<Details>(emptyDetails);

  const value = React.useMemo(
    () => ({
      service,
      setService,
      date,
      setDate,
      time,
      setTime,
      mode,
      setMode,
      details,
      setDetails,
    }),
    [service, date, time, mode, details]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = React.useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
