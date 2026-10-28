"use client";

import { motion, useScroll } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { days, isDarkDay as isDark } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Eyebrow, Star4 } from "../ui/decor";
import { ArrowIcon } from "../ui/icons";
import { Reveal, stagger, WordReveal } from "../ui/reveal";


/* ---------- Phones: swipe cards ---------- */

export function MobileRitual() {
  const scroller = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scroller });
  return (
    <div className="lg:hidden">
      <motion.div
        ref={scroller}
        initial="hidden"
        whileInView="show"
        viewport={stagger.viewport}
        variants={stagger.parent(0, 0.05)}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-2"
      >
        {days.map((d, i) => (
          <motion.div
            key={d.name}
            variants={stagger.child}
            style={{ background: d.bg }}
            className="relative flex h-[220px] w-[56vw] max-w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-[1.25rem] p-5"
          >
            <Star4 className={cn("absolute right-5 top-5 size-5 animate-twinkle", isDark(i) ? "text-white" : "text-pink-deep")} />
            <span className={cn("font-display text-[3.5rem] italic leading-none", isDark(i) ? "text-white/50" : "text-white/80")}>{i + 1}</span>
            <div className="mt-auto">
              <p className={cn("text-[10px] font-bold uppercase tracking-[0.25em]", isDark(i) ? "text-white/82" : "text-pink-deep/80")}>Day {i + 1}</p>
              <p className={cn("mt-1 font-display text-2xl", isDark(i) ? "text-white" : "text-ink")}>{d.name}</p>
              <p className={cn("mt-1.5 text-[13px] leading-snug", isDark(i) ? "text-white/80" : "text-ink/82")}>{d.text}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="mx-auto mt-3 max-w-[10rem] px-5">
        <div className="h-[3px] overflow-hidden rounded-full bg-ink/10">
          <motion.div style={{ scaleX: scrollXProgress }} className="h-full origin-left rounded-full bg-pink" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Desktop: expanding panels ---------- */

export function DesktopRitual() {
  const [open, setOpen] = useState(0);
  return (
    <Reveal className="mt-8 hidden lg:block">
      <div className="flex h-[320px] gap-2">
        {days.map((d, i) => {
          const active = open === i;
          const dark = isDark(i);
          return (
            <motion.button
              key={d.name}
              onPointerEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
              initial={false}
              animate={{ flexGrow: active ? 5 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              style={{ background: d.bg, flexBasis: 0 }}
              className="relative min-w-0 overflow-hidden rounded-[1.2rem] text-left outline-none ring-pink/40 focus-visible:ring-2"
              aria-expanded={active}
              aria-label={`Day ${i + 1}: ${d.name}`}
            >
              {/* collapsed label */}
              <motion.span
                animate={{ opacity: active ? 0 : 1 }}
                transition={{ duration: 0.15 }}
                className={cn("absolute inset-x-0 bottom-6 flex flex-col items-center gap-4", dark ? "text-white" : "text-ink")}
              >
                <span className="font-display text-2xl italic">{i + 1}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] [writing-mode:vertical-rl] rotate-180">{d.name}</span>
              </motion.span>

              {/* expanded content */}
              <motion.div
                animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
                transition={{ duration: 0.25, delay: active ? 0.1 : 0 }}
                className="absolute inset-0 flex w-[320px] flex-col p-6"
                aria-hidden={!active}
              >
                <span className={cn("font-display text-[5rem] italic leading-[0.8]", dark ? "text-white/25" : "text-white/80")}>{i + 1}</span>
                <div className="mt-auto">
                  <p className={cn("text-[10px] font-bold uppercase tracking-[0.3em]", dark ? "text-white/82" : "text-pink-deep/80")}>Day {i + 1}</p>
                  <p className={cn("mt-1.5 font-display text-3xl", dark ? "text-white" : "text-ink")}>{d.name}</p>
                  <p className={cn("mt-2 max-w-[16rem] text-sm leading-relaxed", dark ? "text-white/80" : "text-ink/82")}>{d.text}</p>
                </div>
              </motion.div>
              <Star4 className={cn("absolute right-5 top-5 size-4 animate-twinkle", dark ? "text-white" : "text-pink-deep")} />
            </motion.button>
          );
        })}
      </div>
    </Reveal>
  );
}

export function Ritual({ guideLink = true }: { guideLink?: boolean }) {
  return (
    <section id="ritual" className="relative overflow-hidden bg-linear-to-b from-cream to-blush/60 py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div>
            <Reveal>
              <Eyebrow>The ritual</Eyebrow>
            </Reveal>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,6.4vw,2.85rem)] leading-[1.04]">
              <WordReveal text="Seven days." /> <span className="text-gradient-pink italic">A whole new her.</span>
            </h2>
          </div>
          <Reveal delay={0.05} className="flex flex-col items-center lg:items-end">
            <p className="mt-4 max-w-xs text-sm sm:text-[15px] text-ink/72 lg:mt-0 lg:text-right">One small ritual every morning. Seven mornings to meet the woman you were always meant to be.</p>
            {guideLink && (
            <Link href="/ritual" className="group mt-4 inline-flex items-center gap-3 text-sm font-semibold text-ink">
              <span className="border-b border-ink/25 pb-0.5 transition-colors group-hover:border-pink">The full ritual guide</span>
              <ArrowIcon className="w-6 text-pink transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            )}
          </Reveal>
        </div>
        <DesktopRitual />
      </div>
      <MobileRitual />
    </section>
  );
}
