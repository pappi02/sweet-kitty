import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./decor";
import { ArrowIcon } from "./icons";
import { Reveal, WordReveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  accent,
  className,
  dark = false,
  center = false,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  className?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={cn(center && "text-center", className)}>
      <Reveal>
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      </Reveal>
      <h2 className="mt-3 font-display text-[clamp(1.89rem,5.44vw,3.02rem)] leading-[1.02]">
        <WordReveal text={title} /> <span className="text-accent italic">{accent}</span>
      </h2>
    </div>
  );
}

/** Underlined text link with a sliding arrow. */
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-3 text-sm font-semibold text-ink", className)}>
      <span className="border-b border-ink/25 pb-0.5 transition-colors group-hover:border-accent">{children}</span>
      <ArrowIcon className="w-6 text-accent transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
