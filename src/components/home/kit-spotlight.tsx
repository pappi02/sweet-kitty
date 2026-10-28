"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { kit } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { formatKES } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { SpotlightCard, TiltCard } from "../ui/cards";
import { Aurora, Eyebrow, Sparkles } from "../ui/decor";
import { ArrowIcon, BagIcon, WhatsAppIcon } from "../ui/icons";
import { Reveal, stagger, WordReveal } from "../ui/reveal";
import { ShimmerButton } from "../ui/shimmer-button";

export function KitSpotlight() {
  const { add } = useCart();
  const sold = site.kitsBatch - site.kitsLeft;
  const pct = Math.round((sold / site.kitsBatch) * 100);

  return (
    <section id="kit" className="grain relative isolate overflow-hidden bg-sky tone-light py-12 text-white lg:py-16">
      <Aurora intensity="soft" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:px-8">
        {/* Visual */}
        <Reveal className="order-2 mx-auto w-full max-w-[560px] lg:order-1">
          <TiltCard>
            <SpotlightCard className="rounded-[1.6rem]" glow="rgba(255,140,200,0.35)">
              <div className="relative aspect-16/10 overflow-hidden rounded-[1.6rem] tone-dark bg-blush">
                <Image src="/products/sweet-kitty-7-day-kit.png" alt="The 7-Day Sweet Kitty Kit: gift bag, boxes and treats" fill sizes="(min-width:1024px) 560px, 92vw" className="object-cover" />
                <span className="absolute inset-0 bg-linear-to-t from-ink/45 via-transparent to-ink/15" />
                <Sparkles count={8} seed={21} className="opacity-70" />
                <div className="absolute inset-3 rounded-[1.2rem] border border-white/30" />
                <span className="absolute left-6 top-6 text-[10px] font-bold uppercase tracking-[0.25em] text-white">N° 01 · {kit.badge}</span>
                <span className="absolute bottom-6 right-6 font-display text-sm italic text-white">the 7-day ritual</span>
              </div>
            </SpotlightCard>
          </TiltCard>
        </Reveal>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow dark>The signature</Eyebrow>
          </Reveal>
          <h2 className="mt-3 font-display text-[clamp(1.85rem,6.4vw,2.85rem)] leading-[1.04]">
            <WordReveal text="The 7-Day" /> <span className="text-gradient-pink italic">Sweet Kitty Kit</span>
          </h2>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-md text-sm sm:text-[15px] leading-relaxed text-white/75">{kit.description}</p>
          </Reveal>

          <motion.ol initial="hidden" whileInView="show" viewport={stagger.viewport} variants={stagger.parent(0.05, 0.05)} className="mt-6 border-t border-white/10">
            {kit.includes!.map((item, i) => (
              <motion.li key={item} variants={stagger.child} className="flex items-baseline gap-4 border-b border-white/10 py-2.5">
                <span className="w-6 font-display text-sm italic text-pink-soft">0{i + 1}</span>
                <span className="text-sm text-white/90">{item}</span>
              </motion.li>
            ))}
          </motion.ol>

          <Reveal delay={0.1} className="mt-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65">Full kit</p>
                <p className="font-display text-3xl tabular-nums sm:text-4xl">{formatKES(kit.price!)}</p>
              </div>
              <div className="min-w-[12rem] flex-1 sm:max-w-[15rem]">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-pink" />
                    </span>
                    Only {site.kitsLeft} left
                  </span>
                  <span className="tabular-nums text-white/65">{pct}% claimed</span>
                </div>
                <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-pink-soft to-pink"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2.5 sm:gap-3">
              <ShimmerButton size="lg" onClick={() => add(kit.id)} className="flex-1">
                <BagIcon className="size-4" /> Add to bag
              </ShimmerButton>
              <ShimmerButton
                size="lg"
                variant="ghost"
                href={whatsappLink(`Hi Sweet Kitty! I'd like to order the ${kit.name} (${formatKES(kit.price!)}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <WhatsAppIcon className="size-4" /> WhatsApp
              </ShimmerButton>
            </div>
            <Link href="/the-kit" className="group mt-6 inline-flex items-center gap-3 text-sm font-semibold text-white">
              <span className="border-b border-white/30 pb-0.5 transition-colors group-hover:border-pink">Explore everything in the kit</span>
              <ArrowIcon className="w-6 text-pink transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
