"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ViewTransition } from "react";
import { productHref, type Product } from "@/lib/products";
import { cn, formatKES } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { Star4 } from "../ui/decor";
import { PlusIcon } from "../ui/icons";
import { ProductVisual } from "../ui/product-visual";

/** Shared name so the artwork morphs between the grid and the product page. */
export const morphName = (p: Product) => `product-${p.slug}`;

export function ProductTile({ product, index, compact = false, className }: { product: Product; index: number; compact?: boolean; className?: string }) {
  const { add } = useCart();
  const href = productHref(product);

  return (
    <article className={cn("group relative", className)}>
      <Link href={href} transitionTypes={["product"]} className="relative block overflow-hidden rounded-[1.2rem]" aria-label={product.name}>
        <ViewTransition name={morphName(product)} share="morph" default="none">
          <ProductVisual
            product={product}
            seed={index + 5}
            className="aspect-4/5 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </ViewTransition>
        {/* Benefits slide up on hover */}
        <span className="tone-dark pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full flex-wrap gap-x-3 gap-y-1 bg-linear-to-t from-ink/80 to-transparent px-4 pb-10 pt-8 text-[11px] text-white transition-transform duration-300 ease-out group-hover:translate-y-0 lg:flex">
          {product.benefits.slice(0, 3).map((b, i) => (
            <span key={b} className="inline-flex items-center gap-2">
              {i > 0 && <Star4 className="size-1.5 text-pink-soft" />}
              {b}
            </span>
          ))}
        </span>
      </Link>

      {product.price != null && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => add(product.id)}
          className="absolute right-2.5 top-2.5 z-10 grid size-9 place-items-center rounded-full bg-white text-ink shadow-lg transition-colors duration-200 hover:bg-pink hover:text-white lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          aria-label={`Add ${product.name} to bag`}
        >
          <PlusIcon className="size-4" />
        </motion.button>
      )}

      <div className="mt-3 flex items-start justify-between gap-2 border-t border-ink/10 pt-2.5">
        <div className="min-w-0">
          <p className="font-display text-xs italic text-pink">N°{String(index + 1).padStart(2, "0")}</p>
          <h3 className={cn("mt-0.5 font-display text-base leading-tight", compact ? "sm:text-lg" : "sm:text-xl")}>
            <Link href={href} transitionTypes={["product"]} className="transition-colors hover:text-pink-deep">
              {product.name}
            </Link>
          </h3>
          <p className={cn("mt-1 hidden text-sm text-ink/70 sm:block", compact && "lg:line-clamp-1 lg:text-[13px]")}>{product.tagline}</p>
        </div>
        <div className="shrink-0 text-right">
          {product.price != null ? (
            <span className={cn("font-display text-sm tabular-nums", compact ? "sm:text-base" : "sm:text-lg")}>{formatKES(product.price)}</span>
          ) : (
            <span className="text-[9px] font-bold uppercase leading-snug tracking-[0.18em] text-pink-deep sm:text-[10px]">
              Price
              <br />
              soon
            </span>
          )}
          {product.size && <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/55">{product.size}</p>}
        </div>
      </div>
    </article>
  );
}
