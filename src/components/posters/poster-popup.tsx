"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { canShowPoster, parseSeen, recordShowing } from "@/lib/posters/frequency";
import type { PublicPoster } from "@/lib/posters/schema";
import { nairobiDay } from "@/lib/posters/time";
import { CloseIcon } from "../ui/icons";

// Pages where a pop-up would interrupt something: the admin and paying.
const HIDDEN_PREFIXES = ["/admin", "/pay"];

// Each poster shows up to its "times per day" on each device, at least 30 minutes
// apart (lib/posters/frequency). The count for the Nairobi day is kept in
// localStorage, so another device keeps its own count and the next day starts again.
const seenKey = (id: string) => `sweet-kitty-poster-seen:${id}`;
const FEED_TTL_MS = 5 * 60 * 1000;

function readSeen(id: string) {
  try {
    return parseSeen(window.localStorage.getItem(seenKey(id)));
  } catch {
    return null;
  }
}

function canShowNow(p: PublicPoster) {
  return Date.parse(p.endsAt) > Date.now() && canShowPoster(readSeen(p.id), nairobiDay(), Date.now(), p.timesPerDay);
}

function markShown(id: string) {
  try {
    window.localStorage.setItem(seenKey(id), JSON.stringify(recordShowing(readSeen(id), nairobiDay(), Date.now())));
  } catch {
    // Storage blocked: it may show again on the next page load. Harmless.
  }
}

/**
 * The poster itself: the image at up to 85% of the screen, a close button and a
 * countdown bar that pauses while the pointer or focus is on it. A timer (not a CSS
 * animation) closes it, so reduced-motion settings can't make it vanish at once.
 * Shared with the admin preview.
 */
export function PosterView({ poster, onClose }: { poster: Pick<PublicPoster, "title" | "image" | "displaySeconds"> & { detailsUrl: string | null }; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);
  const [left, setLeft] = useState(1);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Counts real elapsed time (not timer ticks, which drift on busy phones), and
  // stops counting while paused.
  useEffect(() => {
    if (paused) return;
    const total = poster.displaySeconds * 1000;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const step = (now - last) / total;
      last = now;
      setLeft((l) => Math.max(0, l - step));
    }, 100);
    return () => clearInterval(id);
  }, [paused, poster.displaySeconds]);

  useEffect(() => {
    if (left <= 0) onClose();
  }, [left, onClose]);

  // eslint-disable-next-line @next/next/no-img-element -- sized by the viewport, from Blob or /uploads
  const image = <img src={poster.image} alt={poster.title} className="block max-h-[85svh] w-auto max-w-[90vw] rounded-2xl object-contain shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]" />;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={poster.title}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative"
        onClick={(e) => e.stopPropagation()}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {poster.detailsUrl ? (
          <Link href={poster.detailsUrl} onClick={onClose} aria-label={`${poster.title}: see the offer`} className="block">
            {image}
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-burgundy/90 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg">Tap for details</span>
          </Link>
        ) : (
          image
        )}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close poster"
          className="absolute -right-3 -top-3 grid size-11 place-items-center rounded-full bg-white text-burgundy shadow-lg ring-1 ring-burgundy/20 transition hover:bg-burgundy hover:text-white"
        >
          <CloseIcon className="size-5" />
        </button>
        <div className="absolute inset-x-4 bottom-2 h-1 overflow-hidden rounded-full bg-white/25" aria-hidden>
          <div className="h-full origin-left rounded-full bg-rose transition-transform duration-100 ease-linear" style={{ transform: `scaleX(${left})` }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Site-wide pop-up, mounted once in the root layout. Shows the highest-priority
 * running poster (see /admin/posters) a few seconds after the visitor arrives on a
 * page, up to its times per day on each device, never while another is showing.
 */
export function PosterPopup() {
  const pathname = usePathname();
  const hidden = Boolean(pathname && HIDDEN_PREFIXES.some((p) => pathname.startsWith(p)));
  const [shown, setShown] = useState<PublicPoster | null>(null);
  const showingRef = useRef(false);
  const feedRef = useRef<{ at: number; posters: PublicPoster[] } | null>(null);

  useEffect(() => {
    if (hidden) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const arrivedAt = Date.now();

    const cached = feedRef.current;
    const feed: Promise<PublicPoster[]> =
      cached && Date.now() - cached.at < FEED_TTL_MS
        ? Promise.resolve(cached.posters)
        : fetch("/api/posters/active")
            .then((r) => (r.ok ? r.json() : { data: [] }))
            .then((payload: { data?: PublicPoster[] }) => {
              const posters = payload.data ?? [];
              feedRef.current = { at: Date.now(), posters };
              return posters;
            });

    feed
      .then((posters) => {
        if (cancelled || showingRef.current) return;
        const poster = posters.find(canShowNow);
        if (!poster) return;
        // Loaded before it's shown, so it never pops up as an empty frame.
        const preload = new Image();
        preload.onload = () => {
          if (cancelled) return;
          timer = setTimeout(() => {
            if (cancelled || showingRef.current || !canShowNow(poster)) return;
            markShown(poster.id);
            showingRef.current = true;
            setShown(poster);
          }, Math.max(0, poster.delaySeconds * 1000 - (Date.now() - arrivedAt)));
        };
        preload.src = poster.image;
      })
      .catch(() => {
        // No poster this time.
      });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [hidden, pathname]);

  const close = useCallback(() => {
    showingRef.current = false;
    setShown(null);
  }, []);

  return <AnimatePresence>{shown && !hidden && <PosterView key={shown.id} poster={shown} onClose={close} />}</AnimatePresence>;
}
