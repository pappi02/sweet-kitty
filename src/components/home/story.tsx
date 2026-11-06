"use client";

import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "../ui/decor";
import { Reveal, WordReveal } from "../ui/reveal";
import { ChatScene, DaysScene, OrderScene, PhoneFrame, VideoScene } from "./story-visuals";

type Step = { tag: string; title: string; body: string; scene: (play: boolean) => ReactNode };

const steps: Step[] = [
  {
    tag: "Before",
    title: "Busy. Tired. Running on empty.",
    body: "She was looking after everyone but herself. Something was missing, and she knew it.",
    scene: (play) => <VideoScene play={play} src="/videos/kitty-before.mp4" mood="before" label="Not feeling like herself…" />,
  },
  {
    tag: "The secret",
    title: "“Girl… haven't you heard?”",
    body: "Her bestie noticed first. One message changed everything.",
    scene: (play) => <ChatScene play={play} />,
  },
  {
    tag: "The order",
    title: "Two taps. Done.",
    body: "She opened Sweet Kitty, chose the 7-Day Kit and ordered in seconds. Discreetly packed and delivered to her door.",
    scene: (play) => <OrderScene play={play} />,
  },
  {
    tag: "Day 1 → 7",
    title: "Every day, a little more her.",
    body: "Energy on day one. A glow by day three. By day five she was loving herself again, and everyone could feel it.",
    scene: (play) => <DaysScene play={play} />,
  },
  {
    tag: "After",
    title: "Booked, busy and glowing.",
    body: "Business class. Tuesday-morning shopping. Calling her bestie: “You still don't have Sweet Kitty?”",
    scene: (play) => <VideoScene play={play} src="/videos/kitty-booked.mp4" mood="after" label="Living her main-character life ✨" />,
  },
];

function Heading() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <Eyebrow>Her story</Eyebrow>
      </Reveal>
      <h2 className="mt-3 font-display text-[clamp(2.1rem,6.4vw,3.6rem)] leading-[1.02]">
        <WordReveal text="From running on empty to" /> <span className="text-accent italic">unforgettable.</span>
      </h2>
      <Reveal delay={0.1}>
        <p className="mx-auto mt-3 max-w-md text-base text-ink/72">Every Sweet Kitty girl has a before. This is what happens after.</p>
      </Reveal>
    </div>
  );
}

/* ---------- Phones: vertical timeline with inline scenes ---------- */

function MobileStep({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  return (
    <div className="relative pl-12">
      <span className="absolute left-0 top-0 grid size-8 place-items-center rounded-full bg-white font-display text-sm italic text-accent shadow-md ring-1 ring-accent/20">
        {index + 1}
      </span>
      <Reveal>
        <span className={cn("text-xs font-bold uppercase tracking-[0.16em]", index === steps.length - 1 ? "text-accent" : "text-ink/75")}>{step.tag}</span>
        <h3 className="mt-1.5 font-display text-2xl leading-tight">{step.title}</h3>
        <p className="mt-3 text-base leading-relaxed text-ink/78">{step.body}</p>
      </Reveal>
      <div ref={ref} className="mt-6">
        <PhoneFrame className="w-[min(200px,100%)]">{step.scene(inView)}</PhoneFrame>
      </div>
    </div>
  );
}

function MobileStory() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });
  return (
    <div ref={listRef} className="relative mt-8 space-y-10 lg:hidden">
      <div className="absolute bottom-0 left-[17px] top-0 w-px bg-ink/10" />
      <motion.div style={{ scaleY: scrollYProgress }} className="absolute bottom-0 left-[17px] top-0 w-px origin-top bg-linear-to-b from-rose via-burgundy to-burgundy" />
      {steps.map((s, i) => (
        <MobileStep key={s.tag} step={s} index={i} />
      ))}
    </div>
  );
}

/* ---------- Desktop: pinned scroll scene ---------- */

function StepRow({ step, index, progress, active, onSelect }: { step: Step; index: number; progress: MotionValue<number>; active: boolean; onSelect: () => void }) {
  const n = steps.length;
  const fill = useTransform(progress, [index / n, (index + 1) / n], [0, 1], { clamp: true });
  return (
    <button onClick={onSelect} className="group block w-full py-2 text-left">
      <span className="relative block h-[2px] overflow-hidden rounded-full bg-ink/10">
        <motion.span style={{ scaleX: fill }} className="absolute inset-0 origin-left bg-burgundy" />
      </span>
      <span className="mt-3 flex items-baseline gap-2 whitespace-nowrap">
        <span className={cn("font-display text-sm italic transition-colors duration-200", active ? "text-accent" : "text-ink/75")}>0{index + 1}</span>
        <span className={cn("text-xs font-bold uppercase tracking-[0.16em] transition-colors duration-200", active ? "text-ink" : "text-ink/75 group-hover:text-ink/75")}>
          {step.tag}
        </span>
      </span>
    </button>
  );
}

function DesktopStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const n = steps.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n * 0.9999)));
    setActive((prev) => (prev === i ? prev : i));
  });

  // Clicking a step scrolls to that point of the pinned scene.
  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * ((i + 0.5) / n), behavior: "smooth" });
  };

  return (
    <div ref={ref} className="relative hidden lg:block" style={{ height: `${n * 30 + 60}vh` }}>
      <div className="sticky top-0 flex h-svh items-center pt-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-20 px-8">
          <div className="max-w-xl">
            <div className="relative min-h-[12rem]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className={cn("text-xs font-bold uppercase tracking-[0.16em]", active === n - 1 ? "text-accent" : "text-ink/75")}>
                    Chapter {active + 1} · {steps[active].tag}
                  </span>
                  <h3 className="mt-3 font-display text-[2.5rem] leading-[1.04]">{steps[active].title}</h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-ink/75">{steps[active].body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-7 grid grid-cols-5 gap-4">
              {steps.map((s, i) => (
                <StepRow key={s.tag} step={s} index={i} progress={scrollYProgress} active={i === active} onSelect={() => goTo(i)} />
              ))}
            </div>
          </div>

          <PhoneFrame className="w-auto" style={{ height: "min(62svh, 500px)" }}>
            {steps.map((s, i) => (
              <motion.div
                key={s.tag}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.03 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ pointerEvents: i === active ? "auto" : "none" }}
              >
                {s.scene(i === active)}
              </motion.div>
            ))}
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}

export function Story() {
  return (
    <section id="story" className="relative overflow-clip bg-linear-to-b from-cream via-blush/50 to-cream pt-12 pb-8 lg:pt-16 lg:pb-0">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Heading />
        <MobileStory />
      </div>
      <DesktopStory />
    </section>
  );
}
