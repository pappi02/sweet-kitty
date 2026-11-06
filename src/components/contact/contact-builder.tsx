"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { activeProducts } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { getVideo } from "@/lib/videos";
import { cn } from "@/lib/utils";
import { Star4 } from "../ui/decor";
import { ArrowIcon, WhatsAppIcon } from "../ui/icons";
import { Reveal } from "../ui/reveal";
import { Button } from "../ui/button";
import { AmbientVideo } from "../video/ambient-video";

const topics = ["Place an order", "Product question", "Delivery", "Share my glow story", "Something else"];

/** Builds a WhatsApp message from a few choices, with a live chat preview. */
export function ContactBuilder() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [product, setProduct] = useState("");
  const [note, setNote] = useState("");

  const message = [
    `Hi Sweet Kitty!${name.trim() ? ` I'm ${name.trim()}.` : ""}`,
    `${topic}${product ? `: ${product}` : ""}.`,
    note.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  const field = "w-full border-b border-ink/20 bg-transparent py-2 text-base outline-none transition-colors placeholder:text-ink/50 focus:border-accent";

  return (
    <section className="py-10 lg:py-14">
      <div className="mx-auto grid max-w-6xl gap-9 px-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12 lg:px-8">
        {/* Builder */}
        <Reveal>
          <p className="font-display text-sm italic text-accent">Write to us</p>
          <h2 className="mt-2 font-display text-[clamp(1.6rem,5vw,2.3rem)] leading-[1.06]">Tell us what you need.</h2>

          <form
            className="mt-6 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
            }}
          >
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-ink/75">Your name (optional)</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Wanjiru" className={field} autoComplete="given-name" />
            </label>

            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-[0.16em] text-ink/75">I&apos;d like to…</legend>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {topics.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTopic(t)}
                    aria-pressed={topic === t}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                      topic === t ? "text-white" : "text-ink/75 ring-1 ring-ink/15 hover:ring-accent",
                    )}
                  >
                    {topic === t && <motion.span layoutId="topic-pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} className="absolute inset-0 rounded-full bg-ink" />}
                    <span className="relative">{t}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-ink/75">Product (optional)</span>
              <select value={product} onChange={(e) => setProduct(e.target.value)} className={cn(field, "cursor-pointer appearance-none")}>
                <option value="">Not sure yet</option>
                {activeProducts.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-ink/75">Anything else?</span>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Ask away. It stays between us." className={cn(field, "resize-none")} />
            </label>

            <Button size="lg" type="submit" className="w-full sm:w-auto">
              <WhatsAppIcon className="size-4" /> Send on WhatsApp
            </Button>
          </form>
        </Reveal>

        {/* Live preview + direct links */}
        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <Reveal delay={0.05}>
            <div className="tone-dark overflow-hidden rounded-sm bg-linear-to-b from-ink-3 to-ink shadow-[0_40px_80px_-40px_rgba(51,4,18,0.6)]">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <div className="grid size-10 place-items-center rounded-full bg-linear-to-br from-burgundy to-burgundy font-display italic text-white">SK</div>
                <div>
                  <p className="text-sm font-semibold text-white">My Sweet Kitty</p>
                  <p className="text-xs text-accent-soft">usually replies quickly</p>
                </div>
              </div>
              <div className="flex min-h-[150px] flex-col justify-end gap-2 p-4">
                <p className="max-w-[80%] rounded-sm rounded-bl-md bg-white/10 px-4 py-2.5 text-sm text-white/90">Hi love 💗 how can we help?</p>
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={message}
                    layout
                    initial={{ opacity: 0.6, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                    className="ml-auto max-w-[85%] rounded-sm rounded-br-md bg-burgundy px-4 py-2.5 text-sm leading-snug text-white"
                  >
                    {message}
                  </motion.p>
                </AnimatePresence>
                <p className="text-right text-xs text-white/75">Preview of your message</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="border-t border-ink/10">
              {[
                { label: "WhatsApp", value: "Chat with us", href: whatsappLink("Hi Sweet Kitty!") },
                { label: "Call", value: site.phone, href: site.phoneHref },
                { label: "Email", value: site.email, href: `mailto:${site.email}` },
                ...site.socials.filter((s) => s.url).map((s) => ({ label: s.label, value: s.handle, href: s.url })),
              ].map((c) => (
                <li key={c.label}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between border-b border-ink/10 py-3">
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-[0.16em] text-ink/75">{c.label}</span>
                      <span className="font-display text-lg">{c.value}</span>
                    </span>
                    <ArrowIcon className="w-6 text-accent transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
              {site.socials.filter((s) => !s.url).map((s) => (
                <li key={s.label} className="border-b border-ink/10 py-3">
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-ink/75">{s.label}</span>
                  <span className="font-display text-lg">{s.handle}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <Link href="/stories" className="tone-dark group relative flex h-28 items-end overflow-hidden rounded-sm bg-ink p-4">
              <AmbientVideo video={getVideo("texting-wide")} className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-linear-to-r from-ink/80 to-ink/10" />
              <span className="relative">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent-soft">
                  <Star4 className="size-2.5" /> Prefer to watch first?
                </span>
                <span className="mt-1 block font-display text-xl italic text-white">See the glow stories</span>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
