"use client";

import { useEffect, type RefObject } from "react";

/**
 * Plays a muted video while it is on screen and pauses it when it leaves,
 * so a page full of videos only decodes the ones you can see.
 */
export function useAutoplay(ref: RefObject<HTMLVideoElement | null>, { threshold = 0.35, enabled = true } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.preload === "none") el.preload = "auto";
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold },
    );
    io.observe(el);
    // Also pause when the page is hidden (Next keeps visited pages mounted in the background).
    return () => {
      io.disconnect();
      el.pause();
    };
  }, [ref, threshold, enabled]);
}
