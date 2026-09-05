"use client";

import { useRouter } from "next/navigation";

import { useBooking } from "@/components/booking/booking-context";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { Media } from "@/components/ui/media";

const FIELDS = [
  {
    key: "fullName",
    label: "Full Name",
    placeholder: "ENTER YOUR FULL NAME",
    required: true,
  },
  { key: "phone", label: "Phone Number", type: "tel", required: true },
  { key: "whatsapp", label: "Whatsapp Number", type: "tel", required: true },
  { key: "address", label: "Address", required: true },
  { key: "email", label: "E-Mail", type: "email", required: true },
] as const;

/* Step 3 — contact details (MacBook Pro 14_ - 3.png). */
export default function DetailsPage() {
  const router = useRouter();
  const { service, details, setDetails } = useBooking();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim());
  // Every field is compulsory except the note; Confirm stays disabled until all
  // are filled and the e-mail is valid.
  const allRequiredFilled =
    Boolean(details.fullName.trim()) &&
    Boolean(details.phone.trim()) &&
    Boolean(details.whatsapp.trim()) &&
    Boolean(details.address.trim()) &&
    emailValid;

  return (
    <div className="px-6 pb-32 pt-[90px] lg:pt-[130px]">
      <div className="mx-auto flex max-w-[1000px] flex-col gap-y-12 lg:flex-row lg:items-start lg:justify-center lg:gap-x-[100px]">
        <form
          className="w-full max-w-[441px] shrink-0"
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
                required={f.required}
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
              Brief note on your health concern (optional)
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

          <Button
            type="submit"
            variant="solid"
            size="lg"
            disabled={!allRequiredFilled}
            className="mt-7 px-14"
          >
            Confirm
          </Button>
        </form>

        <div className="w-full max-w-[422px] shrink-0">
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
