"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { kit, kitSaving, kitWorth } from "@/lib/products";
import { whatsappLink } from "@/lib/site";
import { formatKES } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { Eyebrow } from "../ui/decor";
import { ArrowIcon, BagIcon, WhatsAppIcon } from "../ui/icons";
import { Reveal, stagger, WordReveal } from "../ui/reveal";
import { Button } from "../ui/button";

export function KitSpotlight() {
  const { add } = useCart();

  return (
    <section id="kit" className="relative isolate overflow-hidden bg-rose tone-light py-12 text-white lg:py-16">
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:px-8">
        {/* Visual */}
        <Reveal className="order-2 mx-auto w-full max-w-[560px] lg:order-1">
          <div className="relative aspect-16/10 overflow-hidden rounded-sm bg-blush">
              <Image src="/products/sweet-kitty-7-day-kit.jpg" alt="The 7-Day Sweet Kitty Kit: gift bag, boxes and treats" fill sizes="(min-width:1024px) 560px, 92vw" className="object-cover" />
            </div>
        </Reveal>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow dark>The signature</Eyebrow>
          </Reveal>
          <h2 className="mt-3 font-display text-[clamp(2.1rem,6.4vw,3.6rem)] leading-[1.02]">
            <WordReveal text="The 7-Day" /> <span className="text-accent italic">Sweet Kitty Kit</span>
          </h2>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">{kit.description}</p>
          </Reveal>

          <motion.ol initial="hidden" whileInView="show" viewport={stagger.viewport} variants={stagger.parent(0.05, 0.05)} className="mt-6 border-t border-white/10">
            {kit.includes!.map((item, i) => (
              <motion.li key={item} variants={stagger.child} className="flex items-baseline gap-4 border-b border-white/10 py-2.5">
                <span className="w-6 font-display text-sm italic text-accent-soft">0{i + 1}</span>
                <span className="text-sm text-white/90">{item}</span>
              </motion.li>
            ))}
          </motion.ol>

          <Reveal delay={0.1} className="mt-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-white/75">
                  <s>{formatKES(kitWorth)}</s> <span className="font-semibold text-accent">You save {formatKES(kitSaving)}</span>
                </p>
                <p className="font-display text-3xl tabular-nums sm:text-4xl">{formatKES(kit.price!)}</p>
              </div>
              <p className="pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Discreet delivery across Kenya</p>
            </div>

            <div className="mt-5 flex gap-2.5 sm:gap-3">
              <Button size="lg" onClick={() => add(kit.id)} className="flex-1">
                <BagIcon className="size-4" /> Add to bag
              </Button>
              <Button
                size="lg"
                variant="ghost"
                href={whatsappLink(`Hi Sweet Kitty! I'd like to order the ${kit.name} (${formatKES(kit.price!)}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <WhatsAppIcon className="size-4" /> WhatsApp
              </Button>
            </div>
            <Link href="/the-kit" className="group mt-6 inline-flex items-center gap-3 text-sm font-semibold text-white">
              <span className="border-b border-white/30 pb-0.5 transition-colors group-hover:border-accent">Explore everything in the kit</span>
              <ArrowIcon className="w-6 text-accent transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
