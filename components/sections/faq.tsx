"use client";

import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/lib/faq";
import { cn } from "@/lib/utils";

/*
 * Two-level accordion, per faq.png: a category row opens into a 2-column grid
 * of question pills, and each pill is itself an accordion. An open question
 * turns purple and its pill grows to fit the answer.
 */
export function Faq() {
  return (
    <section id="faq" className="bg-white py-[70px]">
      <div className="mx-auto max-w-[1100px] px-6">
        <h2 className="bg-gradient-to-r from-[#7b0fb5] to-[#c264ea] bg-clip-text text-[44px] font-bold tracking-[-0.02em] text-transparent">
          Frequently Asked Questions
        </h2>

        <Accordion
          type="multiple"
          defaultValue={["general", "appointments", "corporate-events"]}
          className="mt-10"
        >
          {faq.map((cat, i) => (
            <AccordionItem
              key={cat.id}
              value={cat.id}
              className={cn(i > 0 && "border-t border-[#c9c9c9]")}
            >
              <AccordionTrigger className="py-7 text-[27px] font-semibold tracking-[0.01em] text-[#4a3a52]">
                {cat.title}
              </AccordionTrigger>
              <AccordionContent className="pb-9">
                {cat.questions.length === 0 ? (
                  <p className="text-[13px] italic text-muted-foreground">
                    Questions for this section were collapsed in the design and
                    have not been supplied yet.
                  </p>
                ) : (
                  <QuestionGrid id={cat.id} questions={cat.questions} />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function QuestionGrid({
  id,
  questions,
}: {
  id: string;
  questions: { q: string; answer: string | null }[];
}) {
  return (
    <Accordion type="multiple" className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {questions.map((item, i) => (
        <AccordionItem
          key={item.q}
          value={`${id}-${i}`}
          className="h-fit rounded-xl bg-surface-muted px-6 data-[state=open]:bg-[#f1f1f1]"
        >
          <AccordionTrigger className="py-5 text-[13.5px] font-medium leading-snug text-[#1d1620] data-[state=open]:font-bold data-[state=open]:text-brand-ink">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            {item.answer ? (
              <p className="whitespace-pre-line text-justify text-[12.5px] leading-[1.6] text-[#3d3d3d]">
                {item.answer}
              </p>
            ) : (
              <p className="text-[12.5px] italic text-muted-foreground">
                Answer copy pending.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
