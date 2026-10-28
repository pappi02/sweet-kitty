"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;
// Trigger a little before the element is fully on screen so nothing waits on the user.
const viewport = { once: true, margin: "0px 0px -8% 0px" } as const;

/** Quick fade-and-lift when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const Tag = motion[as];
  return (
    <Tag className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport} transition={{ duration: 0.5, delay, ease }}>
      {children}
    </Tag>
  );
}

const wordChild: Variants = {
  hidden: { opacity: 0, y: "0.35em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

/** Reveals a line word by word. */
export function WordReveal({ text, className, stagger = 0.035, onLoad = false, delay = 0 }: { text: string; className?: string; stagger?: number; onLoad?: boolean; delay?: number }) {
  const words = text.split(" ");
  const trigger = onLoad ? { animate: "show" } : { whileInView: "show", viewport };
  return (
    <motion.span
      className={className}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      initial="hidden"
      {...trigger}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={wordChild} className="inline-block whitespace-pre">
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

export const stagger = {
  parent: (delayChildren = 0, staggerChildren = 0.05): Variants => ({
    hidden: {},
    show: { transition: { delayChildren, staggerChildren } },
  }),
  child: {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  } satisfies Variants,
  viewport,
};
