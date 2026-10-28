"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { values } from "@/lib/content";
import { Eyebrow, Sparkles, Star4 } from "../ui/decor";
import { Reveal, stagger, WordReveal } from "../ui/reveal";

/* ---------- Manifesto: words light up as you scroll ---------- */

function Word({ word, range, progress, accent }: { word: string; range: [number, number]; progress: MotionValue<number>; accent: boolean }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={accent ? "text-gradient-pink italic" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

const manifesto =
  "We believe every woman deserves to feel irresistible in her own skin. Not someday. Now. So we made rituals that are natural, private and beautifully simple, and we keep the recipe to ourselves.";
const accentWords = new Set(["irresistible", "Now.", "natural,", "private"]);

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = manifesto.split(" ");

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Reveal>
          <Eyebrow>Manifesto</Eyebrow>
        </Reveal>
        <p ref={ref} className="mt-5 font-display text-[clamp(1.5rem,4.2vw,2.8rem)] leading-[1.15] tracking-tight">
          {words.map((w, i) => (
            <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={accentWords.has(w)} />
          ))}
        </p>
      </div>
    </section>
  );
}

/* ---------- Values: oversized hairline rows ---------- */

export function Values() {
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <Eyebrow>What we stand for</Eyebrow>
            </Reveal>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,6.4vw,2.85rem)] leading-[1.04]">
              <WordReveal text="Four promises," /> <span className="text-gradient-pink italic">kept.</span>
            </h2>
          </div>
        </div>

        <motion.ol initial="hidden" whileInView="show" viewport={stagger.viewport} variants={stagger.parent(0, 0.07)} className="mt-8 border-t border-ink/10">
          {values.map((v, i) => (
            <motion.li key={v.title} variants={stagger.child} className="group relative isolate grid gap-2 border-b border-ink/10 py-4 lg:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-8 lg:py-5">
              <span className="pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 bg-linear-to-r from-blush via-blush/60 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />
              <span className="font-display text-lg italic text-pink">0{i + 1}</span>
              <h3 className="flex items-center gap-4 font-display text-[clamp(1.7rem,4vw,2.6rem)] leading-none transition-transform duration-300 group-hover:translate-x-2">
                {v.title}
                <Star4 className="size-4 text-pink opacity-0 transition-all duration-300 group-hover:rotate-90 group-hover:opacity-100" />
              </h3>
              <p className="max-w-sm text-sm sm:text-[15px] leading-relaxed text-ink/75">{v.text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ---------- A note from us ---------- */

export function BrandNote() {
  return (
    <section className="px-3 sm:px-5">
      <div className="grain tone-light relative isolate mx-auto grid max-w-6xl items-center gap-7 overflow-hidden rounded-[1.6rem] bg-sky-light px-5 py-9 text-white sm:px-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-10 lg:py-11">
        <Sparkles count={12} seed={99} className="opacity-70" />
        <Reveal className="relative mx-auto w-32 lg:w-full lg:max-w-[200px]">
          <Image src="/brand/my-sweet-kitty.png" alt="My Sweet Kitty" width={1240} height={1244} className="h-auto w-full animate-float drop-shadow-[0_30px_50px_rgba(255,0,144,0.4)]" />
        </Reveal>
        <div className="relative">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-pink-deep">A note from us</p>
          </Reveal>
          <Reveal delay={0.05}>
            <blockquote className="mt-3 font-display text-[clamp(1.25rem,2.8vw,1.8rem)] italic leading-snug">
              “Sweet Kitty started with a simple wish: that no woman should feel invisible in her own life. We made the rituals we wished we had, and we packed every one with love.”
            </blockquote>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 font-script text-3xl text-pink-deep">My Sweet Kitty</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/65">With love, from Kenya</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
