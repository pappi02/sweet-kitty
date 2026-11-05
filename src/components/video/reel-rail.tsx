"use client";

import { motion, useScroll } from "motion/react";
import { useRef, type ReactNode } from "react";
import type { Video } from "@/lib/videos";
import { ChevronIcon } from "../ui/icons";
import { stagger } from "../ui/reveal";
import { ReelCard } from "./reel-card";
import { useVideoLightbox } from "./video-lightbox";

/** Horizontal row of reels with arrow controls and a scroll progress hairline. */
export function ReelRail({ list, heading, aside }: { list: Video[]; heading: ReactNode; aside?: ReactNode }) {
  const { open } = useVideoLightbox();
  const scroller = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scroller });

  const nudge = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <div>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>{heading}</div>
        <div className="flex items-end justify-between gap-6 lg:flex-col lg:items-end">
          {aside}
          <div className="hidden gap-2 lg:flex">
            <button onClick={() => nudge(-1)} className="grid size-10 place-items-center rounded-full ring-1 ring-ink/15 transition hover:bg-ink hover:text-white" aria-label="Scroll reels left">
              <ChevronIcon dir="left" className="size-5" />
            </button>
            <button onClick={() => nudge(1)} className="grid size-10 place-items-center rounded-full ring-1 ring-ink/15 transition hover:bg-ink hover:text-white" aria-label="Scroll reels right">
              <ChevronIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <motion.div
        ref={scroller}
        initial="hidden"
        whileInView="show"
        viewport={stagger.viewport}
        variants={stagger.parent(0, 0.06)}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-5 px-5 pb-2 sm:gap-4 lg:scroll-px-[max(2rem,calc((100vw-72rem)/2+2rem))] lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))]"
      >
        {list.map((v, i) => (
          <motion.div key={v.id} variants={stagger.child} className="w-[42vw] max-w-[180px] shrink-0 snap-start sm:w-[180px] lg:w-[190px]">
            <ReelCard video={v} index={i} onOpen={() => open(list, i)} />
          </motion.div>
        ))}
      </motion.div>

      <div className="mx-auto mt-4 max-w-6xl px-5 lg:px-8">
        <div className="h-px overflow-hidden bg-ink/10">
          <motion.div style={{ scaleX: scrollXProgress }} className="h-full origin-left bg-burgundy" />
        </div>
      </div>
    </div>
  );
}
