"use client";

import { motion } from "motion/react";
import { whatsappLink } from "@/lib/site";
import { Eyebrow, Sparkles } from "../ui/decor";
import { StarIcon, WhatsAppIcon } from "../ui/icons";
import { Reveal, WordReveal } from "../ui/reveal";
import { ShimmerButton } from "../ui/shimmer-button";

// Real, approved customer reviews will come from the admin dashboard.
// Until the first ones arrive, this section invites customers to share theirs.
export function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden py-12 lg:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-7 px-5 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:px-8">
        <div className="text-center lg:text-left">
          <Reveal>
            <Eyebrow>Glow stories</Eyebrow>
          </Reveal>
          <h2 className="mt-3 font-display text-[clamp(1.85rem,6.4vw,2.85rem)] leading-[1.04]">
            <WordReveal text="Real women." /> <span className="text-gradient-pink italic">Real glow.</span>
          </h2>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-4 max-w-sm text-sm sm:text-[15px] text-ink/72 lg:mx-0">
              Tried Sweet Kitty? Tell us how your seven days went. Your story could inspire the next woman to choose herself.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <figure className="relative overflow-hidden rounded-[1.6rem] bg-sky-light tone-light px-6 pb-6 pt-7 text-white sm:px-9">
            <Sparkles count={12} seed={44} className="opacity-70" />
            <span aria-hidden className="pointer-events-none absolute -top-6 left-6 font-display text-[7rem] italic leading-none text-pink/25">
              “
            </span>
            <motion.div
              className="relative flex gap-1"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span key={i} variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { type: "spring", stiffness: 500, damping: 20 } } }}>
                  <StarIcon className="size-4 text-pink" />
                </motion.span>
              ))}
            </motion.div>
            <blockquote className="relative mt-6 font-display text-2xl italic leading-snug sm:text-[1.7rem]">Your glow story could be the first one here.</blockquote>
            <figcaption className="relative mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">Be our first glow story</span>
              <ShimmerButton href={whatsappLink("Hi Sweet Kitty! I'd love to share my glow story 💗")} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="size-4" /> Share your story
              </ShimmerButton>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
