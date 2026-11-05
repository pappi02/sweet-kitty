"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Card with a pink radial glow that follows the pointer (Magic UI / Aceternity "card spotlight"). */
export function SpotlightCard({ children, className, glow = "rgba(115,6,44,0.22)" }: { children: ReactNode; className?: string; glow?: string }) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, ${glow}, transparent 70%)`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  }

  return (
    <div onPointerMove={onMove} onPointerLeave={() => (x.set(-400), y.set(-400))} className={cn("group relative overflow-hidden", className)}>
      <motion.div className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300" style={{ background: bg }} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

/** Gentle 3D tilt on pointer devices. Touch devices get a flat card (no jitter while scrolling). */
export function TiltCard({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 18 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  return (
    <div style={{ perspective: 1000 }} className={cn("h-full", className)}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={() => (px.set(0.5), py.set(0.5))}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
