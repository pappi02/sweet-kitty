"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

type Variant = "pink" | "dark" | "light" | "ghost";

const styles: Record<Variant, string> = {
  pink: "bg-linear-to-r from-pink-deep via-pink to-pink-soft bg-[length:200%_auto] animate-gradient-x tone-dark text-white shadow-[0_10px_40px_-10px_rgba(255,0,144,0.75)]",
  dark: "tone-dark bg-ink text-white shadow-[0_10px_30px_-12px_rgba(42,15,31,0.6)]",
  light: "tone-dark bg-white text-ink shadow-[0_10px_30px_-14px_rgba(42,15,31,0.35)]",
  ghost: "bg-white/5 text-white ring-1 ring-white/20 backdrop-blur-md hover:bg-white/10",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
} & (({ href: string } & Omit<ComponentProps<"a">, "className" | "children">) | ({ href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">));

/** Pill button with a light sweep, spring press and glow. Renders <a> when given href. */
export function ShimmerButton({ children, variant = "pink", size = "md", className, ...rest }: Props) {
  const classes = cn(
    "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-wide transition-[background,box-shadow,opacity] disabled:pointer-events-none disabled:opacity-50",
    size === "lg" ? "h-11 px-5 text-[13px] sm:h-12 sm:px-7 sm:text-sm" : "h-10 px-4 text-[13px] sm:px-5",
    styles[variant],
    className,
  );
  const inner = (
    <>
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-linear-to-r from-transparent via-white/45 to-transparent" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );
  const motionProps = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.96 }, transition: { type: "spring", stiffness: 400, damping: 20 } } as const;

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...a } = rest as ComponentProps<"a"> & { href: string };
    // Internal pages go through Next's Link for instant, animated navigation.
    if (href.startsWith("/")) {
      return (
        <MotionLink href={href} className={classes} {...motionProps} {...(a as object)}>
          {inner}
        </MotionLink>
      );
    }
    return (
      <motion.a href={href} className={classes} {...motionProps} {...(a as object)}>
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.button className={classes} {...motionProps} {...(rest as object)}>
      {inner}
    </motion.button>
  );
}
