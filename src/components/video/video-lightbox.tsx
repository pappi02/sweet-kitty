"use client";

import { AnimatePresence, motion, type PanInfo } from "motion/react";
import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { videoSrc, type Video } from "@/lib/videos";
import { cn } from "@/lib/utils";
import { ChevronIcon, CloseIcon, PlayIcon } from "../ui/icons";

type Ctx = { open: (list: Video[], index?: number) => void };
const LightboxContext = createContext<Ctx | null>(null);

export function useVideoLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useVideoLightbox must be used inside VideoLightboxProvider");
  return ctx;
}

export function VideoLightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ list: Video[]; index: number } | null>(null);
  const open = useCallback((list: Video[], index = 0) => setState({ list, index }), []);
  const setIndex = useCallback((index: number) => setState((s) => (s ? { ...s, index } : s)), []);
  const close = useCallback(() => setState(null), []);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>{state && <Player key="player" list={state.list} index={state.index} setIndex={setIndex} onClose={close} />}</AnimatePresence>
    </LightboxContext.Provider>
  );
}

function SoundIcon({ muted, className }: { muted: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4.5 9.5h3l4.5-3.8v12.6l-4.5-3.8h-3z" fill="currentColor" stroke="none" />
      {muted ? <path d="M16 9.5l5 5M21 9.5l-5 5" /> : <path d="M15.6 9a4.2 4.2 0 0 1 0 6M18.2 6.6a7.6 7.6 0 0 1 0 10.8" />}
    </svg>
  );
}

/** Story-style full-screen player: segmented progress, tap zones, swipe down to close. */
function Player({ list, index, setIndex, onClose }: { list: Video[]; index: number; setIndex: (i: number) => void; onClose: () => void }) {
  const video = list[index];
  const ref = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);

  const next = useCallback(() => (index < list.length - 1 ? setIndex(index + 1) : onClose()), [index, list.length, setIndex, onClose]);
  const prev = useCallback(() => setIndex(Math.max(0, index - 1)), [index, setIndex]);
  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }, []);

  // Lock page scroll while open.
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, toggle, onClose]);

  // Start each clip from its start time; fall back to muted if the browser blocks sound.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setProgress(0);
    el.currentTime = video.start ?? 0;
    el.play().catch(() => {
      el.muted = true;
      setMuted(true);
      el.play().catch(() => {});
    });
  }, [video]);

  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

  function onTime() {
    const el = ref.current;
    if (!el || !el.duration) return;
    const start = video.start ?? 0;
    setProgress(Math.min(1, Math.max(0, (el.currentTime - start) / (el.duration - start))));
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  }

  return (
    <motion.div
      className="tone-dark fixed inset-0 z-90 flex items-center justify-center bg-ink/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal
      aria-label={video.title}
    >
      {/* Ambient wash from the poster */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <Image src={video.poster} alt="" fill sizes="100vw" className="scale-125 object-cover blur-3xl" />
      </div>

      <button onClick={onClose} className="absolute inset-0 hidden cursor-default lg:block" aria-label="Close video" tabIndex={-1} />

      {/* Prev / next on desktop */}
      <button
        onClick={prev}
        disabled={index === 0}
        className="relative z-10 mr-6 hidden size-12 place-items-center rounded-full text-white ring-1 ring-white/20 transition hover:bg-white/10 disabled:opacity-30 lg:grid"
        aria-label="Previous video"
      >
        <ChevronIcon dir="left" className="size-5" />
      </button>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={onDragEnd}
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 20 }}
        transition={{ type: "spring", stiffness: 420, damping: 36 }}
        className="relative z-10 h-svh w-full overflow-hidden bg-ink lg:aspect-9/16 lg:h-[min(88svh,860px)] lg:w-auto lg:rounded-sm lg:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]"
      >
        <video
          ref={ref}
          src={videoSrc(video)}
          poster={video.poster}
          playsInline
          onTimeUpdate={onTime}
          onEnded={next}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Tap zones: left = back, middle = pause, right = next */}
        <div className="absolute inset-0 z-10 grid grid-cols-[1fr_1.4fr_1fr]">
          <button onClick={prev} aria-label="Previous video" />
          <button onClick={toggle} aria-label={paused ? "Play" : "Pause"} />
          <button onClick={next} aria-label="Next video" />
        </div>

        <AnimatePresence>
          {paused && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-20 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-md"
            >
              <PlayIcon className="ml-1 size-8" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Top: progress segments + title + controls */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-linear-to-b from-ink/80 via-ink/30 to-transparent px-4 pb-10 pt-[max(0.9rem,env(safe-area-inset-top))]">
          <div className="flex gap-1">
            {list.map((v, i) => (
              <span key={v.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
                <span
                  className="block h-full origin-left rounded-full bg-white"
                  style={{ transform: `scaleX(${i < index ? 1 : i === index ? progress : 0})` }}
                />
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="rounded-full bg-burgundy px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">{video.tag}</span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">{video.title}</span>
            <button
              onClick={() => setMuted((m) => !m)}
              className="pointer-events-auto grid size-10 place-items-center rounded-full text-white transition hover:bg-white/10"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              <SoundIcon muted={muted} className="size-5" />
            </button>
            <button onClick={onClose} className="pointer-events-auto grid size-10 place-items-center rounded-full text-white transition hover:bg-white/10" aria-label="Close">
              <CloseIcon className="size-5" />
            </button>
          </div>
        </div>

        {/* Bottom caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-ink/85 via-ink/40 to-transparent px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12">
          <p className="font-display text-2xl italic leading-tight text-white">{video.caption}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
            {String(index + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")} · My Sweet Kitty
          </p>
        </div>
      </motion.div>

      <button
        onClick={next}
        className="relative z-10 ml-6 hidden size-12 place-items-center rounded-full text-white ring-1 ring-white/20 transition hover:bg-white/10 lg:grid"
        aria-label="Next video"
      >
        <ChevronIcon className="size-5" />
      </button>

      {/* Up next (desktop) */}
      {list.length > 1 && (
        <div className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Up next</p>
          {list.map((v, i) =>
            i === index ? null : (
              <button
                key={v.id}
                onClick={() => setIndex(i)}
                className={cn("group relative h-24 w-[54px] overflow-hidden rounded-sm ring-1 ring-white/15 transition hover:ring-white/60")}
                aria-label={`Play ${v.title}`}
              >
                <Image src={v.poster} alt="" fill sizes="54px" className="object-cover opacity-70 transition group-hover:opacity-100" />
              </button>
            ),
          )}
        </div>
      )}
    </motion.div>
  );
}
