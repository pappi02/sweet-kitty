"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { kit, kitSaving } from "@/lib/products";
import { videos } from "@/lib/videos";
import { formatKES } from "@/lib/utils";
import { Button } from "../ui/button";
import { Eyebrow } from "../ui/decor";
import { PlayIcon } from "../ui/icons";
import { ease } from "../ui/reveal";
import { useVideoLightbox } from "../video/video-lightbox";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease },
});

export function Hero() {
  const { open } = useVideoLightbox();

  return (
    <section id="top" className="grid bg-burgundy pt-24 lg:min-h-svh lg:grid-cols-2">
      {/* The kit */}
      <div className="relative aspect-4/3 overflow-hidden bg-rose lg:order-2 lg:aspect-auto">
        <div className="absolute inset-0 animate-settle">
          <Image src="/products/sweet-kitty-7-day-kit.jpg" alt="The 7-Day Sweet Kitty Kit: gift bag, bow box, bottle, jar and crown towels" fill preload sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[58%_50%]" />
        </div>
      </div>

      {/* The offer */}
      <div className="tone-dark relative flex flex-col justify-center px-5 pb-12 pt-8 text-rose sm:px-10 lg:order-1 lg:py-12 lg:pl-[max(2.5rem,calc((100vw-72rem)/2+2rem))] lg:pr-14">
        <motion.div {...rise(0.05)}>
          <Eyebrow dark>The secret glowing women know</Eyebrow>
        </motion.div>

        <motion.h1 {...rise(0.12)} className="mt-4 font-display text-[clamp(3rem,6.6vw,6rem)] font-normal leading-[0.98]">
          Feel <em className="font-normal">irresistible</em> again.
        </motion.h1>

        <motion.p {...rise(0.22)} className="mt-5 max-w-md text-base leading-relaxed text-rose/90 sm:text-lg">
          Natural, secret-recipe rituals that help you embrace your feminine power, one morning at a time.
        </motion.p>

        <motion.div {...rise(0.3)} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/the-kit" variant="light" size="lg">
            Shop the 7-Day Kit
          </Button>
          <Button onClick={() => open(videos, 0)} variant="ghost" size="lg">
            <PlayIcon className="size-4" /> Watch her story
          </Button>
        </motion.div>

        <motion.p {...rise(0.38)} className="mt-6 text-sm text-rose/85">
          {formatKES(kit.price!)} for the full kit. You save {formatKES(kitSaving)}.
        </motion.p>
      </div>
    </section>
  );
}
