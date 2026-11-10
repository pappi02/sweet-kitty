"use client";

import { motion } from "motion/react";
import type { MentorshipView } from "@/lib/mentorship/view";
import { cn } from "@/lib/utils";
import { FilmFrame, PlayBadge, usePlayFilm } from "../mentorship/film";
import { Button } from "../ui/button";
import { Eyebrow, Star4 } from "../ui/decor";
import { ease, Reveal, WordReveal } from "../ui/reveal";

/** Home page band that introduces the mentorship, with up to three films. */
export function MentorshipTeaser({ home, topics, playable }: { home: MentorshipView["home"]; topics: string[]; playable: MentorshipView["playable"] }) {
  const play = usePlayFilm(playable);
  const films = home.films.slice(0, 3);
  const layout = ["col-start-1 row-span-2 row-start-1", "col-start-2 row-start-1 translate-y-8", "col-start-2 row-start-2 translate-y-8"];

  return (
    <section className="tone-dark relative isolate overflow-hidden bg-ink py-11 text-white lg:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_0%_100%,rgba(157,8,66,0.5),transparent_70%),radial-gradient(50%_60%_at_100%_0%,rgba(115,6,44,0.55),transparent_70%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-9 px-5 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="order-2 lg:order-1">
          <div className="mx-auto grid max-w-[340px] grid-cols-2 grid-rows-2 gap-3 sm:max-w-[420px] sm:gap-4 lg:max-w-[480px]">
            {films.map((f, i) => (
              <motion.button
                key={f.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease }}
                onClick={() => play(f)}
                disabled={!f.src}
                className={cn("group relative overflow-hidden rounded-sm bg-ink-2 ring-1 ring-white/10", i === 0 ? "h-full" : "aspect-4/5", layout[i])}
                aria-label={f.src ? `Watch: ${f.title}` : `${f.title}: film coming soon`}
              >
                <FilmFrame film={f} quiet className="transition-transform duration-700 group-hover:scale-[1.04]" />
                <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/85 via-transparent to-transparent" />
                <span className="absolute inset-x-3 bottom-3 text-left">
                  <span className="block font-display text-sm italic leading-tight sm:text-base">{f.title}</span>
                  {i === 0 && <PlayBadge ready={Boolean(f.src)} className="mt-2" />}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow dark>{home.eyebrow}</Eyebrow>
          </Reveal>
          <h2 className="mt-3 font-display text-[clamp(2.07rem,5.1vw,3.36rem)] leading-[1.02]">
            <WordReveal text={home.title} /> <span className="italic text-accent">{home.accent}</span>
          </h2>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-[17px]">{home.text}</p>
            {topics.length > 0 && (
              <ul className="mt-6 flex max-w-lg flex-wrap gap-2">
                {topics.slice(0, 8).map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20">
                    <Star4 className="size-2 text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/mentorship" variant="light" size="lg">
                Explore the mentorship
              </Button>
              <Button href="/mentorship#programmes" variant="ghost" size="lg">
                See programmes
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
