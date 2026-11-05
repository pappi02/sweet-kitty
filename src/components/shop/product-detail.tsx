"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, ViewTransition } from "react";
import { categories, kit, singles, type Product } from "@/lib/products";
import { whatsappLink } from "@/lib/site";
import { getVideo, type Video } from "@/lib/videos";
import { cn, formatKES } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { Star4 } from "../ui/decor";
import { BagIcon, CheckIcon, MinusIcon, PlayIcon, PlusIcon, WhatsAppIcon } from "../ui/icons";
import { ProductVisual } from "../ui/product-visual";
import { ease, Reveal, stagger } from "../ui/reveal";
import { ArrowLink, SectionHeading } from "../ui/section-heading";
import { Button } from "../ui/button";
import { AmbientVideo } from "../video/ambient-video";
import { useVideoLightbox } from "../video/video-lightbox";
import { morphName, ProductTile } from "./product-tile";

type Media = { kind: "art" } | { kind: "video"; video: Video };

/* ---------- Media: artwork + videos with thumbnails ---------- */

function Gallery({ product }: { product: Product }) {
  const { open } = useVideoLightbox();
  const media: Media[] = [{ kind: "art" }, ...(product.videos ?? []).map((id): Media => ({ kind: "video", video: getVideo(id) }))];
  const [active, setActive] = useState(0);
  const current = media[active];
  const videoList = media.flatMap((m) => (m.kind === "video" ? [m.video] : []));

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative mx-auto aspect-4/5 max-w-[360px] overflow-hidden rounded-sm bg-ink lg:max-w-none">
        <ViewTransition name={morphName(product)} share="morph" default="none">
          <ProductVisual product={product} className="absolute inset-0" />
        </ViewTransition>
        <AnimatePresence>
          {current.kind === "video" && (
            <motion.div
              key={current.video.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="tone-dark absolute inset-0"
            >
              <AmbientVideo video={current.video} />
              <span className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
              <button
                onClick={() => open(videoList, videoList.indexOf(current.video))}
                className="group absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-4 text-left text-white"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-accent transition-transform duration-300 group-hover:scale-110">
                  <PlayIcon className="ml-0.5 size-5" />
                </span>
                <span>
                  <span className="block font-display text-lg italic leading-tight">{current.video.title}</span>
                  <span className="text-xs text-white/75">Watch full screen</span>
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-auto mt-2.5 flex max-w-[360px] gap-2 lg:max-w-none">
        {media.map((m, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-14 w-11 overflow-hidden rounded-lg transition-all duration-200",
              active === i ? "ring-2 ring-accent ring-offset-2 ring-offset-cream" : "opacity-70 ring-1 ring-ink/10 hover:opacity-100",
            )}
            aria-label={m.kind === "art" ? "Show product" : `Play ${m.video.title}`}
          >
            {m.kind === "art" ? (
              <ProductVisual product={product} className="h-full w-full" />
            ) : (
              <>
                <Image src={m.video.poster} alt="" fill sizes="64px" className="object-cover" />
                <span className="absolute inset-0 grid place-items-center bg-ink/25 text-white">
                  <PlayIcon className="size-4" />
                </span>
              </>
            )}
          </button>
        ))}
        <p className="ml-auto self-end text-xs font-bold uppercase tracking-[0.16em] text-ink/50">
          {String(active + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

/* ---------- Expanding detail rows ---------- */

function Details({ product }: { product: Product }) {
  const rows = [
    {
      title: "How to use",
      body: (
        <ol className="space-y-2">
          {product.howToUse.map((h, i) => (
            <li key={h} className="flex gap-3">
              <span className="font-display italic text-accent">{i + 1}.</span>
              {h}
            </li>
          ))}
        </ol>
      ),
    },
    { title: "What's inside", body: <p>Only natural ingredients. The exact recipe is our secret, and that&apos;s what makes Sweet Kitty, Sweet Kitty.</p> },
    { title: "Delivery & packaging", body: <p>Packed plainly, with nothing on the outside that says what&apos;s inside. We confirm delivery time and cost on WhatsApp.</p> },
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-ink/10">
      {rows.map((r, i) => {
        const isOpen = open === i;
        return (
          <div key={r.title} className="border-b border-ink/10">
            <button onClick={() => setOpen(isOpen ? null : i)} className="group flex w-full items-center justify-between py-3.5 text-left" aria-expanded={isOpen}>
              <span className="font-display text-lg">{r.title}</span>
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="grid size-8 place-items-center rounded-full ring-1 ring-ink/15 group-hover:ring-accent">
                <PlusIcon className="size-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 pr-10 text-sm leading-relaxed text-ink/78">{r.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Page ---------- */

export function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const buyRef = useRef<HTMLDivElement>(null);
  const buyVisible = useInView(buyRef, { margin: "0px 0px -10% 0px" });
  // Only show the sticky bar after the main buy button has been seen once.
  const [seen, setSeen] = useState(false);
  if (buyVisible && !seen) setSeen(true);
  // Props arrive serialised from the server, so match by id rather than reference.
  const index = singles.findIndex((p) => p.id === product.id);
  const category = categories.find((c) => c.id === product.category)?.label;
  const related = singles.filter((p) => p.id !== product.id).slice(0, 3);
  const askLink = whatsappLink(`Hi Sweet Kitty! I'm interested in the ${product.name}.`);
  const inKit = kit.includes!.includes(product.name);

  return (
    <>
      <section className="pb-10 pt-24 lg:pb-14 lg:pt-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ink/55">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/shop" transitionTypes={["product"]} className="hover:text-accent">Shop</Link>
            <span aria-hidden>/</span>
            <span className="text-ink">{product.shortName}</span>
          </nav>

          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-10">
            <Gallery product={product} />

            <div>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
                <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-ink/60">
                  <span className="font-display text-base normal-case italic tracking-normal text-accent">N°{String(index + 1).padStart(2, "0")}</span>
                  {category}
                </p>
                <h1 className="mt-4 font-display text-[clamp(2.1rem,5.5vw,3.4rem)] leading-[0.98]">{product.name}</h1>
                <p className="mt-2.5 font-display text-lg italic text-ink/80">{product.tagline}</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/75">{product.description}</p>
              </motion.div>

              <motion.div
                ref={buyRef}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease }}
                className="mt-6 border-y border-ink/10 py-4"
              >
                <div className="flex items-end justify-between gap-4">
                  {product.price != null ? (
                    <p className="font-display text-3xl tabular-nums">{formatKES(product.price * qty)}</p>
                  ) : (
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Price coming soon</p>
                  )}
                  {product.size && <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/60">{product.size}</p>}
                </div>

                {product.price != null ? (
                  <div className="mt-3 flex gap-3">
                    <div className="flex h-11 items-center rounded-full ring-1 ring-ink/15 sm:h-12">
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-11 place-items-center rounded-full transition hover:text-accent sm:size-12" aria-label="One less">
                        <MinusIcon className="size-4" />
                      </button>
                      <span className="w-5 text-center font-display text-base tabular-nums" aria-live="polite">
                        {qty}
                      </span>
                      <button onClick={() => setQty((q) => Math.min(9, q + 1))} className="grid size-11 place-items-center rounded-full transition hover:text-accent sm:size-12" aria-label="One more">
                        <PlusIcon className="size-4" />
                      </button>
                    </div>
                    <Button size="lg" onClick={() => add(product.id, qty)} className="flex-1">
                      <BagIcon className="size-4" /> Add to bag
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 flex gap-2.5">
                    <Button size="lg" href={askLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <WhatsAppIcon className="size-4" /> Ask about price
                    </Button>
                    <Button size="lg" variant="dark" href="/the-kit" className="flex-1">
                      In the 7-Day Kit
                    </Button>
                  </div>
                )}

                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-ink/70">
                  {["Discreet packaging", "Natural, secret recipe", "Order on WhatsApp"].map((t) => (
                    <li key={t} className="inline-flex items-center gap-2">
                      <Star4 className="size-2.5 text-accent" />
                      {t}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/60">What it does</p>
                <motion.ul initial="hidden" whileInView="show" viewport={stagger.viewport} variants={stagger.parent(0, 0.05)} className="mt-4 grid gap-x-6 sm:grid-cols-2">
                  {product.benefits.map((b) => (
                    <motion.li key={b} variants={stagger.child} className="flex items-start gap-2.5 border-b border-ink/10 py-2.5 text-sm">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                      {b}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              <div className="mt-7">
                <Details product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Better together */}
      <section className="px-3 sm:px-5">
        <Reveal className="tone-light relative isolate mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-sm bg-rose px-6 py-9 text-white sm:px-12 lg:grid-cols-[auto_1fr_auto] lg:gap-12 lg:py-10">
          <div className="relative mx-auto aspect-square w-32 overflow-hidden rounded-sm shadow-[0_20px_40px_-15px_rgba(115,6,44,0.5)] ring-4 ring-white/70 lg:w-40">
            <Image src="/products/sweet-kitty-7-day-kit.jpg" alt="The 7-Day Sweet Kitty Kit" fill sizes="160px" className="object-cover object-[55%_50%]" />
          </div>
          <div className="relative text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Better together</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-[1.02]">
              {inKit ? `Get ${product.shortName}` : "Go further"} <span className="text-accent italic">{inKit ? "in" : "with"} the 7-Day Kit.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-white/80 lg:mx-0">Four signature rituals, one guided week, the biggest transformation. {formatKES(kit.price!)} for everything.</p>
          </div>
          <div className="relative flex gap-2.5 lg:flex-col">
            <Button size="lg" onClick={() => add(kit.id)} className="flex-1 lg:flex-none">
              <BagIcon className="size-4" /> Add the kit
            </Button>
            <Button size="lg" variant="ghost" href="/the-kit" className="flex-1 lg:flex-none">
              What&apos;s inside
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Related */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Complete the ritual" title="You might" accent="also love." />
            <ArrowLink href="/shop">Back to the collection</ArrowLink>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 lg:max-w-[52rem] lg:grid-cols-3 lg:gap-x-5">
            {related.map((p, i) => (
              <ProductTile key={p.id} product={p} className={i === 2 ? "hidden lg:block" : undefined} />
            ))}
          </div>
        </div>
      </section>

      {/* Phone buy bar once the main button scrolls away */}
      <AnimatePresence>
        {seen && !buyVisible && (
          <motion.div
            initial={{ y: 110 }}
            animate={{ y: 0 }}
            exit={{ y: 110 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden"
          >
            <div className="tone-light flex items-center gap-2 rounded-[2px] bg-cream p-1.5 pl-4 shadow-[0_18px_40px_-16px_rgba(51,4,18,0.55)] ring-1 ring-burgundy/20">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold uppercase tracking-[0.16em] text-accent-soft">{product.shortName}</p>
                <p className="font-display text-base text-white">{product.price != null ? formatKES(product.price) : "Price soon"}</p>
              </div>
              {product.price != null ? (
                <Button onClick={() => add(product.id, qty)} className="h-11 px-4">
                  Add to bag
                </Button>
              ) : (
                <Button href={askLink} target="_blank" rel="noopener noreferrer" className="h-11 px-4">
                  Ask us
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
