import Image from "next/image";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { Sparkles } from "./decor";

/**
 * Product artwork. Shows the product photo when there is one; otherwise an
 * editorial monogram card (big serif initial, hairline rings) in the product's colours.
 */
export function ProductVisual({ product, className, seed = 3, label = true }: { product: Product; className?: string; seed?: number; label?: boolean }) {
  const [a, b] = product.tone;
  // Last word gives each product its own letter: Tight T, Magic Juice J, 7-Day Kit K.
  const initial = product.shortName.split(" ").pop()!.charAt(0);

  return (
    <div className={cn("@container tone-dark relative isolate overflow-hidden", className)} style={{ background: `radial-gradient(120% 90% at 30% 15%, ${a} 0%, ${b} 70%, #2a0f1f 100%)` }}>
      {product.image ? (
        <>
          {product.imageFit === "contain" && (
            <Image src={product.image} alt="" aria-hidden fill className="scale-110 object-cover opacity-70 blur-xl" sizes="200px" />
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={product.imageFit === "contain" ? "object-contain" : "object-cover"}
            sizes="(min-width: 1024px) 420px, 60vw"
          />
          {label && (
            <>
              <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ink/55 to-transparent" />
              <span className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-end text-[9px] font-semibold uppercase tracking-[0.22em] text-white/90 @[16rem]:justify-between">
                <span className="hidden @[16rem]:inline">My Sweet Kitty</span>
                <span>{product.shortName}</span>
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <Sparkles count={8} seed={seed} />
          <div className="absolute left-1/2 top-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
          <div className="absolute left-1/2 top-1/2 aspect-square w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <span className="absolute inset-0 grid place-items-center font-display text-[38cqw] italic leading-none text-white/90 [text-shadow:0_8px_40px_rgba(255,255,255,0.35)]">
            {initial}
          </span>
          {label && (
            <span className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.25em] text-white/75">
              <span>Sweet Kitty</span>
              <span>{product.shortName}</span>
            </span>
          )}
        </>
      )}
    </div>
  );
}
