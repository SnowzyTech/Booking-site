import { Reveal } from "@/components/motion/reveal";

export function BetterHealth() {
  return (
    <section className="bg-wash-cream py-[86px]">
      <Reveal className="mx-auto max-w-[900px] px-6 text-center">
        <h2 className="text-[31px] font-extrabold leading-[1.22] tracking-[-0.015em] sm:text-[36px] lg:text-[41px]">
          <span className="text-[#4a1063]">Better Health Starts With the </span>
          <span className="text-brand-ink">Right Plan</span>
        </h2>
        <p className="mx-auto mt-4 max-w-[810px] text-[16.5px] leading-[1.7] text-[#1d1620]">
          Your health journey is unique. Whether your goal is to manage a health
          condition, lose weight, improve your nutrition, or simply live
          healthier, the right approach starts with understanding your
          individual needs.
        </p>
      </Reveal>
    </section>
  );
}
