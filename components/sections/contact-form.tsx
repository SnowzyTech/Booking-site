"use client";

import * as React from "react";
import { Mail } from "lucide-react";

import { WhatsApp } from "@/components/icons/social";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contact, contactCopy, contactTopics, whatsappLink } from "@/lib/site";

/*
 * This project has no mail transport — payments and the assisted booking flow
 * both hand off to WhatsApp — so the form composes the enquiry in the browser
 * and opens WhatsApp (or the visitor's mail client) with it pre-filled. Nothing
 * is posted to the server, which is also why there is no success state to fetch:
 * `handed` just explains where the message went.
 *
 * WhatsApp is the submit action so Enter sends and the browser runs its own
 * required-field validation; e-mail is the secondary link beside it.
 */
export function ContactForm() {
  const [topic, setTopic] = React.useState(contactTopics[0]);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [handed, setHanded] = React.useState<"whatsapp" | "email" | null>(null);

  const body = [
    `Topic: ${topic}`,
    `Name: ${name.trim()}`,
    email.trim() && `Email: ${email.trim()}`,
    phone.trim() && `Phone: ${phone.trim()}`,
    "",
    message.trim(),
  ]
    .filter(Boolean)
    .join("\n");

  const ready = Boolean(name.trim() && message.trim());
  const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(
    `${topic} — ${name.trim() || "Website enquiry"}`
  )}&body=${encodeURIComponent(body)}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Inside the submit gesture, so this is not treated as a pop-up.
        window.open(whatsappLink(body), "_blank", "noopener,noreferrer");
        setHanded("whatsapp");
      }}
      className="rounded-2xl border border-[#f0e4f7] bg-white p-6 shadow-[0_2px_16px_rgba(80,40,100,0.05)] sm:p-8"
    >
      <h3 className="text-[17px] font-bold text-[#111]">
        {contactCopy.formTitle}
      </h3>

      <div className="mt-5">
        <Label htmlFor="contact-topic">What is it about?</Label>
        <Select value={topic} onValueChange={setTopic}>
          <SelectTrigger id="contact-topic" className="mt-1.5 h-11 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {contactTopics.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-[18px] grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">Full Name</Label>
          <Input
            id="contact-name"
            required
            autoComplete="name"
            placeholder="ENTER YOUR FULL NAME"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="contact-phone">Phone Number (optional)</Label>
          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="mt-[18px]">
        <Label htmlFor="contact-email">E-Mail (optional)</Label>
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div className="mt-[18px]">
        <Label htmlFor="contact-message">Your Message</Label>
        <Textarea
          id="contact-message"
          required
          rows={5}
          placeholder="Tell us a little about what you need help with."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5"
        />
      </div>

      {/* The two labels do not fit side by side on a narrow phone, and both
          buttons are nowrap — so they stack until there is room. */}
      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="pill" size="lg" className="sm:px-7">
          <WhatsApp className="mr-2.5 size-[18px]" />
          Send on WhatsApp
        </Button>
        <Button
          asChild
          variant="soft"
          size="lg"
          className={ready ? undefined : "pointer-events-none opacity-50"}
        >
          <a
            href={mailHref}
            aria-disabled={!ready}
            onClick={() => setHanded("email")}
          >
            <Mail className="mr-2.5 size-[18px]" strokeWidth={1.75} />
            Send as email
          </a>
        </Button>
      </div>

      <p className="mt-4 text-[12px] leading-[1.6] text-[#6b6b6b]">
        {handed === "whatsapp" ? (
          <>
            Your message is waiting in WhatsApp — tap send there to deliver it.
            If nothing opened, message{" "}
            <a
              href={whatsappLink(body)}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand-ink underline"
            >
              {contact.whatsapp}
            </a>{" "}
            directly.
          </>
        ) : handed === "email" ? (
          <>
            Your mail app should have opened with the message filled in. If it
            did not, write to{" "}
            <a
              href={`mailto:${contact.email}`}
              className="font-semibold text-brand-ink underline"
            >
              {contact.email}
            </a>
            .
          </>
        ) : (
          contactCopy.formNote
        )}
      </p>
    </form>
  );
}
