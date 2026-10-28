"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { kit } from "@/lib/products";
import { videos } from "@/lib/videos";
import { formatKES } from "@/lib/utils";
import { Aurora, Eyebrow, Sparkles, Star4 } from "../ui/decor";
import { FlipWords } from "../ui/flip-words";
import { PlayIcon } from "../ui/icons";
import { ease, WordReveal } from "../ui/reveal";
import { ShimmerButton } from "../ui/shimmer-button";
import { useVideoLightbox } from "../video/video-lightbox";

const chips = [
  { label: "Confidence", className: "left-0 top-[18%]", delay: 0.55 },
  { label: "Glow", className: "right-[2%] top-[8%]", delay: 0.65 },
  { label: "Energy", className: "right-0 bottom-[24%]", delay: 0.75 },
  { label: "Self-love", className: "left-[4%] bottom-[8%]", delay: 0.85 },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { open } = useVideoLightbox();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section id="top" ref={ref} className="grain relative isolate overflow-hidden bg-sky-light tone-light pb-8 pt-24 text-white lg:pb-10 lg:pt-28">
      <Aurora />
      <Sparkles count={22} seed={11} className="opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-sky-light" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-4 px-5 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:px-8">
        <motion.div style={{ opacity: fade }} className="text-center lg:text-left">
          <motion.div {...fadeUp(0)}>
            <Eyebrow dark>The secret glowing women know</Eyebrow>
          </motion.div>

          <h1 className="mt-4 font-display text-[clamp(2.3rem,9.5vw,4.1rem)] font-medium leading-[0.98] tracking-tight">
            <WordReveal text="Feel" onLoad />
            <br />
            <span className="text-gradient-pink animate-gradient-x italic">
              <FlipWords words={["irresistible", "confident", "glowing", "unstoppable", "magnetic"]} />
            </span>
            <br />
            <WordReveal text="again." onLoad delay={0.1} />
          </h1>

          <motion.p {...fadeUp(0.2)} className="mx-auto mt-4 max-w-[26rem] text-sm sm:text-[15px] leading-relaxed text-white/78 lg:mx-0">
            Natural, secret-recipe rituals that help you embrace your feminine power. The 7-day glow-up every woman is whispering about.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-6 flex gap-2.5 sm:justify-center sm:gap-3 lg:justify-start">
            <ShimmerButton href="/the-kit" size="lg" className="flex-1 sm:flex-none">
              Shop the Kit
            </ShimmerButton>
            <ShimmerButton onClick={() => open(videos, 0)} variant="ghost" size="lg" className="flex-1 sm:flex-none">
              <PlayIcon className="size-4" /> Watch her story
            </ShimmerButton>
          </motion.div>

          {/* Editorial trust line */}
          <motion.dl {...fadeUp(0.4)} className="mx-auto mt-6 grid max-w-sm grid-cols-3 border-t border-white/10 pt-4 text-left lg:mx-0">
            {[
              ["100%", "Natural"],
              ["7", "Day ritual"],
              [formatKES(kit.price!).replace("KSh ", "") , "KSh full kit"],
            ].map(([v, l], i) => (
              <div key={l} className={i > 0 ? "border-l border-white/10 pl-4" : ""}>
                <dt className="font-display text-xl text-white">{v}</dt>
                <dd className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div style={{ y: logoY }} className="relative mx-auto aspect-square w-[min(54vw,230px)] lg:w-[340px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease }}
            className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(255,0,144,0.55),rgba(255,0,144,0.08)_55%,transparent_70%)]"
          />
          <div className="absolute inset-[3%] animate-spin-slow rounded-full border border-dashed border-pink/30" />
          <div className="absolute inset-[14%] animate-spin-slow rounded-full border border-white/10 [animation-direction:reverse]" />
          <Star4 className="absolute left-[12%] top-[10%] size-5 animate-twinkle text-pink-soft" />
          <Star4 className="absolute bottom-[14%] right-[10%] size-4 animate-twinkle text-white [animation-delay:1.2s]" />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="absolute inset-[10%]"
          >
            <div className="relative h-full w-full animate-float">
              <Image
                src="/brand/my-sweet-kitty.png"
                alt="My Sweet Kitty: a glamorous white cat in a crown and pink sunglasses"
                fill
                preload
                sizes="(min-width: 1024px) 360px, 70vw"
                className="object-contain drop-shadow-[0_25px_50px_rgba(255,0,144,0.45)]"
              />
            </div>
          </motion.div>

          {chips.map((c) => (
            <motion.span
              key={c.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: c.delay, type: "spring", stiffness: 380, damping: 22 }}
              className={`absolute ${c.className}`}
            >
              <span className="flex animate-float-slow items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white ring-1 ring-white/20 backdrop-blur-md">
                <Star4 className="size-2 text-pink-soft" />
                {c.label}
              </span>
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
