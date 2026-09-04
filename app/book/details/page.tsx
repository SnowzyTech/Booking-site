"use client";

import { useRouter } from "next/navigation";

import { useBooking } from "@/components/booking/booking-context";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { Media } from "@/components/ui/media";

const FIELDS = [
  { key: "fullName", label: "Full Name", placeholder: "ENTER YOUR FULL NAME" },
  { key: "phone", label: "Phone Number" },
  { key: "whatsapp", label: "Whatsapp Number" },
  { key: "address", label: "Address" },
  { key: "email", label: "E-Mail", type: "email" },
] as const;

/* Step 3 — contact details (MacBook Pro 14_ - 3.png). */
export default function DetailsPage() {
  const router = useRouter();
  const { service, details, setDetails } = useBooking();

  return (
    <div className="px-[299px] pb-32 pt-[130px]">
      <div className="flex flex-wrap items-start gap-x-[135px] gap-y-12">
        <form
          className="w-[441px] shrink-0"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/book/payment");
          }}
        >
          {FIELDS.map((f) => (
            <div key={f.key} className="mb-[18px]">
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input
                id={f.key}
                type={"type" in f ? f.type : "text"}
                placeholder={"placeholder" in f ? f.placeholder : undefined}
                value={details[f.key]}
                onChange={(e) =>
                  setDetails((d) => ({ ...d, [f.key]: e.target.value }))
                }
                className="mt-1.5"
              />
            </div>
          ))}

          <div className="mt-8">
            <Label htmlFor="note" className="pl-2">
              Brief note on your health concern (optional)\
            </Label>
            <Textarea
              id="note"
              rows={4}
              value={details.note}
              onChange={(e) =>
                setDetails((d) => ({ ...d, note: e.target.value }))
              }
              className="mt-1.5"
            />
          </div>

          <Button type="submit" variant="solid" size="lg" className="mt-7 px-14">
            Confirm
          </Button>
        </form>

        <div className="w-[422px] shrink-0">
          <h2 className="text-[17px] font-bold text-[#111]">
            {service?.name ?? "Select a service"}
          </h2>
          <Media
            src={service?.image}
            alt={service?.name ?? ""}
            className="mt-4 aspect-[423/152] w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
