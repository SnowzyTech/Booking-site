import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";
import { ContactBody, ContactIntro } from "@/components/sections/contact-page";
import { contactCopy } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us — Linda Chikaodi Austin",
  description: contactCopy.pageIntro,
};

/* Dedicated contact page. The landing band (<Contact>) carries the same
   details and links here; the message form only exists on this page. */
export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ContactIntro />
        <ContactBody />
      </main>
    </>
  );
}
