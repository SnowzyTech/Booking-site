import { SiteHeader } from "@/components/layout/site-header";
import { About } from "@/components/sections/about";
import { BetterHealth } from "@/components/sections/better-health";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Services } from "@/components/sections/services";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <BetterHealth />
        <HowItWorks />
        <Services />
        <About />
        <Faq />
      </main>
    </>
  );
}
