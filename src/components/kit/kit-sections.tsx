"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getProductBySlug, kit, kitSaving, kitWorth, productHref, singles, type Product } from "@/lib/products";
import { whatsappLink } from "@/lib/site";
import { getVideo, videos } from "@/lib/videos";
import { cn, formatKES } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { Eyebrow, Star4 } from "../ui/decor";
import { ArrowIcon, BagIcon, CheckIcon, PlayIcon, WhatsAppIcon } from "../ui/icons";
import { ProductVisual } from "../ui/product-visual";
import { ease, Reveal, stagger, WordReveal } from "../ui/reveal";
import { Button } from "../ui/button";
import { AmbientVideo } from "../video/ambient-video";
import { CompareVideos } from "../video/compare-videos";
import { useVideoLightbox } from "../video/video-lightbox";

const fade = (delay: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay, ease } });

/* ---------- Hero: copy + arched video ---------- */

export function KitHero() {
  const { add } = useCart();
  const { open } = useVideoLightbox();

  return (
    <section className="tone-light relative isolate overflow-hidden bg-blush pb-9 pt-24 text-white lg:pb-10 lg:pt-28">
      <div className="relative mx-auto grid max-w-6xl items-center gap-7 px-5 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:px-8">
        <div>
          <motion.div {...fade(0)} className="flex items-center gap-4">
            <span className="font-display text-lg italic text-accent">N°02</span>
            <span className="h-px w-16 bg-ink/30" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">The signature</span>
          </motion.div>
          <h1 className="mt-3 font-display text-[clamp(2.3rem,8.5vw,4.25rem)] font-medium leading-[0.92] tracking-tight">
            <WordReveal text="The 7-Day" onLoad /> <span className="text-accent italic">Sweet Kitty</span> <WordReveal text="Kit" onLoad delay={0.1} />
          </h1>
          <motion.p {...fade(0.2)} className="mt-4 max-w-md text-base leading-relaxed text-white/82">
            {kit.description}
          </motion.p>

          <motion.div {...fade(0.3)} className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-4 border-t border-white/15 pt-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Full kit</p>
              <p className="font-display text-3xl tabular-nums sm:text-4xl">{formatKES(kit.price!)}</p>
            </div>
            <div className="pb-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Bought separately</p>
              <p className="text-sm text-white/80">
                <s>{formatKES(kitWorth)}</s> <span className="font-semibold text-accent">You save {formatKES(kitSaving)}</span>
              </p>
            </div>
          </motion.div>

          <motion.div {...fade(0.4)} className="mt-3 flex gap-2.5 sm:gap-3">
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
          </motion.div>
        </div>

        {/* Arched video */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }} className="relative mx-auto w-[min(48vw,190px)] lg:w-[280px]">
          <div className="absolute -inset-4 rounded-t-full border border-dashed border-accent/40" />
          <div className="tone-dark relative aspect-[3/4.4] overflow-hidden rounded-t-full rounded-b-[2rem] bg-ink shadow-[0_40px_80px_-30px_rgba(51,4,18,0.5)]">
            <AmbientVideo video={getVideo("crown")} />
            <span className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
            <button onClick={() => open(videos, videos.indexOf(getVideo("crown")))} className="group absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 p-5 text-sm font-semibold text-white">
              <span className="grid size-11 place-items-center rounded-full bg-white text-accent transition-transform duration-300 group-hover:scale-110">
                <PlayIcon className="ml-0.5 size-4" />
              </span>
              Watch her glow-up
            </button>
          </div>
          {[
            { t: "Day 1 · Reset", c: "-left-6 top-[22%]", d: 0.6 },
            { t: "Day 3 · Glow", c: "-right-5 top-[44%]", d: 0.7 },
            { t: "Day 7 · Reborn", c: "-left-4 bottom-[18%]", d: 0.8 },
          ].map((chip) => (
            <motion.span
              key={chip.t}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: chip.d, type: "spring", stiffness: 380, damping: 22 }}
              className={cn("absolute", chip.c)}
            >
              <span className="tone-dark flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink shadow-lg ring-1 ring-ink/5 backdrop-blur-md">
                <Star4 className="size-2 text-accent" />
                {chip.t}
              </span>
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Inside the box: products fan out on scroll ---------- */

const fan = [
  { x: -1.5, r: -10, y: 0.35 },
  { x: -0.5, r: -3.5, y: 0 },
  { x: 0.5, r: 3.5, y: 0 },
  { x: 1.5, r: 10, y: 0.35 },
];

function FanCard({ product, i, progress, spread }: { product: Product; i: number; progress: MotionValue<number>; spread: number }) {
  const f = fan[i];
  const x = useTransform(progress, [0, 1], [0, f.x * spread]);
  const y = useTransform(progress, [0, 1], [0, f.y * spread * 0.4]);
  const rotate = useTransform(progress, [0, 1], [(i - 1.5) * 2, f.r]);
  return (
    <motion.div style={{ x, y, rotate, zIndex: i === 1 || i === 2 ? 2 : 1 }} className="absolute left-1/2 top-0 -ml-[var(--card-half)] w-[calc(var(--card-half)*2)]">
      <Link href={productHref(product)} className="group block">
        <ProductVisual product={product} className="aspect-4/5 rounded-sm shadow-[0_30px_60px_-25px_rgba(51,4,18,0.55)] transition-transform duration-300 group-hover:-translate-y-2" />
      </Link>
    </motion.div>
  );
}

export function InsideTheBox() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 60%"] });
  const [spread, setSpread] = useState(110);
  const items = kit.includes!.map((name) => singles.find((p) => p.name === name)!).filter(Boolean);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const set = () => setSpread(mq.matches ? 195 : Math.min(window.innerWidth * 0.2, 110));
    set();
    mq.addEventListener("change", set);
    window.addEventListener("resize", set);
    return () => {
      mq.removeEventListener("change", set);
      window.removeEventListener("resize", set);
    };
  }, []);

  return (
    <section className="overflow-hidden py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow>Inside the box</Eyebrow>
          </Reveal>
          <h2 className="mt-3 font-display text-[clamp(2.1rem,6.4vw,3.6rem)] leading-[1.02]">
            <WordReveal text="Four rituals." /> <span className="text-accent italic">One week.</span>
          </h2>
          <Reveal delay={0.05}>
            <p className="mx-auto mt-3 max-w-md text-base text-ink/72">Our four signature rituals, packed together with a guided 7-day ritual.</p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mx-auto mt-8 h-[180px] [--card-half:50px] sm:h-[240px] sm:[--card-half:68px] lg:mt-12 lg:h-[290px] lg:[--card-half:88px]">
          {items.map((p, i) => (
            <FanCard key={p.id} product={p} i={i} progress={scrollYProgress} spread={spread} />
          ))}
        </div>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={stagger.viewport}
          variants={stagger.parent(0, 0.06)}
          className="mt-8 grid grid-cols-2 border-t border-ink/10 lg:mt-7 lg:grid-cols-4"
        >
          {items.map((p, i) => (
            <motion.li key={p.id} variants={stagger.child} className={cn("border-b border-ink/10 py-4 pr-4 lg:border-b-0 lg:pr-6", i % 2 === 1 && "border-l pl-4 lg:pl-6", i > 0 && "lg:border-l lg:pl-6")}>
              <span className="font-display text-sm italic text-accent">0{i + 1}</span>
              <h3 className="mt-1 font-display text-lg leading-tight sm:text-xl">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.tagline}</p>
              <Link href={productHref(p)} className="group mt-3 inline-flex items-center gap-2 text-xs font-semibold text-ink">
                Details <ArrowIcon className="w-5 text-accent transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ---------- Before / after ---------- */

export function KitCompare() {
  const juice = getProductBySlug("magic-kitty-juice");
  return (
    <section className="bg-white/50 py-12 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:px-8">
        <div>
          <Reveal>
            <Eyebrow>See the difference</Eyebrow>
          </Reveal>
          <h2 className="mt-3 font-display text-[clamp(2.1rem,6.4vw,3.6rem)] leading-[1.02]">
            <WordReveal text="Day one." /> <span className="text-accent italic">Day seven.</span>
          </h2>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink/72">Drag the line to see her week. Same woman, brand-new energy.</p>
          </Reveal>
          <motion.ul initial="hidden" whileInView="show" viewport={stagger.viewport} variants={stagger.parent(0.05, 0.06)} className="mt-6 border-t border-ink/10">
            {[
              ["Tired and heavy", "Light and energised"],
              ["Rushing past the mirror", "Loving what she sees"],
              ["Putting herself last", "Choosing herself"],
            ].map(([a, b]) => (
              <motion.li key={a} variants={stagger.child} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-ink/10 py-4 text-base">
                <span className="text-ink/75 line-through decoration-ink/25">{a}</span>
                <ArrowIcon className="w-6 text-accent" />
                <span className="flex items-center gap-2 font-semibold">
                  <CheckIcon className="size-4 text-accent" />
                  {b}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          {juice && (
            <Reveal delay={0.1}>
              <p className="mt-6 text-sm text-ink/75">
                It starts each morning with the{" "}
                <Link href={productHref(juice)} className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4">
                  Kitty Magic Juice
                </Link>
                .
              </p>
            </Reveal>
          )}
        </div>
        <Reveal delay={0.08}>
          <CompareVideos className="mx-auto aspect-4/5 w-full max-w-[340px] rounded-sm lg:max-w-[380px]" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Promise numerals ---------- */

export function KitPromise() {
  const items = [
    { n: "04", t: "Rituals", d: "Our signature rituals in one box." },
    { n: "07", t: "Mornings", d: "A guided day-by-day ritual to follow." },
    { n: "01", t: "Message", d: "Order on WhatsApp. We handle the rest." },
  ];
  return (
    <section className="py-8 lg:py-10">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={stagger.viewport}
        variants={stagger.parent(0, 0.08)}
        className="mx-auto grid max-w-6xl gap-px overflow-hidden px-5 sm:grid-cols-3 lg:px-8"
      >
        {items.map((it, i) => (
          <motion.div key={it.t} variants={stagger.child} className={cn("flex items-end gap-5 border-ink/10 py-4 sm:block sm:px-8 sm:py-2", i > 0 && "border-t sm:border-l sm:border-t-0")}>
            <span className="text-accent font-display text-5xl leading-none sm:text-6xl">{it.n}</span>
            <div className="sm:mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink">{it.t}</p>
              <p className="mt-1.5 text-sm text-ink/70">{it.d}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
