import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Four-point star, used as a small separator. */
export function Star4({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 0c.9 6.6 5.4 11.1 12 12-6.6.9-11.1 5.4-12 12-.9-6.6-5.4-11.1-12-12C6.6 11.1 11.1 6.6 12 0Z" fill="currentColor" />
    </svg>
  );
}

/** Small uppercase label above section titles. */
export function Eyebrow({ children, className, dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return <span className={cn("inline-block text-xs font-semibold uppercase tracking-[0.2em]", dark ? "text-accent-soft" : "text-accent", className)}>{children}</span>;
}
