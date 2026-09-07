import { Reveal } from "@/components/motion/reveal";
import { howItWorks } from "@/lib/site";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-wash-lavender pb-[70px] pt-[76px]">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="text-center text-[28px] font-semibold tracking-[0.01em] text-[#1d1620]">
          HOW IT WORKS
        </h2>

        <Reveal
          stagger
          className="group mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {howItWorks.map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <span className="grid size-6 scale-90 place-items-center rounded-full bg-step-chip text-[11px] font-medium text-[#1d1620] transition-transform duration-[var(--dur-base)] ease-quart group-data-[reveal-stagger=in]:scale-100">
                {s.step}
              </span>
              <h3 className="mt-4 max-w-[190px] text-[17px] font-bold leading-tight text-[#1d1620]">
                {s.title}
              </h3>
              <div className="mt-3 max-w-[200px] space-y-1 text-[12.5px] leading-[1.55] text-[#4a4a4a]">
                {s.lines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
            </div>
          ))}
        </Reveal>

        <p className="mt-14 text-center text-[13px] text-[#3d3d3d]">
          <span className="font-medium text-note-red">Note:</span> Your
          experience and process may vary depending on the service you choose.
        </p>
      </div>
    </section>
  );
}
