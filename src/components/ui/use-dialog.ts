"use client";

import { useEffect, useRef, type RefObject } from "react";

// One shared page-scroll lock, so two overlays (say the menu and the bag) can't
// unlock each other's scroll when one of them closes.
let locks = 0;
function lockScroll() {
  if (locks++ === 0) document.documentElement.style.overflow = "hidden";
}
function unlockScroll() {
  if (--locks <= 0) {
    locks = 0;
    document.documentElement.style.overflow = "";
  }
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal behaviour for an overlay while `active`: locks page scroll, moves focus inside,
 * keeps Tab inside, closes on Escape (when `onClose` is given) and hands focus back to
 * whatever opened it.
 */
export function useDialog(ref: RefObject<HTMLElement | null>, active: boolean, onClose?: () => void) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement as HTMLElement | null;
    lockScroll();

    // Wait a frame so the overlay has mounted before focusing into it.
    const raf = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el || el.contains(document.activeElement)) return;
      const first = el.querySelector<HTMLElement>("[data-autofocus]") ?? el.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? el).focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      const el = ref.current;
      if (!el) return;
      if (e.key === "Escape" && closeRef.current) {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !el.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !el.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [active, ref]);
}
