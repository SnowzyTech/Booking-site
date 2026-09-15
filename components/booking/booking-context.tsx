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

/* The event brief, collected on /book/enquiry by the two services that need one
   (see needsEnquiry in lib/services.ts). The date of the event is not here — it
   is the slot picked on the calendar step, like every other booking. */
export type Enquiry = {
  organization: string;
  location: string;
  audienceSize: string;
  topic: string;
  duration: string;
};

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
  enquiry: Enquiry;
  setEnquiry: React.Dispatch<React.SetStateAction<Enquiry>>;
};

const emptyDetails: Details = {
  fullName: "",
  phone: "",
  whatsapp: "",
  address: "",
  email: "",
  note: "",
};

const emptyEnquiry: Enquiry = {
  organization: "",
  location: "",
  audienceSize: "",
  topic: "",
  duration: "",
};

const BookingContext = React.createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [service, setService] = React.useState<Service>();
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState<string>();
  // Virtual by default — see the BookingMode comment in schema.prisma.
  const [mode, setMode] = React.useState<BookingMode>("virtual");
  const [details, setDetails] = React.useState<Details>(emptyDetails);
  const [enquiry, setEnquiry] = React.useState<Enquiry>(emptyEnquiry);

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
      enquiry,
      setEnquiry,
    }),
    [service, date, time, mode, details, enquiry]
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
