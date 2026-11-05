import Image from "next/image";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

/** Product photo. Until a product has one, its frame shows the Sweet Kitty logo on brand pink. */
export function ProductVisual({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-rose", className)}>
      {product.image ? (
        <>
          {product.imageFit === "contain" && <Image src={product.image} alt="" aria-hidden fill className="scale-110 object-cover opacity-70 blur-xl" sizes="200px" />}
          <Image src={product.image} alt={product.name} fill className={product.imageFit === "contain" ? "object-contain" : "object-cover"} sizes="(min-width: 1024px) 420px, 60vw" />
        </>
      ) : (
        <Image src="/brand/my-sweet-kitty-512.png" alt={product.name} fill className="object-contain p-[14%]" sizes="(min-width: 1024px) 300px, 45vw" />
      )}
    </div>
  );
}
