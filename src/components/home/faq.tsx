"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { allFaqs, type Faq as FaqItem } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Eyebrow } from "../ui/decor";
import { ArrowIcon, PlusIcon } from "../ui/icons";
import { Reveal, stagger, WordReveal } from "../ui/reveal";

/** Hairline accordion. Shared by the home page and the FAQ page. */
export function FaqAccordion({ items, startOpen = 0, numberFrom = 1 }: { items: FaqItem[]; startOpen?: number | null; numberFrom?: number }) {
  const [open, setOpen] = useState<number | null>(startOpen);

  return (
    <motion.ul initial="hidden" whileInView="show" viewport={stagger.viewport} variants={stagger.parent(0, 0.05)} className="border-t border-ink/10">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <motion.li key={f.q} variants={stagger.child} className="border-b border-ink/10">
            <button onClick={() => setOpen(isOpen ? null : i)} className="group flex w-full items-center gap-4 py-3.5 text-left" aria-expanded={isOpen}>
              <span className={cn("w-6 shrink-0 font-display text-sm italic transition-colors", isOpen ? "text-accent" : "text-ink/75")}>
                {String(i + numberFrom).padStart(2, "0")}
              </span>
              <span className={cn("flex-1 font-display text-lg transition-colors sm:text-xl", isOpen ? "text-ink" : "text-ink/80 group-hover:text-ink")}>{f.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className={cn("grid size-8 shrink-0 place-items-center rounded-full transition-colors", isOpen ? "bg-burgundy text-white" : "ring-1 ring-ink/15 group-hover:ring-accent")}
              >
                <PlusIcon className="size-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-xl pb-4 pl-10 pr-10 text-sm leading-relaxed text-ink/75">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

export function Faq({ items = allFaqs.slice(0, 5), title = "Everything you're", accent = "wondering." }: { items?: FaqItem[]; title?: string; accent?: string }) {
  return (
    <section id="faq" className="bg-white/50 py-12 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-7 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:px-8">
        <div className="text-center lg:sticky lg:top-28 lg:self-start lg:text-left">
          <Reveal>
            <Eyebrow>Questions</Eyebrow>
          </Reveal>
          <h2 className="mt-3 font-display text-[clamp(2.1rem,6.4vw,3.6rem)] leading-[1.02]">
            <WordReveal text={title} /> <span className="text-accent italic">{accent}</span>
          </h2>
          <Reveal delay={0.05}>
            <Link href="/faq" className="group mt-6 inline-flex items-center gap-3 text-sm font-semibold text-ink">
              <span className="border-b border-ink/25 pb-0.5 transition-colors group-hover:border-accent">See every answer</span>
              <ArrowIcon className="w-6 text-accent transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
