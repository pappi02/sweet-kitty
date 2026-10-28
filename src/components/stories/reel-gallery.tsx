"use client";

import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { videos, type Video, type VideoTag } from "@/lib/videos";
import { cn } from "@/lib/utils";
import { ReelCard } from "../video/reel-card";
import { useVideoLightbox } from "../video/video-lightbox";

const tags: ("All" | VideoTag)[] = ["All", ...Array.from(new Set(videos.map((v) => v.tag)))];

function Column({ children, y, className }: { children: ReactNode; y: MotionValue<number> | number; className?: string }) {
  return (
    <motion.div style={{ y }} className={cn("flex flex-col gap-3 lg:gap-4", className)}>
      {children}
    </motion.div>
  );
}

/** Filterable wall of reels. On desktop the middle column drifts against the outer ones. */
export function ReelGallery() {
  const { open } = useVideoLightbox();
  const [tag, setTag] = useState<(typeof tags)[number]>("All");
  const list = tag === "All" ? videos : videos.filter((v) => v.tag === tag);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const counter = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  // Deal reels into three columns for desktop.
  const cols: { v: Video; i: number }[][] = [[], [], []];
  list.forEach((v, i) => cols[i % 3].push({ v, i }));

  const card = ({ v, i }: { v: Video; i: number }) => (
    <motion.div
      key={v.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: i * 0.04 }}
    >
      <ReelCard video={v} index={videos.indexOf(v)} onOpen={() => open(list, i)} />
    </motion.div>
  );

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-sm italic text-pink">The reel wall</p>
            <h2 className="mt-2 font-display text-[clamp(1.85rem,6.4vw,2.85rem)] leading-[1.04]">
              Every glow, <span className="text-gradient-pink italic">on camera.</span>
            </h2>
          </div>
          <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:px-0" role="tablist" aria-label="Filter videos">
            {tags.map((t) => {
              const active = tag === t;
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTag(t)}
                  className={cn("relative shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors", active ? "text-white" : "text-ink/70 hover:text-ink")}
                >
                  {active && <motion.span layoutId="reel-pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} className="absolute inset-0 rounded-full bg-ink" />}
                  <span className="relative">{t}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phones & tablets: two columns */}
        <div className="mx-auto mt-7 grid max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:hidden">
          <AnimatePresence mode="popLayout">{list.map((v, i) => card({ v, i }))}</AnimatePresence>
        </div>

        {/* Desktop: three drifting columns */}
        <div ref={ref} className="mx-auto mt-8 hidden max-w-[44rem] grid-cols-3 gap-4 lg:grid">
          <Column y={counter}>
            <AnimatePresence mode="popLayout">{cols[0].map(card)}</AnimatePresence>
          </Column>
          <Column y={drift} className="pt-16">
            <AnimatePresence mode="popLayout">{cols[1].map(card)}</AnimatePresence>
          </Column>
          <Column y={counter}>
            <AnimatePresence mode="popLayout">{cols[2].map(card)}</AnimatePresence>
          </Column>
        </div>
      </div>
    </section>
  );
}
