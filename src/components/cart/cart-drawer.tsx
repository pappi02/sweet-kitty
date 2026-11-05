"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { kit } from "@/lib/products";
import { whatsappLink } from "@/lib/site";
import { formatKES } from "@/lib/utils";
import { Star4 } from "../ui/decor";
import { ArrowIcon, CloseIcon, MinusIcon, PlusIcon, WhatsAppIcon } from "../ui/icons";
import { ProductVisual } from "../ui/product-visual";
import { Button } from "../ui/button";
import { useCart } from "./cart-provider";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, count, add } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const hasKit = items.some((i) => i.product.id === kit.id);
  const message = [
    "Hi Sweet Kitty! I'd like to order:",
    ...items.map((i) => `• ${i.qty} × ${i.product.name} (${formatKES(i.lineTotal)})`),
    `Total: ${formatKES(subtotal)}`,
  ].join("\n");

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-70">
          <motion.button
            aria-label="Close bag"
            className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Your bag"
            className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-cream shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 40 }}
          >
            <header className="flex items-center justify-between px-6 pb-4 pt-6">
              <p className="font-display text-3xl">
                Your bag <span className="align-top text-sm tabular-nums text-accent">({count})</span>
              </p>
              <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full ring-1 ring-ink/10 transition hover:bg-ink hover:text-white" aria-label="Close">
                <CloseIcon className="size-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl italic">Nothing here… yet.</p>
                  <p className="mt-2 max-w-[16rem] text-sm text-ink/72">Your glow-up is one tap away. Most women start with the 7-Day Kit.</p>
                  <Button onClick={() => add(kit.id)} className="mt-6">
                    Add the 7-Day Kit
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-ink/10 border-y border-ink/10">
                  <AnimatePresence initial={false}>
                    {items.map(({ product, qty, lineTotal }) => (
                      <motion.li
                        key={product.id}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 py-4"
                      >
                        <ProductVisual product={product} className="h-24 w-20 shrink-0 rounded-sm" />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="font-display text-lg leading-tight">{product.name}</p>
                          <p className="mt-0.5 text-xs text-ink/70">{formatKES(product.price!)}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-full ring-1 ring-ink/15">
                              <button onClick={() => setQty(product.id, qty - 1)} className="grid size-8 place-items-center" aria-label="Decrease">
                                <MinusIcon className="size-3.5" />
                              </button>
                              <span className="w-5 text-center text-sm tabular-nums">{qty}</span>
                              <button onClick={() => setQty(product.id, qty + 1)} className="grid size-8 place-items-center" aria-label="Increase">
                                <PlusIcon className="size-3.5" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold tabular-nums">{formatKES(lineTotal)}</p>
                              <button onClick={() => remove(product.id)} className="text-xs text-ink/60 underline-offset-2 transition hover:text-accent hover:underline">
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {items.length > 0 && !hasKit && (
                <button onClick={() => add(kit.id)} className="group mt-3 flex w-full items-center justify-between gap-4 rounded-sm bg-ink p-5 text-left text-white">
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-accent-soft">Upgrade your glow</span>
                    <span className="mt-1 block text-sm text-white/75">
                      Four signature rituals in the <span className="text-white">7-Day Kit</span>, {formatKES(kit.price!)}.
                    </span>
                  </span>
                  <ArrowIcon className="w-7 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>

            {items.length > 0 && (
              <footer className="space-y-4 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/70">Subtotal</span>
                  <span className="font-display text-3xl tabular-nums">{formatKES(subtotal)}</span>
                </div>
                <Button href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" size="lg" className="w-full">
                  <WhatsAppIcon className="size-4" /> Checkout on WhatsApp
                </Button>
                <p className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.16em] text-ink/65">
                  Discreet packaging <Star4 className="size-2 text-accent" /> Order on WhatsApp
                </p>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
