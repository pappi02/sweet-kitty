"use client";

import { animate, motion, useInView, useMotionTemplate, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { getVideo, videoSrc } from "@/lib/videos";
import { cn } from "@/lib/utils";
import { useAutoplay } from "./use-autoplay";

/** Drag the divider to compare the Before and After videos. */
export function CompareVideos({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLVideoElement>(null);
  const afterRef = useRef<HTMLVideoElement>(null);
  const dragging = useRef(false);
  const pos = useMotionValue(50);
  const clip = useMotionTemplate`inset(0 0 0 ${pos}%)`;
  const left = useMotionTemplate`${pos}%`;
  const beforeLabel = useTransform(pos, [8, 22], [0, 1]);
  const afterLabel = useTransform(pos, [78, 92], [1, 0]);
  const inView = useInView(wrap, { once: true, amount: 0.5 });

  useAutoplay(beforeRef);
  useAutoplay(afterRef);

  // A quick sweep shows people the divider moves.
  useEffect(() => {
    if (!inView) return;
    const c = animate(pos, [50, 28, 72, 50], { duration: 1.6, ease: "easeInOut", delay: 0.2 });
    return () => c.stop();
  }, [inView, pos]);

  function setFromPointer(e: PointerEvent<HTMLDivElement>) {
    const r = wrap.current!.getBoundingClientRect();
    pos.set(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  }

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") pos.set(Math.max(0, pos.get() - 5));
    if (e.key === "ArrowRight") pos.set(Math.min(100, pos.get() + 5));
  }

  // A matched pair: same bedroom, same camera, so the slider lines up.
  const before = getVideo("compare-before");
  const after = getVideo("compare-after");

  return (
    <div
      ref={wrap}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromPointer(e);
      }}
      onPointerMove={(e) => dragging.current && setFromPointer(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      className={cn("tone-dark relative isolate cursor-ew-resize touch-pan-y select-none overflow-hidden bg-ink", className)}
    >
      <video ref={beforeRef} src={videoSrc(before)} poster={before.poster} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover saturate-[0.6]" />
      <motion.div style={{ clipPath: clip }} className="absolute inset-0">
        <video ref={afterRef} src={videoSrc(after)} poster={after.poster} muted loop playsInline preload="none" className="h-full w-full object-cover" />
      </motion.div>

      <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-ink/30" />

      <motion.span style={{ opacity: beforeLabel }} className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white ring-1 ring-white/25 backdrop-blur-md">
        Before
      </motion.span>
      <motion.span style={{ opacity: afterLabel }} className="pointer-events-none absolute right-4 top-4 rounded-full bg-burgundy px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white">
        After
      </motion.span>

      {/* Divider */}
      <motion.div style={{ left }} className="pointer-events-none absolute inset-y-0 w-0">
        <span className="absolute inset-y-0 -left-px w-[2px] bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          onKeyDown={onKey}
          className="pointer-events-auto absolute left-0 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-accent shadow-[0_10px_30px_-5px_rgba(0,0,0,0.4)] outline-none ring-accent focus-visible:ring-4"
        >
          <svg viewBox="0 0 32 16" className="w-6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 3L4 8l5 5M23 3l5 5-5 5" />
            <path d="M14 8h4" />
          </svg>
        </div>
      </motion.div>

      <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-white/80">Drag to compare</p>
    </div>
  );
}
