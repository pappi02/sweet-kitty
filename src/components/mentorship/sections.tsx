"use client";

import { AnimatePresence, motion } from "motion/react";
import { Fragment, useState } from "react";
import type { MentorshipView, PublicFilm } from "@/lib/mentorship/view";
import { whatsappLink } from "@/lib/site";
import { cn, formatKES } from "@/lib/utils";
import { FaqAccordion } from "../home/faq";
import { Button } from "../ui/button";
import { SpotlightCard } from "../ui/cards";
import { Eyebrow, Star4 } from "../ui/decor";
import { CheckIcon, PlayIcon, WhatsAppIcon } from "../ui/icons";
import { Marquee } from "../ui/marquee";
import { ease, Reveal, stagger, WordReveal } from "../ui/reveal";
import { BookingProvider, useBooking } from "./booking";
import { FilmFrame, PlayBadge, usePlayFilm } from "./film";

type View = MentorshipView;

const rise = (delay: number) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease } });

function Heading({ eyebrow, title, accent, intro, dark = false, center = false, className }: { eyebrow: string; title: string; accent: string; intro?: string; dark?: boolean; center?: boolean; className?: string }) {
  return (
    <div className={cn(center && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <h2 className="mt-3 font-display text-[clamp(1.98rem,5.27vw,3.36rem)] leading-[1.02]">
        <WordReveal text={title} /> <span className="italic text-accent">{accent}</span>
      </h2>
      {intro && (
        <Reveal delay={0.05}>
          <p className={cn("mt-4 max-w-xl text-base leading-relaxed sm:text-[17px]", dark ? "text-white/75" : "text-ink/72", center && "mx-auto")}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}

/** The whole public mentorship page. */
export function MentorshipExperience({ view }: { view: View }) {
  return (
    <BookingProvider booking={{ ...view.booking, payEnabled: view.payEnabled, programmes: view.programmes.items }}>
      <Hero view={view} />
      <Manifesto view={view} />
      <Gallery view={view} />
      <Pillars view={view} />
      <Programmes view={view} />
      <Steps view={view} />
      <Mentor view={view} />
      {view.voices.show && view.voices.items.length > 0 && <Voices view={view} />}
      <Questions view={view} />
      <Closing view={view} />
    </BookingProvider>
  );
}

/* ------------------------------------------------------------------ Hero */

function Hero({ view }: { view: View }) {
  const { book } = useBooking();
  const play = usePlayFilm(view.playable);
  const { hero } = view;
  const ready = Boolean(hero.film?.src);

  return (
    <section className="tone-dark relative isolate overflow-hidden bg-ink pt-24 text-white lg:pt-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_85%_20%,rgba(157,8,66,0.55),transparent_65%),radial-gradient(60%_50%_at_10%_90%,rgba(115,6,44,0.6),transparent_70%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-8 lg:pb-14">
        <div>
          <motion.div {...rise(0.05)}>
            <Eyebrow dark>{hero.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h1 {...rise(0.12)} className="mt-4 font-display text-[clamp(2.88rem,7.14vw,5.54rem)] font-normal leading-[0.95]">
            {hero.title} <em className="text-accent">{hero.accent}</em>
          </motion.h1>
          <motion.p {...rise(0.22)} className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-[17px]">
            {hero.intro}
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => book()} variant="light" size="lg">
              Book your session
            </Button>
            {ready && (
              <Button onClick={() => play(hero.film)} variant="ghost" size="lg">
                <PlayIcon className="size-4" /> Watch the welcome
              </Button>
            )}
            {!ready && (
              <Button href="#programmes" variant="ghost" size="lg">
                See the programmes
              </Button>
            )}
          </motion.div>
          {hero.facts.length > 0 && (
            <motion.ul {...rise(0.38)} className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/75">
              {hero.facts.map((f, i) => (
                <Fragment key={f}>
                  {i > 0 && <Star4 className="size-2.5 text-accent" />}
                  <li>{f}</li>
                </Fragment>
              ))}
            </motion.ul>
          )}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.15, ease }} className="relative mx-auto w-full max-w-[280px] sm:max-w-[360px] lg:ml-auto lg:mr-0 lg:max-w-[420px]">
          <button
            onClick={() => play(hero.film)}
            disabled={!ready}
            className="group relative block aspect-4/5 w-full overflow-hidden rounded-t-full rounded-b-sm bg-ink-2 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.75)] ring-1 ring-white/10 lg:aspect-[4/5.2]"
            aria-label={ready ? `Watch: ${hero.film?.title}` : "Film coming soon"}
          >
            <FilmFrame film={hero.film} className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
            <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
            <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-left">
              <span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-accent">{hero.film?.label ?? "Film"}</span>
                <span className="mt-1 block font-display text-xl italic leading-tight">{hero.film?.title ?? "Welcome"}</span>
              </span>
              <PlayBadge ready={ready} />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Manifesto */

function Manifesto({ view }: { view: View }) {
  const { manifesto } = view;
  return (
    <section className="bg-cream py-11 lg:py-16">
      <Reveal className="mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Star4 className="mx-auto size-5 text-accent" />
        <p className="mt-6 font-display text-[clamp(1.62rem,3.91vw,2.69rem)] italic leading-[1.12] text-ink">“{manifesto.quote}”</p>
      </Reveal>
      {manifesto.topics.length > 0 && (
        <Marquee duration={48} className="mt-8 border-y border-ink/10 py-5">
          {manifesto.topics.map((t) => (
            <span key={t} className="flex items-center">
              <span className="px-6 font-display text-2xl italic text-ink/80 sm:text-3xl">{t}</span>
              <Star4 className="size-3 text-accent" />
            </span>
          ))}
        </Marquee>
      )}
    </section>
  );
}

/* -------------------------------------------------------------- Gallery */

function Gallery({ view }: { view: View }) {
  const play = usePlayFilm(view.playable);
  const films = view.gallery.films;
  const kinds = [...new Map(films.map((f) => [f.kind, f.label])).entries()];
  const [filter, setFilter] = useState<string>("all");
  const shown = filter === "all" ? films : films.filter((f) => f.kind === filter);
  if (films.length === 0) return null;

  return (
    <section id="films" className="bg-linear-to-b from-cream to-mist py-11 lg:py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-col gap-7">
          <Heading eyebrow={view.gallery.eyebrow} title={view.gallery.title} accent={view.gallery.accent} intro={view.gallery.intro} />
          {kinds.length > 1 && (
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0" role="tablist" aria-label="Filter films">
              {[["all", "All films"] as const, ...kinds].map(([k, l]) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={filter === k}
                  onClick={() => setFilter(k)}
                  className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-medium ring-1 transition", filter === k ? "bg-ink text-white ring-ink" : "ring-ink/15 hover:ring-ink/40")}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phones: a swipeable row. Larger screens: a grid led by one big film. */}
        <motion.ul layout className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map((f, i) => (
              <motion.li
                key={f.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease }}
                className={cn("w-[62%] shrink-0 snap-start sm:w-auto", i === 0 && "sm:col-span-2 sm:row-span-2")}
              >
                <FilmCard film={f} big={i === 0} onPlay={() => play(f)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

function FilmCard({ film, big = false, onPlay }: { film: PublicFilm; big?: boolean; onPlay: () => void }) {
  const ready = Boolean(film.src);
  return (
    <button
      onClick={onPlay}
      disabled={!ready}
      className={cn("tone-dark group relative isolate block h-full w-full overflow-hidden rounded-sm bg-ink text-left text-white outline-none ring-accent/50 focus-visible:ring-2", big ? "aspect-4/5 lg:aspect-auto" : "aspect-4/5")}
      aria-label={ready ? `Watch: ${film.title}` : `${film.title}: film coming soon`}
    >
      <span className="absolute inset-0 -z-10">
        <FilmFrame film={film} quiet className="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      </span>
      <span className="absolute inset-0 -z-10 bg-linear-to-b from-ink/40 via-transparent to-ink/90" />
      <span className="absolute inset-x-3 top-3 flex items-center justify-between sm:inset-x-4 sm:top-4">
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ring-1 ring-white/25 backdrop-blur-md">{film.label}</span>
      </span>
      <span className="absolute inset-x-3 bottom-3 block sm:inset-x-4 sm:bottom-4">
        <span className={cn("block font-display italic leading-tight", big ? "text-2xl sm:text-3xl" : "text-base sm:text-[17px]")}>{film.title}</span>
        {film.caption && <span className={cn("mt-1 line-clamp-2 text-white/75", big ? "block max-w-md text-sm" : "hidden text-xs sm:block")}>{film.caption}</span>}
        <PlayBadge ready={ready} className="mt-3" />
      </span>
    </button>
  );
}

/* -------------------------------------------------------------- Pillars */

function Pillars({ view }: { view: View }) {
  const play = usePlayFilm(view.playable);
  const items = view.pillars.items;
  const [active, setActive] = useState(0);
  const current = items[active];
  if (items.length === 0) return null;

  return (
    <section id="focus" className="tone-dark bg-burgundy py-11 text-white lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Heading eyebrow={view.pillars.eyebrow} title={view.pillars.title} accent={view.pillars.accent} intro={view.pillars.intro} dark />
          <div className="mt-6 hidden lg:block">
            <button
              onClick={() => play(current?.film)}
              disabled={!current?.film?.src}
              className="group relative block aspect-4/5 w-full max-w-[340px] overflow-hidden rounded-sm bg-ink ring-1 ring-white/10"
              aria-label={current?.film?.src ? `Watch: ${current.film.title}` : "Film coming soon"}
            >
              <AnimatePresence mode="wait">
                <motion.span key={current?.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0">
                  <FilmFrame film={current?.film ?? { id: "x", title: current?.title ?? "", caption: "", kind: "mentor", label: "", src: "", poster: "" }} />
                </motion.span>
              </AnimatePresence>
              <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/85 via-transparent to-transparent" />
              <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-left">
                <span className="font-display text-lg italic leading-tight">{current?.title}</span>
                <PlayBadge ready={Boolean(current?.film?.src)} />
              </span>
            </button>
          </div>
        </div>

        <motion.ol initial="hidden" whileInView="show" viewport={stagger.viewport} variants={stagger.parent(0, 0.05)} className="border-t border-white/15">
          {items.map((p, i) => {
            const open = i === active;
            return (
              <motion.li key={p.id} variants={stagger.child} className="border-b border-white/15">
                <button onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} className="group flex w-full items-baseline gap-5 py-5 text-left" aria-expanded={open}>
                  <span className={cn("w-7 shrink-0 font-display text-sm italic transition-colors", open ? "text-accent" : "text-white/55")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className={cn("block font-display text-[clamp(1.35rem,2.89vw,1.89rem)] leading-tight transition-colors", open ? "text-white" : "text-white/70 group-hover:text-white")}>{p.title}</span>
                    <span className="mt-1 block text-sm text-white/60">{p.kicker}</span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                      <div className="pb-6 pl-12">
                        <p className="max-w-xl text-[15px] leading-relaxed text-white/80">{p.text}</p>
                        {p.points.length > 0 && (
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {p.points.map((pt) => (
                              <li key={pt} className="rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20">
                                {pt}
                              </li>
                            ))}
                          </ul>
                        )}
                        {p.film?.src && (
                          <button onClick={() => play(p.film)} className="group mt-5 inline-flex items-center gap-3 text-sm font-semibold lg:hidden">
                            <PlayBadge ready label={`Watch: ${p.film.title}`} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Programmes */

function Programmes({ view }: { view: View }) {
  const { book } = useBooking();
  const play = usePlayFilm(view.playable);
  const { programmes } = view;
  const cols = programmes.items.length >= 4 ? "lg:grid-cols-4" : programmes.items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <section id="programmes" className="bg-cream py-11 lg:py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Heading eyebrow={programmes.eyebrow} title={programmes.title} accent={programmes.accent} intro={programmes.intro} center className="max-w-3xl" />

        <motion.ul initial="hidden" whileInView="show" viewport={stagger.viewport} variants={stagger.parent(0, 0.07)} className={cn("no-scrollbar -mx-5 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 sm:mx-0 sm:grid sm:gap-4 sm:overflow-visible sm:px-0 sm:grid-cols-2", cols)}>
          {programmes.items.map((p) => (
            <motion.li key={p.id} variants={stagger.child} className="h-auto w-[84%] shrink-0 snap-center sm:h-full sm:w-auto">
              <SpotlightCard className={cn("flex h-full flex-col rounded-sm bg-white ring-1", p.badge ? "ring-2 ring-burgundy" : "ring-ink/10")}>
                <div className="flex h-full flex-col">
                  <button onClick={() => play(p.film)} disabled={!p.film?.src} className="group relative block aspect-[16/8] w-full overflow-hidden bg-ink" aria-label={p.film?.src ? `Watch: ${p.film.title}` : `${p.name}: film coming soon`}>
                    <FilmFrame film={p.film ?? { id: p.id, title: p.name, caption: "", kind: "mentor", label: "", src: "", poster: "" }} quiet className="transition-transform duration-700 group-hover:scale-[1.04]" />
                    <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/70 to-transparent" />
                    {p.badge && <span className="absolute left-3 top-3 rounded-full bg-rose px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-burgundy">{p.badge}</span>}
                    {p.film?.src && <PlayBadge ready className="absolute bottom-3 left-3" />}
                  </button>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-script text-[2.6rem] leading-none text-burgundy">{p.name}</p>
                      <p className="font-display text-2xl tabular-nums text-ink">
                        {p.ages}
                        <span className="ml-1 text-xs not-italic text-ink/55">yrs</span>
                      </p>
                    </div>
                    <p className="mt-3 font-display text-lg leading-snug text-ink">{p.headline}</p>
                    <ul className="mt-4 space-y-2 text-sm text-ink/80">
                      {p.focus.map((f) => (
                        <li key={f} className="flex gap-2.5">
                          <CheckIcon className="mt-0.5 size-4 shrink-0 text-burgundy" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-6">
                      <div className="border-t border-ink/10 pt-4">
                        <p className="font-display text-3xl tabular-nums">{p.price ? formatKES(p.price) : "On request"}</p>
                        <p className="mt-1 text-xs leading-relaxed text-ink/65">
                          {p.sessions}
                          {p.format && (
                            <>
                              <br />
                              {p.format}
                            </>
                          )}
                        </p>
                      </div>
                      <Button onClick={() => book(p.id)} className="mt-4 w-full" variant={p.badge ? "primary" : "dark"}>
                        Book {p.name}
                      </Button>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.li>
          ))}
        </motion.ul>

        {programmes.note && (
          <Reveal>
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-ink/65">{programmes.note}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Steps */

function Steps({ view }: { view: View }) {
  const { steps } = view;
  if (steps.items.length === 0) return null;
  return (
    <section className="bg-mist py-11 lg:py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Heading eyebrow={steps.eyebrow} title={steps.title} accent={steps.accent} />
        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={stagger.viewport}
          variants={stagger.parent(0, 0.08)}
          className={cn("relative mt-7 grid gap-5 sm:grid-cols-2 sm:gap-6", steps.items.length >= 5 ? "lg:grid-cols-5" : steps.items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}
        >
          {steps.items.map((s, i) => (
            <motion.li key={s.title + i} variants={stagger.child} className="relative flex gap-4 lg:block">
              {i < steps.items.length - 1 && <span className="absolute left-14 -right-2 top-5 hidden h-px bg-ink/15 lg:block" aria-hidden />}
              <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-burgundy font-display text-base italic text-white lg:size-10">{i + 1}</span>
              <div>
                <p className="font-display text-lg leading-tight text-ink lg:mt-4 lg:text-xl">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{s.text}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Mentor */

function Mentor({ view }: { view: View }) {
  const play = usePlayFilm(view.playable);
  const { mentor } = view;
  const ready = Boolean(mentor.film?.src);
  return (
    <section className="bg-cream py-11 lg:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-8">
        <Reveal className="relative mx-auto w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[360px]">
          <button onClick={() => play(mentor.film)} disabled={!ready} className="group relative block aspect-4/5 w-full overflow-hidden rounded-t-full rounded-b-sm bg-ink shadow-[0_50px_100px_-40px_rgba(51,4,18,0.55)]" aria-label={ready ? `Watch: ${mentor.film?.title}` : "Film coming soon"}>
            {mentor.photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- uploaded photo may live on Blob or /uploads
              <img src={mentor.photo} alt={mentor.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            ) : (
              <FilmFrame film={mentor.film} quiet className="transition-transform duration-700 group-hover:scale-[1.03]" />
            )}
            <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
            {ready && <PlayBadge ready className="absolute bottom-4 left-1/2 -translate-x-1/2" label="Meet her" />}
          </button>
          <span className="absolute -bottom-6 -right-2 font-script text-7xl text-burgundy/15 sm:-right-8" aria-hidden>
            with love
          </span>
        </Reveal>
        <div>
          <Reveal>
            <Eyebrow>{mentor.eyebrow}</Eyebrow>
          </Reveal>
          <h2 className="mt-3 font-display text-[clamp(1.98rem,4.76vw,3.02rem)] leading-[1.02]">
            <WordReveal text={mentor.name} />
          </h2>
          <Reveal delay={0.05}>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent">{mentor.role}</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/75">
              {mentor.bio.map((b) => (
                <p key={b.slice(0, 40)}>{b}</p>
              ))}
            </div>
            {mentor.quote && (
              <blockquote className="mt-6 border-l-2 border-burgundy pl-5 font-display text-2xl italic leading-snug text-ink">“{mentor.quote}”</blockquote>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Voices */

function Voices({ view }: { view: View }) {
  const play = usePlayFilm(view.playable);
  const { voices } = view;
  return (
    <section className="bg-white/60 py-11 lg:py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Heading eyebrow={voices.eyebrow} title={voices.title} accent={voices.accent} />
        <motion.ul initial="hidden" whileInView="show" viewport={stagger.viewport} variants={stagger.parent(0, 0.06)} className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {voices.items.map((v) => (
            <motion.li key={v.id} variants={stagger.child} className="flex flex-col rounded-sm bg-cream p-6 ring-1 ring-ink/10">
              <Star4 className="size-4 text-accent" />
              <p className="mt-4 flex-1 font-display text-xl italic leading-snug text-ink">“{v.quote}”</p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{v.name}</p>
                  {v.detail && <p className="text-sm text-ink/60">{v.detail}</p>}
                </div>
                {v.film?.src && (
                  <button onClick={() => play(v.film)} className="group tone-dark rounded-full bg-ink text-white">
                    <PlayBadge ready label="Watch" />
                  </button>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Questions */

function Questions({ view }: { view: View }) {
  const { faq } = view;
  if (faq.items.length === 0) return null;
  return (
    <section id="questions" className="bg-white/50 py-11 lg:py-14">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-9 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Heading eyebrow={faq.eyebrow} title={faq.title} accent={faq.accent} />
          <Reveal delay={0.05}>
            <a href={whatsappLink("Hi Sweet Kitty! I have a question about the mentorship.")} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-accent">
              <WhatsAppIcon className="size-4 text-accent" /> Ask us on WhatsApp
            </a>
          </Reveal>
        </div>
        <FaqAccordion items={faq.items} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Closing */

function Closing({ view }: { view: View }) {
  const { book } = useBooking();
  return (
    <>
      <section className="tone-dark relative isolate overflow-hidden bg-ink py-14 text-center text-white lg:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_120%,rgba(157,8,66,0.65),transparent_70%)]" />
        <div className="mx-auto max-w-3xl px-5">
          <Star4 className="mx-auto size-5 text-accent" />
          <h2 className="mt-6 font-display text-[clamp(2.16rem,5.95vw,3.86rem)] leading-[1]">
            <WordReveal text={view.closing.title} /> <span className="italic text-accent">{view.closing.accent}</span>
          </h2>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-[17px]">{view.closing.text}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => book()} variant="light" size="lg">
                Book your session
              </Button>
              <Button href={whatsappLink("Hi Sweet Kitty! I'd like to know more about the mentorship.")} target="_blank" rel="noopener noreferrer" variant="ghost" size="lg">
                <WhatsAppIcon className="size-4" /> Talk to us first
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
      {view.disclaimer && (
        <div className="bg-cream">
          <p className="mx-auto max-w-3xl px-5 py-8 text-center text-xs leading-relaxed text-ink/60">{view.disclaimer}</p>
        </div>
      )}
    </>
  );
}
