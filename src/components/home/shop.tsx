"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { productHref, singles, type Product } from "@/lib/products";
import { whatsappLink } from "@/lib/site";
import { cn, formatKES } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { Eyebrow, Star4 } from "../ui/decor";
import { ArrowIcon, PlusIcon } from "../ui/icons";
import { ProductVisual } from "../ui/product-visual";
import { Reveal, stagger, WordReveal } from "../ui/reveal";

export function Action({ product, dark = false }: { product: Product; dark?: boolean }) {
  const { add } = useCart();
  if (product.price == null) {
    return (
      <a
        href={whatsappLink(`Hi Sweet Kitty! I'm interested in the ${product.name}.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="group/a relative z-10 inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold text-pink-deep ring-1 ring-pink/30 transition-colors hover:bg-pink hover:text-white"
      >
        Ask us <ArrowIcon className="w-5 transition-transform group-hover/a:translate-x-0.5" />
      </a>
    );
  }
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={() => add(product.id)}
      className={cn(
        "relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors",
        dark ? "bg-ink text-white hover:bg-pink" : "bg-ink text-white hover:bg-pink",
      )}
      aria-label={`Add ${product.name} to bag`}
    >
      <PlusIcon className="size-4" /> Add
    </motion.button>
  );
}

export function Price({ product, className }: { product: Product; className?: string }) {
  return product.price != null ? (
    <span className={cn("font-display tabular-nums", className)}>{formatKES(product.price)}</span>
  ) : (
    <span className="text-[11px] font-bold uppercase leading-snug tracking-[0.18em] text-pink-deep">
      Price
      <br className="hidden lg:block" /> coming soon
    </span>
  );
}

/* ---------- Phones: swipe carousel ---------- */

function MobileCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.article variants={stagger.child} className="flex w-[60vw] max-w-[240px] shrink-0 snap-center flex-col">
      <Link href={productHref(product)} aria-label={product.name}>
        <ProductVisual product={product} seed={index + 5} className="aspect-4/5 rounded-[1.25rem]" />
      </Link>
      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-xl leading-tight">
            <Link href={productHref(product)}>{product.name}</Link>
          </h3>
          {product.size && <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">{product.size}</span>}
        </div>
        <p className="mt-1 text-sm text-ink/72">{product.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <Price product={product} className="text-xl" />
          <Action product={product} />
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- Desktop: product index with cursor-follow preview ---------- */

function DesktopIndex() {
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 350, damping: 30 });
  const sy = useSpring(y, { stiffness: 350, damping: 30 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const r = wrap.current!.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  }

  return (
    <div ref={wrap} onPointerMove={onMove} onPointerLeave={() => setHover(null)} className="relative mt-8 hidden lg:block">
      <motion.ul initial="hidden" whileInView="show" viewport={stagger.viewport} variants={stagger.parent(0, 0.06)} className="border-t border-ink/10">
        {singles.map((p, i) => (
          <motion.li
            key={p.id}
            variants={stagger.child}
            onPointerEnter={() => setHover(i)}
            className="group relative isolate grid grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1fr)_10rem_8rem] items-center gap-8 border-b border-ink/10 py-5"
          >
            <Link href={productHref(p)} className="absolute inset-0 z-1" aria-label={`View ${p.name}`} />
            <span className="pointer-events-none absolute inset-0 -z-10 origin-bottom scale-y-0 bg-linear-to-r from-blush/0 via-blush to-blush/0 transition-transform duration-300 group-hover:scale-y-100" />
            <span className="font-display text-lg italic text-pink">0{i + 1}</span>
            <div className="transition-transform duration-300 group-hover:translate-x-2">
              <h3 className="font-display text-[1.6rem] leading-none">{p.name}</h3>
              {p.size && <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">{p.size}</span>}
            </div>
            <div>
              <p className="text-sm text-ink/82">{p.tagline}</p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-ink/65">
                {p.benefits.slice(0, 2).map((b, j) => (
                  <span key={b} className="inline-flex items-center gap-2">
                    {j > 0 && <Star4 className="size-1.5 text-pink" />}
                    {b}
                  </span>
                ))}
              </p>
            </div>
            <Price product={p} className="text-2xl" />
            <div className="flex justify-end">
              <Action product={p} />
            </div>
          </motion.li>
        ))}
      </motion.ul>

      {/* Floating preview */}
      <motion.div style={{ x: sx, y: sy }} className="pointer-events-none absolute left-0 top-0 z-20">
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -4 }}
              exit={{ opacity: 0, scale: 0.7, rotate: -8 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="-ml-[90px] -mt-[120px] h-[200px] w-[160px] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(214,0,122,0.6)]"
            >
              {singles.map((p, i) => (
                <motion.div key={p.id} className="absolute inset-0" animate={{ opacity: hover === i ? 1 : 0 }} transition={{ duration: 0.15 }}>
                  <ProductVisual product={p} seed={i + 5} className="h-full w-full" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function Shop() {
  return (
    <section id="shop" className="relative overflow-hidden py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div>
            <Reveal>
              <Eyebrow>The collection</Eyebrow>
            </Reveal>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,6.4vw,2.85rem)] leading-[1.04]">
              <WordReveal text="Pick your" /> <span className="text-gradient-pink italic">magic.</span>
            </h2>
          </div>
          <Reveal delay={0.05} className="flex flex-col items-center lg:items-end">
            <p className="mt-4 max-w-xs text-sm sm:text-[15px] text-ink/72 lg:mt-0 lg:text-right">Each ritual works beautifully on its own. Together, in the 7-Day Kit, they work wonders.</p>
            <Link href="/shop" className="group mt-4 inline-flex items-center gap-3 text-sm font-semibold text-ink">
              <span className="border-b border-ink/25 pb-0.5 transition-colors group-hover:border-pink">Shop the full collection</span>
              <ArrowIcon className="w-6 text-pink transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <DesktopIndex />
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={stagger.viewport}
        variants={stagger.parent(0, 0.06)}
        className="no-scrollbar mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[18vw] pb-2 lg:hidden"
      >
        {singles.map((p, i) => (
          <MobileCard key={p.id} product={p} index={i} />
        ))}
      </motion.div>
      <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-ink/55 lg:hidden">Swipe for more</p>
    </section>
  );
}
