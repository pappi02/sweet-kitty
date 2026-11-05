"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { days, isDarkDay, morningSteps } from "@/lib/content";
import { getProductBySlug, productHref } from "@/lib/products";
import { getVideo, videos } from "@/lib/videos";
import { cn } from "@/lib/utils";
import { Eyebrow, Star4 } from "../ui/decor";
import { ArrowIcon, CheckIcon, PlayIcon } from "../ui/icons";
import { ease, Reveal, stagger, WordReveal } from "../ui/reveal";
import { MobileRitual } from "../home/ritual";
import { AmbientVideo } from "../video/ambient-video";
import { useVideoLightbox } from "../video/video-lightbox";

/* ---------- Morning ritual: sticky video + scrolling steps ---------- */

function Step({ step, index, onActive }: { step: (typeof morningSteps)[number]; index: number; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const product = step.product ? getProductBySlug(step.product) : null;

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="relative pl-12 lg:flex lg:min-h-[38svh] lg:flex-col lg:justify-center lg:pl-16">
      <span
        className={cn(
          "absolute left-0 top-0 grid size-8 place-items-center rounded-full font-display text-xs italic transition-colors duration-300 lg:top-1/2 lg:size-10 lg:-translate-y-1/2",
          inView ? "bg-burgundy text-white" : "bg-white text-accent ring-1 ring-accent/25",
        )}
      >
        {index + 1}
      </span>
      <Reveal>
        <p className="font-display text-sm italic text-accent">{step.time}</p>
        <h3 className="mt-1 font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-none">{step.title}</h3>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-ink/75">{step.text}</p>
        {product && (
          <Link href={productHref(product)} className="group mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="border-b border-ink/25 pb-0.5 group-hover:border-accent">{product.name}</span>
            <ArrowIcon className="w-5 text-accent transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </Reveal>
    </li>
  );
}

export function MorningRitual() {
  const [active, setActive] = useState(0);
  const { open } = useVideoLightbox();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });
  const video = getVideo("morning");

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Every morning</Eyebrow>
          </Reveal>
          <h2 className="mt-3 font-display text-[clamp(2.1rem,6.4vw,3.6rem)] leading-[1.02]">
            <WordReveal text="Your morning," /> <span className="text-accent italic">step by step.</span>
          </h2>
        </div>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-12">
          {/* Sticky video panel */}
          <div className="lg:sticky lg:top-24 lg:h-[min(calc(100svh-8rem),520px)] lg:self-start">
            <div className="tone-dark relative mx-auto aspect-4/5 w-full max-w-[300px] overflow-hidden rounded-sm bg-ink lg:aspect-auto lg:h-full lg:max-w-[340px]">
              <AmbientVideo video={video} />
              <span className="absolute inset-0 bg-linear-to-b from-ink/50 via-transparent to-ink/80" />
              <div className="absolute inset-x-5 top-5 flex items-start justify-between">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease }}
                    className="font-display text-4xl tabular-nums text-white"
                  >
                    {morningSteps[active].time}
                  </motion.p>
                </AnimatePresence>
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white ring-1 ring-white/25 backdrop-blur-md">
                  Step {active + 1}/{morningSteps.length}
                </span>
              </div>
              <div className="absolute inset-x-5 bottom-5">
                <div className="flex gap-1.5">
                  {morningSteps.map((s, i) => (
                    <span key={s.title} className={cn("h-[3px] flex-1 rounded-full transition-colors duration-300", i <= active ? "bg-white" : "bg-white/25")} />
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.p
                      key={active}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease }}
                      className="font-display text-xl italic text-white"
                    >
                      {morningSteps[active].title}
                    </motion.p>
                  </AnimatePresence>
                  <button
                    onClick={() => open(videos, videos.indexOf(video))}
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-accent transition-transform duration-300 hover:scale-110"
                    aria-label="Watch the morning ritual with sound"
                  >
                    <PlayIcon className="ml-0.5 size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol ref={listRef} className="relative space-y-10 lg:space-y-0">
            <span className="absolute bottom-0 left-[15px] top-0 w-px bg-ink/10 lg:left-[19px]" />
            <motion.span style={{ scaleY: scrollYProgress }} className="absolute bottom-0 left-[15px] top-0 w-px origin-top bg-burgundy lg:left-[19px]" />
            {morningSteps.map((s, i) => (
              <Step key={s.title} step={s} index={i} onActive={setActive} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- Seven days: pinned horizontal track on desktop ---------- */

function DayCard({ d, i, className }: { d: (typeof days)[number]; i: number; className?: string }) {
  const dark = isDarkDay(i);
  return (
    <div style={{ background: d.bg }} className={cn("relative flex shrink-0 flex-col overflow-hidden rounded-sm p-7", className)}>
      <Star4 className={cn("absolute right-6 top-6 size-5 ", dark ? "text-white" : "text-accent")} />
      <span className={cn("font-display text-[6rem] italic leading-[0.8]", dark ? "text-white/30" : "text-burgundy/45")}>{i + 1}</span>
      <div className="mt-auto">
        <p className={cn("text-xs font-bold uppercase tracking-[0.3em]", dark ? "text-white/85" : "text-accent")}>Day {i + 1}</p>
        <p className={cn("mt-1.5 font-display text-4xl", dark ? "text-white" : "text-ink")}>{d.name}</p>
        <p className={cn("mt-2.5 max-w-[17rem] text-sm leading-relaxed", dark ? "text-white/85" : "text-ink/80")}>{d.text}</p>
      </div>
    </div>
  );
}

export function DaysTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  useEffect(() => {
    const measure = () => {
      const el = track.current;
      if (el) setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section className="bg-linear-to-b from-cream to-blush/60">
      <div className="mx-auto max-w-6xl px-5 pt-12 lg:px-8 lg:pt-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <Eyebrow>The week</Eyebrow>
            </Reveal>
            <h2 className="mt-3 font-display text-[clamp(2.1rem,6.4vw,3.6rem)] leading-[1.02]">
              <WordReveal text="Seven days." /> <span className="text-accent italic">A whole new her.</span>
            </h2>
          </div>
          <Reveal delay={0.05}>
            <p className="max-w-xs text-base text-ink/72 lg:text-right">What most women feel, day by day, when they follow the full ritual.</p>
          </Reveal>
        </div>
      </div>

      {/* Phones: swipe */}
      <div className="pb-20 lg:hidden">
        <MobileRitual />
      </div>

      {/* Desktop: vertical scroll drives the track sideways */}
      <div ref={ref} className="relative hidden h-[250vh] lg:block">
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
          <motion.div ref={track} style={{ x }} className="flex gap-4 pl-[max(2rem,calc((100vw-72rem)/2+2rem))] pr-[10vw]">
            {days.map((d, i) => (
              <DayCard key={d.name} d={d} i={i} className="h-[min(50svh,400px)] w-[290px]" />
            ))}
            <div className="flex h-[min(50svh,400px)] w-[300px] shrink-0 flex-col justify-center">
              <p className="font-display text-3xl leading-tight">
                Ready to meet <span className="text-accent italic">her?</span>
              </p>
              <Link href="/the-kit" className="group mt-6 inline-flex items-center gap-3 text-sm font-semibold">
                <span className="border-b border-ink/25 pb-0.5 group-hover:border-accent">Start with the 7-Day Kit</span>
                <ArrowIcon className="w-6 text-accent transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
          <div className="mx-auto mt-7 w-full max-w-6xl px-8">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/55">
              Day 1
              <span className="h-px flex-1 overflow-hidden bg-ink/10">
                <motion.span style={{ scaleX: bar }} className="block h-full origin-left bg-burgundy" />
              </span>
              Day 7
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Little rules ---------- */

const rules = [
  { t: "Follow all seven days", d: "The more of the ritual you follow, the bigger the transformation." },
  { t: "Water, water, water", d: "Drink plenty through the day. It carries your glow." },
  { t: "Fruit after three hours", d: "Eat fruits and vegetables about three hours after your Magic Kitty Juice." },
  { t: "Make the morning yours", d: "Your bath is your time. Phone down, door closed." },
  { t: "Listen to your body", d: "If anything irritates you, stop and message us. We'll help personally." },
  { t: "Tell your bestie", d: "Glowing is better together. She'll thank you later." },
];

export function RitualRules() {
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-7 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow>Little rules</Eyebrow>
          </Reveal>
          <h2 className="mt-3 font-display text-[clamp(2.1rem,6.4vw,3.6rem)] leading-[1.02]">
            <WordReveal text="For a" /> <span className="text-accent italic">bigger glow.</span>
          </h2>
        </div>
        <motion.ul initial="hidden" whileInView="show" viewport={stagger.viewport} variants={stagger.parent(0, 0.05)} className="grid border-t border-ink/10 sm:grid-cols-2">
          {rules.map((r, i) => (
            <motion.li key={r.t} variants={stagger.child} className={cn("group border-b border-ink/10 py-4 sm:pr-6", i % 2 === 1 && "sm:border-l sm:pl-6")}>
              <p className="flex items-center gap-3">
                <span className="grid size-6 place-items-center rounded-full bg-burgundy/10 text-accent transition-colors duration-300 group-hover:bg-burgundy group-hover:text-white">
                  <CheckIcon className="size-3.5" />
                </span>
                <span className="font-display text-lg">{r.t}</span>
              </p>
              <p className="mt-1 pl-9 text-sm leading-relaxed text-ink/70">{r.d}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
