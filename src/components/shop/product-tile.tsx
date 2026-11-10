"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ViewTransition } from "react";
import { productHref, type Product } from "@/lib/products";
import { cn, formatKES } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { PlusIcon } from "../ui/icons";
import { ProductVisual } from "../ui/product-visual";

/** Shared name so the artwork morphs between the grid and the product page. */
export const morphName = (p: Product) => `product-${p.slug}`;

export function ProductTile({ product, compact = false, className }: { product: Product; compact?: boolean; className?: string }) {
  const { add } = useCart();
  const href = productHref(product);

  return (
    <article className={cn("group relative", className)}>
      <Link href={href} transitionTypes={["product"]} className="relative block overflow-hidden rounded-sm" aria-label={product.name}>
        <ViewTransition name={morphName(product)} share="morph" default="none">
          <ProductVisual
            product={product}
            className="aspect-4/5 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </ViewTransition>
      </Link>

      {product.price != null && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => add(product.id)}
          className="absolute right-2.5 top-2.5 z-10 grid size-9 place-items-center rounded-full bg-burgundy text-rose shadow-md transition-colors duration-200 hover:bg-burgundy-bright"
          aria-label={`Add ${product.name} to bag`}
        >
          <PlusIcon className="size-4" />
        </motion.button>
      )}

      <div className="mt-3 flex items-start justify-between gap-2 border-t border-ink/10 pt-2.5">
        <div className="min-w-0">
          <h3 className={cn("mt-0.5 font-display text-base leading-tight", compact ? "sm:text-[17px]" : "sm:text-xl")}>
            <Link href={href} transitionTypes={["product"]} className="transition-colors hover:text-accent">
              {product.name}
            </Link>
          </h3>
          <p className={cn("mt-1 hidden text-sm text-ink/70 sm:block", compact && "lg:line-clamp-1 lg:text-sm")}>{product.tagline}</p>
        </div>
        <div className="shrink-0 text-right">
          {product.price != null ? (
            <span className={cn("font-display text-sm tabular-nums", compact ? "sm:text-base" : "sm:text-[17px]")}>{formatKES(product.price)}</span>
          ) : (
            <span className="text-xs font-bold uppercase leading-snug tracking-[0.16em] text-accent sm:text-xs">
              Price
              <br />
              soon
            </span>
          )}
          {product.size && <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-ink/75">{product.size}</p>}
        </div>
      </div>
    </article>
  );
}
