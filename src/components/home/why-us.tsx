"use client";

import { motion } from "motion/react";
import { Counter } from "../ui/counter";
import { Aurora, Eyebrow, Sparkles } from "../ui/decor";
import { Reveal, stagger, WordReveal } from "../ui/reveal";

const facts = [
  { value: 100, suffix: "%", label: "Natural", text: "Pure, natural ingredients. The exact recipe stays our secret." },
  { value: 7, suffix: "", label: "Days", text: "One guided ritual to meet a brand-new version of you." },
  { value: 0, suffix: "", label: "Awkward questions", text: "Plain, discreet packaging on every single order." },
  { value: 1, suffix: "", label: "Message to order", text: "Add to bag, check out on WhatsApp. We handle the rest." },
];

export function WhyUs() {
  return (
    <section className="grain relative isolate overflow-hidden bg-sky-light tone-light py-12 text-white lg:py-16">
      <Aurora intensity="soft" />
      <Sparkles count={12} seed={33} className="opacity-50" />
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-12">
          <div>
            <Reveal>
              <Eyebrow dark>Why My Sweet Kitty</Eyebrow>
            </Reveal>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,6.4vw,2.85rem)] leading-[1.04]">
              <WordReveal text="Made with nature." /> <span className="text-gradient-pink italic">Kept a secret.</span>
            </h2>
          </div>
          <Reveal delay={0.05}>
            <p className="max-w-md text-sm sm:text-[15px] leading-relaxed text-white/75">
              We believe every woman deserves to feel irresistible in her own skin. So we made rituals that are natural, private and
              beautifully simple, and we never share the recipe.
            </p>
          </Reveal>
        </div>

        <motion.dl
          initial="hidden"
          whileInView="show"
          viewport={stagger.viewport}
          variants={stagger.parent(0.05, 0.06)}
          className="mt-8 grid grid-cols-2 border-t border-white/10 lg:grid-cols-4"
        >
          {facts.map((f, i) => (
            <motion.div
              key={f.label}
              variants={stagger.child}
              className={[
                "border-b border-white/10 py-5 pr-4 lg:border-b-0 lg:py-7 lg:pr-8",
                i % 2 === 1 ? "border-l pl-5 lg:pl-8" : "lg:pl-8",
                i === 0 ? "lg:pl-0" : "lg:border-l",
              ].join(" ")}
            >
              <dt>
                <Counter to={f.value} suffix={f.suffix} duration={1} className="font-display text-4xl text-gradient-pink sm:text-5xl" />
                <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">{f.label}</span>
              </dt>
              <dd className="mt-2 text-[13px] leading-relaxed text-white/72">{f.text}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
