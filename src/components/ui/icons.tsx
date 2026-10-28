// Bespoke Sweet Kitty icon set. Hairline strokes, soft round joints,
// drawn to match the logo's elegant serif style.
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Shopping bag with a tiny sparkle on the front. */
export function BagIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M5.6 8.6h12.8l-.9 10.6a1.7 1.7 0 0 1-1.7 1.5H8.2a1.7 1.7 0 0 1-1.7-1.5L5.6 8.6Z" />
      <path d="M9.2 8.6V7.2a2.8 2.8 0 0 1 5.6 0v1.4" />
      <path d="M12 12.4c.2 1.1.8 1.7 1.9 1.9-1.1.2-1.7.8-1.9 1.9-.2-1.1-.8-1.7-1.9-1.9 1.1-.2 1.7-.8 1.9-1.9Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Asymmetric two-line menu. */
export function MenuIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M4 9h16" />
      <path d="M10 15h10" />
    </svg>
  );
}

export function CloseIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function PlusIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

export function MinusIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M5.5 12h13" />
    </svg>
  );
}

/** Long hairline arrow. */
export function ArrowIcon(p: P) {
  return (
    <svg {...base} viewBox="0 0 32 24" {...p}>
      <path d="M3 12h25M22 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M5.5 12.6l4 3.9L18.5 7.5" />
    </svg>
  );
}

export function PlayIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...p}>
      <path d="M8.5 6.3v11.4a.9.9 0 0 0 1.37.77l9.1-5.7a.9.9 0 0 0 0-1.54l-9.1-5.7A.9.9 0 0 0 8.5 6.3Z" fill="currentColor" />
    </svg>
  );
}

/** Chat bubble with a handset: the WhatsApp gesture, drawn in our own hand. */
export function WhatsAppIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3.6a8.4 8.4 0 0 0-7.2 12.7L3.7 20.3l4.1-1.1A8.4 8.4 0 1 0 12 3.6Z" />
      <path
        d="M9.3 8.4c.2-.3.4-.3.6-.3h.5c.2 0 .4 0 .5.4l.6 1.4c.1.2 0 .4-.1.6l-.4.5c-.1.1-.2.3 0 .5.3.6.8 1.1 1.3 1.6.5.4 1 .7 1.6.9.2.1.4 0 .5-.1l.5-.6c.2-.2.3-.2.5-.1l1.4.7c.2.1.4.2.4.4 0 .3 0 1-.4 1.4-.4.4-1.1.8-1.7.8-.7 0-1.8-.2-3.3-1.3-1.5-1.1-2.5-2.6-2.8-3.1-.3-.5-.6-1.3-.5-2 .1-.7.4-1.1.6-1.4Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function ChevronIcon({ dir = "right", ...p }: P & { dir?: "left" | "right" | "down" }) {
  const d = dir === "left" ? "M14.5 6l-6 6 6 6" : dir === "down" ? "M6 9.5l6 6 6-6" : "M9.5 6l6 6-6 6";
  return (
    <svg {...base} {...p}>
      <path d={d} />
    </svg>
  );
}

/** Classic five-point star, softened. */
export function StarIcon(p: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...p}>
      <path
        d="M12 3.2l2.5 5.4 5.9.6c.5.1.7.7.3 1l-4.4 4 1.2 5.8c.1.5-.4.9-.9.6L12 17.7l-5.1 2.9c-.5.3-1-.1-.9-.6l1.2-5.8-4.4-4c-.4-.3-.2-.9.3-1l5.9-.6L11.5 3.2c.2-.4.8-.4 1 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
