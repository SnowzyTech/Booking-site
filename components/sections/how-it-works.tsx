import { Reveal } from "@/components/motion/reveal";
import { howItWorks } from "@/lib/site";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-wash-lavender pb-[70px] pt-[76px]">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-center text-[32px] font-extrabold tracking-[0.01em] text-[#1d1620]">
          HOW IT WORKS
        </h2>

        <Reveal
          stagger
          className="group mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {howItWorks.map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <span className="grid size-7 scale-90 place-items-center rounded-full bg-step-chip text-[12.5px] font-bold text-[#1d1620] transition-transform duration-[var(--dur-base)] ease-quart group-data-[reveal-stagger=in]:scale-100">
                {s.step}
              </span>
              <h3 className="mt-4 max-w-[215px] text-[19px] font-extrabold leading-tight text-[#1d1620]">
                {s.title}
              </h3>
              <div className="mt-3 max-w-[225px] space-y-1 text-[15px] leading-[1.6] text-[#1d1620]">
                {s.lines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
            </div>
          ))}
        </Reveal>

        <p className="mt-14 text-center text-[15px] text-[#1d1620]">
          <span className="font-medium text-note-red">Note:</span> Your
          experience and process may vary depending on the service you choose.
        </p>
      </div>
    </section>
  );
}
