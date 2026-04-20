"use client";

/**
 * JoinFaqAccordion — client-only FAQ accordion for `/join-with-us`.
 *
 * Split from the server page because shadcn Accordion uses Radix primitives
 * that need the client runtime. Items are passed in from the server so the
 * same list feeds JSON-LD FAQPage without duplication.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface JoinFaqItem {
  id: string;
  question: string;
  answer: string;
}

interface JoinFaqAccordionProps {
  items: readonly JoinFaqItem[];
}

export function JoinFaqAccordion({ items }: JoinFaqAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full divide-y divide-[color:var(--color-border)] rounded-2xl border border-[color:var(--color-border)] bg-white px-4 shadow-sm md:px-6"
    >
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="border-b-0 border-none"
        >
          <AccordionTrigger className="py-5 text-left text-base font-semibold text-[color:var(--color-heading)] hover:no-underline md:text-lg">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm leading-7 text-[color:var(--color-body)] md:text-base">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
