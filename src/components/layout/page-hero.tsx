"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ease, WordReveal } from "../ui/reveal";

/** Opener for inner pages: breadcrumb, large serif title and short intro. `children` adds a page-specific extra. */
export function PageHero({
  label,
  title,
  accent,
  intro,
  children,
}: {
  index?: string;
  label: string;
  title: string;
  accent: string;
  intro: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="bg-rose tone-light pb-8 pt-28 text-white lg:pb-12 lg:pt-32">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          <Link href="/" className="transition-colors hover:text-accent">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-white">{label}</span>
        </nav>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-10">
          <h1 className="font-display text-[clamp(2.34rem,7.65vw,4.2rem)] font-normal leading-[0.98]">
            <WordReveal text={title} onLoad />{" "}
            <motion.span initial={{ opacity: 0, y: "0.3em" }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease }} className="inline-block italic text-accent">
              {accent}
            </motion.span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25, ease }} className="max-w-sm text-base leading-relaxed text-white/85 lg:pb-2">
            {intro}
          </motion.div>
        </div>

        {children}
      </div>
    </section>
  );
}
