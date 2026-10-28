"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { activeProducts, categories, kit, singles } from "@/lib/products";
import { site } from "@/lib/site";
import { getVideo } from "@/lib/videos";
import { cn, formatKES } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { BagIcon } from "../ui/icons";
import { ArrowLink } from "../ui/section-heading";
import { ShimmerButton } from "../ui/shimmer-button";
import { AmbientVideo } from "../video/ambient-video";
import { ProductTile } from "./product-tile";

type CategoryId = (typeof categories)[number]["id"];

/** The kit as a tall video tile at the head of the grid. */
function KitFeature({ className }: { className?: string }) {
  const { add } = useCart();
  return (
    <div className={cn("tone-dark group relative isolate min-h-[420px] overflow-hidden rounded-[1.4rem] bg-ink text-white", className)}>
      <AmbientVideo video={getVideo("kit")} className="absolute inset-0 -z-10 transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      <span className="absolute inset-0 -z-10 bg-linear-to-t from-ink/90 via-ink/30 to-ink/20" />

      <div className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.25em]">
          <span className="font-display text-sm normal-case italic tracking-normal text-pink-soft">N°00 · The signature</span>
          <span className="rounded-full bg-pink px-3 py-1.5">{kit.badge}</span>
        </div>
        <div className="mt-auto">
          <h3 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-[0.95]">
            The 7-Day <span className="italic text-pink-soft">Sweet Kitty</span> Kit
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">{kit.tagline}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {kit.includes!.map((i) => (
              <li key={i} className="rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ring-white/25 backdrop-blur-sm">
                {i}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/15 pt-5">
            <span className="font-display text-2xl tabular-nums">{formatKES(kit.price!)}</span>
            <span className="pb-1 text-[11px] font-semibold text-pink-soft">Only {site.kitsLeft} left in this batch</span>
          </div>
          <div className="mt-4 flex gap-3">
            <ShimmerButton href="/the-kit" variant="ghost" className="flex-1">
              Discover
            </ShimmerButton>
            <ShimmerButton onClick={() => add(kit.id)} className="flex-1">
              <BagIcon className="size-4" /> Add
            </ShimmerButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Collection() {
  const [cat, setCat] = useState<CategoryId>("all");
  const count = (id: CategoryId) => (id === "all" ? activeProducts.length : activeProducts.filter((p) => p.category === id).length);
  const shown = cat === "all" ? singles : singles.filter((p) => p.category === cat);
  const showKit = cat === "all" || cat === "kit";

  return (
    <section className="py-10 lg:py-14">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter products">
            {categories.map((c) => {
              const active = cat === c.id;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCat(c.id)}
                  className={cn("relative shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors", active ? "text-white" : "text-ink/70 hover:text-ink")}
                >
                  {active && <motion.span layoutId="cat-pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} className="absolute inset-0 -z-0 rounded-full bg-ink" />}
                  <span className="relative">
                    {c.label}
                    <sup className={cn("ml-1 text-[9px] tabular-nums", active ? "text-pink-soft" : "text-ink/45")}>{count(c.id)}</sup>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink/55">Natural · Discreet · Secret recipe</p>
        </div>

        {/* Grid */}
        <motion.div layout className="mt-7 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 lg:grid-cols-12 lg:gap-x-5 lg:gap-y-7">
          <AnimatePresence mode="popLayout" initial={false}>
            {showKit && (
              <motion.div
                key="kit"
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="col-span-2 lg:col-span-6 lg:row-span-2"
              >
                <KitFeature className="h-full" />
              </motion.div>
            )}
            {cat === "kit" && (
              <motion.div
                key="kit-why"
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="col-span-2 self-center lg:col-span-5 lg:col-start-8"
              >
                <p className="font-display text-sm italic text-pink">Why the kit</p>
                <ol className="mt-4 border-t border-ink/10">
                  {["The full collection in one box", "A guided ritual for all seven days", "The biggest transformation"].map((t, i) => (
                    <li key={t} className="flex items-baseline gap-4 border-b border-ink/10 py-4">
                      <span className="font-display text-sm italic text-pink">0{i + 1}</span>
                      <span className="font-display text-xl">{t}</span>
                    </li>
                  ))}
                </ol>
                <ArrowLink href="/the-kit" className="mt-6">
                  Everything about the kit
                </ArrowLink>
              </motion.div>
            )}
            {shown.map((p, i) => {
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:col-span-3"
                >
                  <ProductTile product={p} index={singles.indexOf(p)} compact />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {shown.length === 0 && !showKit && <p className="py-12 text-center text-ink/60">Nothing here yet.</p>}

        <p className="mt-8 text-center text-sm text-ink/65">
          Can&apos;t decide?{" "}
          <Link href="/contact" className="font-semibold text-ink underline decoration-pink decoration-2 underline-offset-4">
            Ask us on WhatsApp
          </Link>{" "}
          and we&apos;ll help you choose.
        </p>
      </div>
    </section>
  );
}
