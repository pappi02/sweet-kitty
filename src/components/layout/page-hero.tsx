"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Aurora, Sparkles } from "../ui/decor";
import { ease, WordReveal } from "../ui/reveal";

/**
 * Editorial opener for inner pages: issue number, oversized serif title,
 * short intro and a breadcrumb rule. `children` adds a page-specific extra.
 */
export function PageHero({
  index,
  label,
  title,
  accent,
  intro,
  children,
}: {
  index: string;
  label: string;
  title: string;
  accent: string;
  intro: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="grain tone-light relative isolate overflow-hidden bg-sky-light pb-6 pt-24 text-white lg:pb-8 lg:pt-28">
      <Aurora intensity="soft" />
      <div aria-hidden className="candy-stripes absolute inset-x-0 bottom-0 h-1.5" />
      <Sparkles count={10} seed={index.length * 7 + label.length} className="opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex items-center gap-4">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="font-display text-base italic text-pink">
            N°{index}
          </motion.span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease }}
            className="h-px w-16 origin-left bg-ink/30 sm:w-24"
          />
          <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/75">
            {label}
          </motion.span>
        </div>

        <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-10">
          <h1 className="font-display text-[clamp(2.3rem,9.5vw,4.75rem)] font-medium leading-[0.92] tracking-tight">
            <WordReveal text={title} onLoad />{" "}
            <motion.span
              initial={{ opacity: 0, y: "0.3em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
              className="text-gradient-pink inline-block italic"
            >
              {accent}
            </motion.span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.25, ease }} className="max-w-sm text-sm sm:text-[15px] leading-relaxed text-white/82 lg:pb-3">
            {intro}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-6 flex items-center justify-between border-t border-white/15 pt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/65"
        >
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link href="/" className="transition-colors hover:text-pink-deep">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">{label}</span>
          </nav>
          <span className="hidden items-center gap-3 sm:flex">
            Scroll
            <span className="relative h-6 w-px overflow-hidden bg-white/20">
              <motion.span
                className="absolute inset-x-0 top-0 h-2 bg-pink"
                animate={{ y: [-8, 24] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </span>
        </motion.div>

        {children}
      </div>
    </section>
  );
}
