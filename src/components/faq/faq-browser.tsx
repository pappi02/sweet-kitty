"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { faqGroups } from "@/lib/content";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { FaqAccordion } from "../home/faq";
import { WhatsAppIcon } from "../ui/icons";
import { Reveal } from "../ui/reveal";
import { ShimmerButton } from "../ui/shimmer-button";

export function FaqBrowser() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(faqGroups[0].id);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqGroups;
    return faqGroups.map((g) => ({ ...g, items: g.items.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q)) })).filter((g) => g.items.length);
  }, [query]);

  // Highlight the group currently on screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    groups.forEach((g) => {
      const el = document.getElementById(g.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [groups]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  let counter = 0;

  return (
    <section className="py-10 lg:py-14">
      <div className="mx-auto grid max-w-6xl gap-7 px-5 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12 lg:px-8">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <label className="relative block">
            <span className="sr-only">Search questions</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" className="pointer-events-none absolute left-0 top-1/2 size-5 -translate-y-1/2 text-ink/50" aria-hidden>
              <circle cx="10.5" cy="10.5" r="6" />
              <path d="M15 15l5 5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions"
              className="w-full border-b border-ink/20 bg-transparent py-2.5 pl-8 font-display text-lg outline-none transition-colors placeholder:text-ink/40 focus:border-pink"
            />
          </label>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50">
            {total} {total === 1 ? "answer" : "answers"}
          </p>

          <nav className="no-scrollbar -mx-5 mt-6 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:px-0" aria-label="Question categories">
            {groups.map((g, i) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className={cn(
                  "relative isolate flex shrink-0 items-baseline gap-3 rounded-full px-4 py-2 text-sm font-semibold transition-colors lg:rounded-none lg:border-b lg:border-ink/10 lg:px-0 lg:py-2.5",
                  active === g.id ? "text-ink" : "text-ink/55 hover:text-ink",
                )}
              >
                {active === g.id && (
                  <motion.span layoutId="faq-active" transition={{ type: "spring", stiffness: 500, damping: 40 }} className="absolute inset-0 -z-10 rounded-full bg-blush lg:inset-y-0 lg:-left-4 lg:right-auto lg:w-[3px] lg:rounded-full lg:bg-pink" />
                )}
                <span className="hidden font-display text-xs italic text-pink lg:inline">0{i + 1}</span>
                {g.title}
                <span className="ml-auto hidden text-[10px] tabular-nums text-ink/45 lg:inline">{g.items.length}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div>
          <AnimatePresence mode="popLayout">
            {groups.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-t border-ink/10 py-10">
                <p className="font-display text-3xl">Nothing matches “{query}”.</p>
                <p className="mt-2 text-ink/70">Ask us directly and we&apos;ll answer personally.</p>
              </motion.div>
            ) : (
              groups.map((g) => {
                const from = counter + 1;
                counter += g.items.length;
                return (
                  <motion.div key={g.id + query} id={g.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="scroll-mt-28 pb-14 last:pb-0">
                    <h2 className="mb-2 font-display text-2xl italic text-pink-deep">{g.title}</h2>
                    <FaqAccordion items={g.items} startOpen={query ? 0 : null} numberFrom={from} />
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>

          <Reveal className="mt-16 flex flex-col items-start gap-5 border-t border-ink/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl">Still wondering?</p>
              <p className="mt-1 text-sm sm:text-[15px] text-ink/70">Message us. A real person answers, privately.</p>
            </div>
            <ShimmerButton href={whatsappLink("Hi Sweet Kitty! I have a question.")} target="_blank" rel="noopener noreferrer" size="lg">
              <WhatsAppIcon className="size-4" /> Ask on WhatsApp
            </ShimmerButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
