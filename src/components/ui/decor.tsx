import type { CSSProperties } from "react";
import { cn, seeded } from "@/lib/utils";

/** Four-point star used for sparkles. */
export function Star4({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 0c.9 6.6 5.4 11.1 12 12-6.6.9-11.1 5.4-12 12-.9-6.6-5.4-11.1-12-12C6.6 11.1 11.1 6.6 12 0Z" fill="currentColor" />
    </svg>
  );
}

/** Field of twinkling sparkles. Positions are seeded so server and client render the same. */
export function Sparkles({ count = 18, seed = 7, className }: { count?: number; seed?: number; className?: string }) {
  const rand = seeded(seed);
  const items = Array.from({ length: count }, () => ({
    top: rand() * 100,
    left: rand() * 100,
    size: 6 + rand() * 12,
    delay: rand() * 3,
    duration: 2.4 + rand() * 2.4,
  }));
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      {items.map((s, i) => (
        <Star4
          key={i}
          className="absolute animate-twinkle text-pink-soft"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Soft moving pink glows behind a section. */
export function Aurora({ className, intensity = "strong" }: { className?: string; intensity?: "strong" | "soft" }) {
  const o = intensity === "strong" ? "opacity-70" : "opacity-40";
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className={cn("absolute -left-1/4 -top-1/4 h-[70vmax] w-[70vmax] animate-aurora rounded-full bg-[radial-gradient(circle,rgba(255,0,144,0.55),transparent_65%)] will-change-transform", o)} />
      <div
        className={cn("absolute -bottom-1/3 -right-1/4 h-[60vmax] w-[60vmax] animate-aurora rounded-full bg-[radial-gradient(circle,rgba(255,180,220,0.6),transparent_65%)] will-change-transform", o)}
        style={{ animationDelay: "-6s" }}
      />
      <div
        className={cn("absolute left-1/3 top-1/3 h-[40vmax] w-[40vmax] animate-aurora rounded-full bg-[radial-gradient(circle,rgba(255,140,200,0.35),transparent_65%)] will-change-transform", o)}
        style={{ animationDelay: "-11s" }}
      />
    </div>
  );
}

/** Small uppercase label above section titles. */
export function Eyebrow({ children, className, dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]",
        dark ? "bg-white/5 text-pink-soft ring-1 ring-white/10" : "bg-pink/10 text-pink-deep ring-1 ring-pink/15",
        className,
      )}
    >
      <Star4 className="size-2" />
      {children}
    </span>
  );
}
