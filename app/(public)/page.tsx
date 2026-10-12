import { HashScroll } from "@/components/layout/hash-scroll";
import { SiteHeader } from "@/components/layout/site-header";
import { About } from "@/components/sections/about";
import { BetterHealth } from "@/components/sections/better-health";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Services } from "@/components/sections/services";
import { JsonLd } from "@/components/seo/json-ld";
import { faqJsonLd } from "@/lib/seo";

export default function LandingPage() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <HashScroll />
      <SiteHeader fixed />
      <main>
        <Hero />
        <BetterHealth />
        <HowItWorks />
        <Services />
        <About />
        <Faq />
        <Contact />
      </main>
    </>
  );
}
