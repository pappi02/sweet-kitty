"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { kit } from "@/lib/products";
import { cn, formatKES } from "@/lib/utils";
import { Star4 } from "../ui/decor";
import { BagIcon, CheckIcon } from "../ui/icons";

/** Every scene gets `play`: true while it is the one being shown. */
export type SceneProps = { play: boolean };

export function PhoneFrame({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={style}
      className={cn("tone-dark relative mx-auto aspect-[9/17.5] rounded-[2.6rem] bg-ink p-2 shadow-[0_40px_80px_-30px_rgba(115,6,44,0.55)] ring-1 ring-ink/10", className)}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.15rem] bg-ink-2">
        {children}
        <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
      </div>
    </div>
  );
}

export function VideoScene({ src, label, mood, play }: SceneProps & { src: string; label: string; mood: "before" | "after" }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) v.play().catch(() => {});
    else v.pause();
  }, [play]);

  return (
    <div className="relative h-full w-full">
      <video ref={ref} src={src} poster={src.replace(".mp4", "-poster.jpg")} muted loop playsInline preload="auto" className="h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/60 to-transparent p-4 pt-12">
        <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]", mood === "before" ? "bg-white/15 text-white/80" : "bg-burgundy text-white")}>
          {mood === "before" ? "Before" : "After"}
        </span>
        <p className="mt-2 font-display text-lg italic text-white">{label}</p>
      </div>
    </div>
  );
}

const msgs = [
  { me: false, text: "Babe, you've been so low lately 🥺 what's going on?", d: 0.1 },
  { me: true, text: "I don't even know… I just don't feel like me anymore", d: 0.5 },
  { me: false, text: "Wait… haven't you heard about Sweet Kitty?? 💗", d: 1.1 },
  { me: false, text: "Trust me. 7 days and you won't recognise yourself ✨", d: 1.5 },
];

export function ChatScene({ play }: SceneProps) {
  return (
    <div className="flex h-full flex-col bg-linear-to-b from-ink-3 to-ink">
      <div className="flex items-center gap-3 border-b border-white/5 px-4 pb-3 pt-10">
        <div className="grid size-9 place-items-center rounded-full bg-linear-to-br from-burgundy to-burgundy font-display text-sm italic text-white">B</div>
        <div>
          <p className="text-sm font-semibold text-white">Bestie 💕</p>
          <p className="text-xs text-accent-soft">online</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2 p-3.5">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={play ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
            transition={play ? { delay: m.d, type: "spring", stiffness: 420, damping: 28 } : { duration: 0 }}
            className={cn(
              "max-w-[82%] rounded-sm px-3.5 py-2 text-sm leading-snug",
              m.me ? "ml-auto rounded-br-md bg-burgundy text-white" : "rounded-bl-md bg-white/10 text-white/90",
            )}
          >
            {m.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Looping demo of ordering: a cursor taps "Add to bag" and the order confirms. */
export function OrderScene({ play }: SceneProps) {
  const loop = { repeat: Infinity, duration: 3.6, ease: "easeInOut" as const };
  const run = <T,>(v: T) => (play ? v : undefined);
  return (
    <div className="relative flex h-full flex-col bg-cream px-3.5 pt-10">
      <div className="flex items-center justify-between">
        <Image src="/brand/my-sweet-kitty-512.png" alt="" width={510} height={512} className="h-9 w-auto" />
        <BagIcon className="size-5 text-ink/82" />
      </div>
      <p className="mt-3 font-display text-xl leading-tight text-ink">Your glow-up starts here</p>
      <div className="mt-3 rounded-sm bg-white shadow-sm ring-1 ring-ink/5">
        <div className="relative h-28 overflow-hidden rounded-t-2xl bg-blush">
          <Image src="/products/sweet-kitty-7-day-kit.jpg" alt="" fill sizes="240px" className="object-cover" />
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">Best value</span>
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-ink">{kit.name}</p>
          <p className="text-xs text-ink/70">{formatKES(kit.price!)}</p>
          <div className="relative mt-2.5">
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 -ml-3.5 -mt-3.5 size-7 rounded-full border-2 border-white bg-burgundy/70 shadow-lg"
              initial={{ opacity: 0 }}
              animate={run({ x: [70, 0, 0, 0, 70], y: [110, 0, 0, 0, 110], scale: [1, 1, 0.75, 1, 1], opacity: [0, 1, 1, 1, 0] })}
              transition={{ ...loop, times: [0, 0.3, 0.37, 0.45, 1] }}
            />
            <motion.div
              className="relative grid h-9 place-items-center overflow-hidden rounded-full bg-ink text-xs font-semibold text-white"
              animate={run({ backgroundColor: ["#330412", "#330412", "#73062C", "#73062C", "#330412"], scale: [1, 1, 0.94, 1, 1] })}
              transition={{ ...loop, times: [0, 0.33, 0.4, 0.85, 1] }}
            >
              <motion.span className="col-start-1 row-start-1" animate={run({ opacity: [1, 1, 0, 0, 1] })} transition={{ ...loop, times: [0, 0.35, 0.41, 0.9, 1] }}>
                Add to bag
              </motion.span>
              <motion.span
                className="col-start-1 row-start-1 inline-flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={run({ opacity: [0, 0, 1, 1, 0] })}
                transition={{ ...loop, times: [0, 0.35, 0.41, 0.9, 1] }}
              >
                <CheckIcon className="size-3.5" /> Order placed!
              </motion.span>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        className="mt-3 flex items-center gap-2 rounded-sm bg-ink px-3 py-2.5 text-xs text-white"
        initial={{ opacity: 0 }}
        animate={run({ opacity: [0, 0, 1, 1, 0], y: [8, 8, 0, 0, 8] })}
        transition={{ ...loop, times: [0, 0.45, 0.52, 0.9, 1] }}
      >
        <Star4 className="size-3 text-accent" /> Discreetly packed and on its way 💗
      </motion.div>
    </div>
  );
}

const days = ["Reset", "Energy", "Glow", "Confidence", "Self-love", "Magnetic", "Reborn"];

export function DaysScene({ play }: SceneProps) {
  return (
    <div className="flex h-full flex-col bg-linear-to-b from-ink-3 to-ink px-4 pt-10 text-white">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-soft">Your 7-day ritual</p>
      <p className="mt-1 font-display text-xl italic">Glow level</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-burgundy via-burgundy to-rose"
          initial={false}
          animate={{ width: play ? "100%" : "6%" }}
          transition={play ? { duration: 1.4, ease: "easeInOut" } : { duration: 0 }}
        />
      </div>
      <ul className="mt-3 flex flex-1 flex-col justify-around pb-4">
        {days.map((d, i) => (
          <motion.li
            key={d}
            initial={false}
            animate={{ opacity: play ? 1 : 0.3 }}
            transition={play ? { delay: 0.1 + i * 0.18, duration: 0.25 } : { duration: 0 }}
            className="flex items-center gap-3 border-b border-white/5 pb-1.5"
          >
            <span className="w-6 font-display text-lg italic text-accent-soft">{i + 1}</span>
            <span className="text-sm font-medium">{d}</span>
            <motion.span
              initial={false}
              animate={{ scale: play ? 1 : 0 }}
              transition={play ? { delay: 0.2 + i * 0.18, type: "spring", stiffness: 500, damping: 25 } : { duration: 0 }}
              className="ml-auto"
            >
              <CheckIcon className="size-4 text-accent" />
            </motion.span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
