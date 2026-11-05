"use client";

import Link from "next/link";
import { kit, kitSaving, singles } from "@/lib/products";
import { formatKES } from "@/lib/utils";
import { Eyebrow } from "../ui/decor";
import { ArrowIcon } from "../ui/icons";
import { Reveal, WordReveal } from "../ui/reveal";
import { ProductTile } from "../shop/product-tile";

export function Shop() {
  return (
    <section id="shop" className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <Eyebrow>The collection</Eyebrow>
            </Reveal>
            <h2 className="mt-3 font-display text-[clamp(2.1rem,6.4vw,3.6rem)] leading-[1.02]">
              <WordReveal text="Pick your" /> <span className="italic text-accent">magic.</span>
            </h2>
          </div>
          <Reveal delay={0.05}>
            <Link href="/shop" className="group inline-flex items-center gap-3 text-sm font-semibold">
              <span className="border-b border-ink/25 pb-0.5 transition-colors group-hover:border-accent">Shop the full collection</span>
              <ArrowIcon className="w-6 text-accent transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {singles.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06}>
              <ProductTile product={p} compact />
            </Reveal>
          ))}
          <Reveal delay={0.18} className="col-span-2 lg:col-span-1">
            <Link href="/the-kit" className="group flex h-full min-h-56 flex-col justify-between rounded-sm bg-burgundy p-5 text-rose transition-colors duration-300 hover:bg-burgundy-bright">
              <span className="font-display text-2xl leading-tight">The 7-Day Kit. {formatKES(kit.price!)}, and you save {formatKES(kitSaving)}.</span>
              <span className="mt-6 inline-flex items-center gap-3 text-sm font-semibold">
                See what&apos;s inside <ArrowIcon className="w-6 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
