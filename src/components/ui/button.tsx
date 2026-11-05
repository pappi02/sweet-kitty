"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

type Variant = "primary" | "dark" | "light" | "ghost";

const styles: Record<Variant, string> = {
  primary: "tone-dark bg-burgundy text-white hover:bg-burgundy-bright",
  dark: "tone-dark bg-ink text-white hover:bg-ink-2",
  light: "tone-dark bg-rose text-burgundy hover:bg-blush",
  ghost: "text-white ring-1 ring-white/35 hover:bg-white/10",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
} & (({ href: string } & Omit<ComponentProps<"a">, "className" | "children">) | ({ href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">));

/** The site's button. Renders <a> when given href. */
export function Button({ children, variant = "primary", size = "md", className, ...rest }: Props) {
  const classes = cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-[2px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
    size === "lg" ? "h-12 px-6 text-xs sm:h-13 sm:px-8 sm:text-[13px]" : "h-11 px-5 text-xs",
    styles[variant],
    className,
  );
  const motionProps = { whileTap: { scale: 0.98 } } as const;

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...a } = rest as ComponentProps<"a"> & { href: string };
    // Internal pages go through Next's Link for instant, animated navigation.
    if (href.startsWith("/")) {
      return (
        <MotionLink href={href} className={classes} {...motionProps} {...(a as object)}>
          {children}
        </MotionLink>
      );
    }
    return (
      <motion.a href={href} className={classes} {...motionProps} {...(a as object)}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button className={classes} {...motionProps} {...(rest as object)}>
      {children}
    </motion.button>
  );
}
