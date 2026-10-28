"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Video } from "@/lib/videos";
import { PlayIcon } from "../ui/icons";
import { AmbientVideo } from "./ambient-video";
import { useVideoLightbox } from "./video-lightbox";

type Caption = { kicker: string; text: string };

/**
 * Pinned scroll scene: a small arched video grows to fill the stage while
 * the giant words behind it part and captions slide in at the sides.
 */
export function CinemaVideo({
  video,
  playlist,
  words,
  captions,
}: {
  video: Video;
  playlist?: Video[];
  words: [string, string];
  captions: [Caption, Caption];
}) {
  const ref = useRef<HTMLElement>(null);
  const { open } = useVideoLightbox();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const scale = useTransform(scrollYProgress, [0, 0.55], [0.58, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.55], ["999px 999px 28px 28px", "36px 36px 36px 36px"]);
  const topY = useTransform(scrollYProgress, [0, 0.55], ["0%", "-55%"]);
  const bottomY = useTransform(scrollYProgress, [0, 0.55], ["0%", "55%"]);
  const wordsOpacity = useTransform(scrollYProgress, [0.3, 0.55], [1, 0.12]);
  const capOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const capLeftX = useTransform(scrollYProgress, [0.5, 0.7], [-24, 0]);
  const capRightX = useTransform(scrollYProgress, [0.5, 0.7], [24, 0]);

  const list = playlist ?? [video];

  return (
    <section ref={ref} className="relative h-[180vh] bg-linear-to-b from-cream via-mist to-cream">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* Giant words behind the frame */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center font-display italic leading-[0.85] text-ink">
          <motion.span style={{ y: topY, opacity: wordsOpacity }} className="text-[clamp(4rem,18vw,12.5rem)]">
            {words[0]}
          </motion.span>
          <motion.span style={{ y: bottomY, opacity: wordsOpacity }} className="text-gradient-pink text-[clamp(4rem,18vw,12.5rem)]">
            {words[1]}
          </motion.span>
        </div>

        <motion.div
          style={{ scale, borderRadius: radius }}
          className="tone-dark relative aspect-9/16 h-[64svh] max-h-[620px] overflow-hidden bg-ink shadow-[0_50px_100px_-40px_rgba(42,15,31,0.55)]"
        >
          <AmbientVideo video={video} />
          <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
          <button
            onClick={() => open(list, list.indexOf(video))}
            className="group absolute inset-x-0 bottom-0 flex items-center justify-center gap-2.5 p-5 text-[13px] font-semibold text-white"
          >
            <span className="grid size-10 place-items-center rounded-full bg-white text-pink-deep transition-transform duration-300 group-hover:scale-110">
              <PlayIcon className="ml-0.5 size-5" />
            </span>
            Watch with sound
          </button>
        </motion.div>

        {/* Side captions (desktop) */}
        <motion.div style={{ opacity: capOpacity, x: capLeftX }} className="absolute left-[max(2rem,calc((100vw-72rem)/2+2rem))] top-1/2 hidden max-w-[15rem] -translate-y-1/2 lg:block">
          <p className="font-display text-sm italic text-pink">{captions[0].kicker}</p>
          <p className="mt-2 font-display text-2xl leading-tight text-ink">{captions[0].text}</p>
        </motion.div>
        <motion.div style={{ opacity: capOpacity, x: capRightX }} className="absolute right-[max(2rem,calc((100vw-72rem)/2+2rem))] top-1/2 hidden max-w-[15rem] -translate-y-1/2 text-right lg:block">
          <p className="font-display text-sm italic text-pink">{captions[1].kicker}</p>
          <p className="mt-2 font-display text-2xl leading-tight text-ink">{captions[1].text}</p>
        </motion.div>
      </div>
    </section>
  );
}
