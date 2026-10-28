"use client";

import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { getProduct, type Product } from "@/lib/products";

type Line = { id: string; qty: number };
type CartItem = { product: Product; qty: number; lineTotal: number };

type CartContext = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** Bumps whenever something is added, so the cart icon can bounce. */
  pulse: number;
};

const Ctx = createContext<CartContext | null>(null);

// Cart lines live in a tiny store backed by this browser's localStorage.
const KEY = "sweet-kitty-cart";
const EMPTY: Line[] = [];
const listeners = new Set<() => void>();
let cache: Line[] | null = null;

function readLines(): Line[] {
  if (cache) return cache;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(saved) ? saved.filter((l: Line) => getProduct(l.id)?.price != null && l.qty > 0) : [];
  } catch {
    cache = [];
  }
  return cache!;
}

function setLines(update: (lines: Line[]) => Line[]) {
  cache = update(readLines());
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, readLines, () => EMPTY);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);

  // Lock page scroll while the drawer is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const add = useCallback((id: string, qty = 1) => {
    if (getProduct(id)?.price == null) return;
    setLines((ls) => {
      const found = ls.find((l) => l.id === id);
      return found ? ls.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...ls, { id, qty }];
    });
    setPulse((p) => p + 1);
    setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty } : l))));
  }, []);

  const remove = useCallback((id: string) => setLines((ls) => ls.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines(() => []), []);

  const value = useMemo<CartContext>(() => {
    const items = lines
      .map((l) => {
        const product = getProduct(l.id);
        return product && product.price != null ? { product, qty: l.qty, lineTotal: product.price * l.qty } : null;
      })
      .filter((x): x is CartItem => x !== null);
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.lineTotal, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
      pulse,
    };
  }, [lines, open, add, setQty, remove, clear, pulse]);

  return (
    <MotionConfig reducedMotion="user">
      <Ctx.Provider value={value}>{children}</Ctx.Provider>
    </MotionConfig>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
