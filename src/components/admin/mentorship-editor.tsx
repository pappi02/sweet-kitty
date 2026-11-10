"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { restoreMentorship, saveMentorship } from "@/app/admin/(dashboard)/mentorship/actions";
import type { StorageMode, Version } from "@/lib/cms/store";
import { describeIssue, filmKindLabels, filmKinds, mentorshipSchema, type Film, type FilmKind, type Mentorship } from "@/lib/mentorship/schema";
import { cn } from "@/lib/utils";
import { LongText, MediaField, Repeater, Section, Select, StringList, Text, Toggle } from "./fields";

const sections = [
  { id: "page", label: "Page & hero" },
  { id: "films", label: "Films" },
  { id: "home", label: "Homepage band" },
  { id: "manifesto", label: "Manifesto" },
  { id: "focus", label: "Focus areas" },
  { id: "programmes", label: "Programmes" },
  { id: "steps", label: "How it works" },
  { id: "mentor", label: "Mentor" },
  { id: "voices", label: "Client voices" },
  { id: "faq", label: "Questions" },
  { id: "booking", label: "Booking" },
  { id: "closing", label: "Closing" },
] as const;

const rid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 7)}`;

type Toast = { kind: "ok" | "error"; text: string } | null;

export function MentorshipEditor({
  initial,
  defaults,
  versions: initialVersions,
  storage,
  payReady,
  problem,
}: {
  initial: Mentorship;
  defaults: Mentorship;
  versions: Version[];
  storage: StorageMode;
  payReady: boolean;
  problem?: string;
}) {
  const [doc, setDoc] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [versions, setVersions] = useState(initialVersions);
  const [toast, setToast] = useState<Toast>(problem ? { kind: "error", text: problem } : null);
  const [history, setHistory] = useState(false);
  const [pending, start] = useTransition();

  const edit = useCallback((fn: (d: Mentorship) => void) => {
    setDoc((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  }, []);

  const dirty = useMemo(() => JSON.stringify(doc) !== JSON.stringify(saved), [doc, saved]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!toast || toast.kind === "error") return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  function save() {
    const check = mentorshipSchema.safeParse(doc);
    if (!check.success) return setToast({ kind: "error", text: describeIssue(check.error) });
    start(async () => {
      const r = await saveMentorship(JSON.stringify(doc));
      if ("error" in r) return setToast({ kind: "error", text: r.error });
      setDoc(r.doc);
      setSaved(r.doc);
      setVersions(r.versions);
      setToast({ kind: "ok", text: "Saved. The page is live with your changes." });
    });
  }

  function restore(v: Version) {
    if (dirty && !confirm("You have unsaved changes. Restoring will replace them. Continue?")) return;
    if (!confirm(`Make the version from ${fmt(v.savedAt)} live again?`)) return;
    start(async () => {
      const r = await restoreMentorship(v.id);
      if ("error" in r) return setToast({ kind: "error", text: r.error });
      setDoc(r.doc);
      setSaved(r.doc);
      setVersions(r.versions);
      setHistory(false);
      setToast({ kind: "ok", text: "Restored. That version is live again." });
    });
  }

  const filmOptions = [{ value: "", label: "No film" }, ...doc.films.map((f) => ({ value: f.id, label: `${f.title}${f.src ? "" : " (no video yet)"}` }))];
  const filmSelect = (label: string, value: string, onChange: (v: string) => void, hint?: string) => <Select label={label} value={value} onChange={onChange} options={filmOptions} hint={hint} />;

  function removeFilm(index: number) {
    edit((d) => {
      const [gone] = d.films.splice(index, 1);
      const clear = (v: string) => (v === gone.id ? "" : v);
      d.hero.filmId = clear(d.hero.filmId);
      d.mentor.filmId = clear(d.mentor.filmId);
      d.home.filmIds = d.home.filmIds.filter((x) => x !== gone.id);
      d.pillars.items.forEach((p) => (p.filmId = clear(p.filmId)));
      d.programmes.items.forEach((p) => (p.filmId = clear(p.filmId)));
      d.voices.items.forEach((p) => (p.filmId = clear(p.filmId)));
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-6 sm:px-6 lg:pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-burgundy">Mentorship</p>
          <h1 className="mt-1 font-display text-4xl">Edit the mentorship</h1>
          <p className="mt-1 text-sm text-ink/60">Everything on /mentorship and the homepage band. Save to publish.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/mentorship" target="_blank" rel="noopener" className="h-9 rounded-md px-3 text-sm font-medium leading-9 ring-1 ring-ink/12 hover:bg-white">
            Open page ↗
          </a>
          <button type="button" onClick={() => setHistory((h) => !h)} className="h-9 rounded-md px-3 text-sm font-medium ring-1 ring-ink/12 hover:bg-white" aria-expanded={history}>
            History ({versions.length})
          </button>
          <button
            type="button"
            onClick={() => confirm("Load the starter content into the editor? Nothing changes on the site until you save.") && setDoc(structuredClone(defaults))}
            className="h-9 rounded-md px-3 text-sm font-medium ring-1 ring-ink/12 hover:bg-white"
          >
            Starter content
          </button>
        </div>
      </div>

      {storage === "none" && (
        <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
          Saving and uploads are off: no Vercel Blob store is connected to this project. Connect one in Vercel (Storage → Blob), then redeploy.
        </p>
      )}
      {storage === "local" && (
        <p className="mt-5 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-900 ring-1 ring-sky-200">Development mode: content and uploads are saved on this computer (.data and public/uploads), not on the live site.</p>
      )}

      {history && (
        <div className="mt-5 rounded-xl bg-white p-5 ring-1 ring-ink/8">
          <p className="text-sm font-semibold">Saved versions</p>
          {versions.length === 0 ? (
            <p className="mt-2 text-sm text-ink/60">Nothing saved yet: the site shows the starter content.</p>
          ) : (
            <ul className="mt-3 divide-y divide-ink/8">
              {versions.map((v, i) => (
                <li key={v.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span>
                    {fmt(v.savedAt)}
                    {i === 0 && <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Live</span>}
                  </span>
                  {i > 0 && (
                    <button type="button" onClick={() => restore(v)} disabled={pending} className="rounded-md px-3 py-1.5 text-sm font-semibold ring-1 ring-ink/15 hover:bg-ink/5">
                      Restore
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[190px_1fr]">
        <nav className="hidden lg:block">
          <ul className="sticky top-24 space-y-0.5 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-3 py-1.5 text-ink/65 transition hover:bg-white hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-6">
          {/* ------------------------------------------------ Page & hero */}
          <Section id="page" title="Page & hero" description="The top of /mentorship, and how the page appears in Google and when shared.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Text label="Eyebrow" value={doc.hero.eyebrow} onChange={(v) => edit((d) => void (d.hero.eyebrow = v))} max={60} />
              {filmSelect("Hero film", doc.hero.filmId, (v) => edit((d) => void (d.hero.filmId = v)), "The big arched video. Best: the mentor's welcome.")}
              <Text label="Headline" value={doc.hero.title} onChange={(v) => edit((d) => void (d.hero.title = v))} max={60} />
              <Text label="Headline accent (italic)" value={doc.hero.accent} onChange={(v) => edit((d) => void (d.hero.accent = v))} max={40} />
            </div>
            <LongText label="Introduction" value={doc.hero.intro} onChange={(v) => edit((d) => void (d.hero.intro = v))} max={320} />
            <StringList label="Quick facts" values={doc.hero.facts} onChange={(v) => edit((d) => void (d.hero.facts = v))} max={4} itemMax={40} hint="Short, under the buttons. Up to 4." />
            <div className="grid gap-5 border-t border-ink/8 pt-5 sm:grid-cols-2">
              <Text label="Search & share title" value={doc.seo.title} onChange={(v) => edit((d) => void (d.seo.title = v))} max={70} />
              <LongText label="Search & share description" value={doc.seo.description} onChange={(v) => edit((d) => void (d.seo.description = v))} max={170} rows={2} />
            </div>
          </Section>

          {/* ----------------------------------------------------- Films */}
          <Section id="films" title="Films" description="Every video on the page. A film without a video shows a designed 'coming soon' frame until you upload one.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Text label="Gallery eyebrow" value={doc.gallery.eyebrow} onChange={(v) => edit((d) => void (d.gallery.eyebrow = v))} max={60} />
              <span />
              <Text label="Gallery headline" value={doc.gallery.title} onChange={(v) => edit((d) => void (d.gallery.title = v))} max={60} />
              <Text label="Gallery accent (italic)" value={doc.gallery.accent} onChange={(v) => edit((d) => void (d.gallery.accent = v))} max={40} />
            </div>
            <LongText label="Gallery introduction" value={doc.gallery.intro} onChange={(v) => edit((d) => void (d.gallery.intro = v))} max={280} rows={2} />
            <Repeater<Film>
              items={doc.films}
              update={(fn) => edit((d) => void (d.films = fn(d.films)))}
              onRemove={removeFilm}
              max={40}
              addLabel="Add a film"
              create={() => ({ id: rid("film"), title: "New film", caption: "", kind: "mentor", src: "", poster: "", brief: "", inGallery: true })}
              title={(f) => (
                <span className="flex items-center gap-2">
                  <span className={cn("size-2 shrink-0 rounded-full", f.src ? "bg-emerald-600" : "bg-amber-500")} title={f.src ? "Video uploaded" : "No video yet"} />
                  {f.title || "Untitled film"}
                  <span className="font-normal text-ink/45">· {filmKindLabels[f.kind]}</span>
                </span>
              )}
              render={(f, set) => (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Text label="Title" value={f.title} onChange={(v) => set({ title: v })} max={80} />
                    <Select<FilmKind> label="Type" value={f.kind} onChange={(v) => set({ kind: v })} options={filmKinds.map((k) => ({ value: k, label: filmKindLabels[k] }))} />
                  </div>
                  <LongText label="Caption" value={f.caption} onChange={(v) => set({ caption: v })} max={180} rows={2} />
                  <Toggle label="Show in the film gallery" checked={f.inGallery} onChange={(v) => set({ inGallery: v })} hint="Turn off for films used only in one spot (e.g. a programme card)." />
                  <div className="grid gap-5 xl:grid-cols-2">
                    <MediaField
                      label="Video"
                      kind="video"
                      value={f.src}
                      poster={f.poster}
                      onChange={(v, poster) => set(poster ? { src: v, poster } : { src: v })}
                      autoPoster
                      folder="films"
                      storage={storage}
                      hint="MP4 (H.264), vertical 9:16 works best. A poster is made automatically."
                    />
                    <MediaField label="Poster image" kind="image" value={f.poster} onChange={(v) => set({ poster: v })} folder="posters" storage={storage} hint="The still shown before it plays." />
                  </div>
                  <div>
                    <LongText label="Production brief (private)" value={f.brief} onChange={(v) => set({ brief: v })} max={3000} rows={5} hint="Never shown on the site. Use it for the Kling prompt or shot notes." />
                    {f.brief && (
                      <button type="button" onClick={() => navigator.clipboard?.writeText(f.brief).then(() => setToast({ kind: "ok", text: "Brief copied." }))} className="mt-2 h-8 rounded-md px-3 text-xs font-semibold ring-1 ring-ink/15 hover:bg-ink/5">
                        Copy brief
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-ink/45">Film id: {f.id}</p>
                </>
              )}
            />
          </Section>

          {/* --------------------------------------------- Homepage band */}
          <Section id="home" title="Homepage band" description="The mentorship section on the home page.">
            <Toggle label="Show on the home page" checked={doc.home.show} onChange={(v) => edit((d) => void (d.home.show = v))} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Text label="Eyebrow" value={doc.home.eyebrow} onChange={(v) => edit((d) => void (d.home.eyebrow = v))} max={60} />
              <span />
              <Text label="Headline" value={doc.home.title} onChange={(v) => edit((d) => void (d.home.title = v))} max={60} />
              <Text label="Accent (italic)" value={doc.home.accent} onChange={(v) => edit((d) => void (d.home.accent = v))} max={40} />
            </div>
            <LongText label="Text" value={doc.home.text} onChange={(v) => edit((d) => void (d.home.text = v))} max={320} />
            <div className="grid gap-5 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  {filmSelect(i === 0 ? "Big film" : `Small film ${i}`, doc.home.filmIds[i] ?? "", (v) =>
                    edit((d) => {
                      const ids = [0, 1, 2].map((j) => d.home.filmIds[j] ?? "");
                      ids[i] = v;
                      d.home.filmIds = ids.filter(Boolean);
                    }),
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* ------------------------------------------------- Manifesto */}
          <Section id="manifesto" title="Manifesto" description="The big quote and the scrolling line of topics under the hero.">
            <LongText label="Quote" value={doc.manifesto.quote} onChange={(v) => edit((d) => void (d.manifesto.quote = v))} max={220} rows={2} />
            <StringList label="Topics" values={doc.manifesto.topics} onChange={(v) => edit((d) => void (d.manifesto.topics = v))} max={16} itemMax={40} placeholder="e.g. Confidence" />
          </Section>

          {/* ----------------------------------------------- Focus areas */}
          <Section id="focus" title="Focus areas" description="What the mentorship works on. Visitors tap through them; each can show a film.">
            <Headings value={doc.pillars} onChange={(p) => edit((d) => void Object.assign(d.pillars, p))} withIntro />
            <Repeater
              items={doc.pillars.items}
              update={(fn) => edit((d) => void (d.pillars.items = fn(d.pillars.items)))}
              max={10}
              addLabel="Add a focus area"
              create={() => ({ id: rid("area"), title: "New focus area", kicker: "", text: "", points: [], filmId: "" })}
              title={(p) => p.title || "Untitled"}
              render={(p, set) => (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Text label="Title" value={p.title} onChange={(v) => set({ title: v })} max={60} />
                    <Text label="Subtitle" value={p.kicker} onChange={(v) => set({ kicker: v })} max={90} />
                  </div>
                  <LongText label="Description" value={p.text} onChange={(v) => set({ text: v })} max={600} />
                  <StringList label="Topics" values={p.points} onChange={(v) => set({ points: v })} max={8} />
                  {filmSelect("Film", p.filmId, (v) => set({ filmId: v }))}
                </>
              )}
            />
          </Section>

          {/* ------------------------------------------------ Programmes */}
          <Section id="programmes" title="Programmes" description="The packages people book and pay for. Leave the price empty for 'On request' (booking then goes to WhatsApp).">
            <Headings value={doc.programmes} onChange={(p) => edit((d) => void Object.assign(d.programmes, p))} withIntro />
            <LongText label="Note under the cards" value={doc.programmes.note} onChange={(v) => edit((d) => void (d.programmes.note = v))} max={280} rows={2} />
            <Repeater
              items={doc.programmes.items}
              update={(fn) => edit((d) => void (d.programmes.items = fn(d.programmes.items)))}
              max={6}
              min={1}
              addLabel="Add a programme"
              create={() => ({ id: rid("programme"), name: "New", ages: "", headline: "", focus: [], price: null, sessions: "", format: "", badge: "", filmId: "" })}
              title={(p) => (
                <>
                  {p.name || "Untitled"} <span className="font-normal text-ink/45">· {p.ages || "all ages"} · {p.price ? `KSh ${p.price.toLocaleString()}` : "On request"}</span>
                </>
              )}
              render={(p, set) => (
                <>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <Text label="Name" value={p.name} onChange={(v) => set({ name: v })} max={40} />
                    <Text label="Ages" value={p.ages} onChange={(v) => set({ ages: v })} max={24} placeholder="e.g. 25–35" />
                    <Text
                      label="Price (KSh)"
                      value={p.price ? String(p.price) : ""}
                      onChange={(v) => {
                        const n = Number(v.replace(/[^\d]/g, ""));
                        set({ price: n > 0 ? Math.min(n, 250_000) : null });
                      }}
                      max={7}
                      placeholder="On request"
                    />
                  </div>
                  <Text label="Headline" value={p.headline} onChange={(v) => set({ headline: v })} max={140} />
                  <StringList label="What it covers" values={p.focus} onChange={(v) => set({ focus: v })} max={8} itemMax={90} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Text label="Sessions" value={p.sessions} onChange={(v) => set({ sessions: v })} max={80} placeholder="e.g. One 90-minute session" />
                    <Text label="Format and follow-up" value={p.format} onChange={(v) => set({ format: v })} max={80} />
                    <Text label="Badge (optional)" value={p.badge} onChange={(v) => set({ badge: v })} max={24} hint="Highlights the card, e.g. “New”." />
                    {filmSelect("Card film", p.filmId, (v) => set({ filmId: v }))}
                  </div>
                </>
              )}
            />
          </Section>

          {/* ----------------------------------------------- How it works */}
          <Section id="steps" title="How it works" description="The booking journey, step by step.">
            <Headings value={doc.steps} onChange={(p) => edit((d) => void Object.assign(d.steps, p))} />
            <Repeater
              items={doc.steps.items}
              update={(fn) => edit((d) => void (d.steps.items = fn(d.steps.items)))}
              max={6}
              addLabel="Add a step"
              create={() => ({ title: "New step", text: "" })}
              title={(s) => s.title || "Untitled"}
              render={(s, set) => (
                <>
                  <Text label="Title" value={s.title} onChange={(v) => set({ title: v })} max={60} />
                  <LongText label="Text" value={s.text} onChange={(v) => set({ text: v })} max={240} rows={2} />
                </>
              )}
            />
          </Section>

          {/* ----------------------------------------------------- Mentor */}
          <Section id="mentor" title="Mentor" description="Who runs the sessions. A photo, if uploaded, shows instead of the film frame.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Text label="Eyebrow" value={doc.mentor.eyebrow} onChange={(v) => edit((d) => void (d.mentor.eyebrow = v))} max={60} />
              <Text label="Name" value={doc.mentor.name} onChange={(v) => edit((d) => void (d.mentor.name = v))} max={60} />
              <Text label="Role" value={doc.mentor.role} onChange={(v) => edit((d) => void (d.mentor.role = v))} max={80} />
              {filmSelect("Film", doc.mentor.filmId, (v) => edit((d) => void (d.mentor.filmId = v)))}
            </div>
            {[0, 1, 2, 3].map((i) =>
              i <= doc.mentor.bio.length ? (
                <LongText
                  key={i}
                  label={`Bio paragraph ${i + 1}${i >= doc.mentor.bio.length ? " (optional)" : ""}`}
                  value={doc.mentor.bio[i] ?? ""}
                  onChange={(v) =>
                    edit((d) => {
                      const bio = [0, 1, 2, 3].map((j) => d.mentor.bio[j] ?? "");
                      bio[i] = v;
                      d.mentor.bio = bio.filter((b) => b.trim());
                    })
                  }
                  max={600}
                />
              ) : null,
            )}
            <LongText label="Signature quote" value={doc.mentor.quote} onChange={(v) => edit((d) => void (d.mentor.quote = v))} max={200} rows={2} />
            <MediaField label="Photo (optional)" kind="image" value={doc.mentor.photo} onChange={(v) => edit((d) => void (d.mentor.photo = v))} folder="photos" storage={storage} hint="Portrait, 4:5. Leave empty to show the film." />
          </Section>

          {/* ---------------------------------------------- Client voices */}
          <Section id="voices" title="Client voices" description="Reviews from real clients only, shared with their permission. Made-up reviews are illegal and destroy trust.">
            <Toggle label="Show this section" checked={doc.voices.show} onChange={(v) => edit((d) => void (d.voices.show = v))} hint="It stays hidden until it's on and has at least one review." />
            <Headings value={doc.voices} onChange={(p) => edit((d) => void Object.assign(d.voices, p))} />
            <Repeater
              items={doc.voices.items}
              update={(fn) => edit((d) => void (d.voices.items = fn(d.voices.items)))}
              max={12}
              addLabel="Add a review"
              create={() => ({ id: rid("voice"), quote: "", name: "", detail: "", filmId: "" })}
              title={(v) => v.name || "New review"}
              render={(v, set) => (
                <>
                  <LongText label="What she said" value={v.quote} onChange={(x) => set({ quote: x })} max={400} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Text label="Name (as she agreed)" value={v.name} onChange={(x) => set({ name: x })} max={60} placeholder="e.g. Wanjiru K." />
                    <Text label="Detail" value={v.detail} onChange={(x) => set({ detail: x })} max={80} placeholder="e.g. Rise programme, Nairobi" />
                  </div>
                  {filmSelect("Her video (optional)", v.filmId, (x) => set({ filmId: x }))}
                </>
              )}
            />
          </Section>

          {/* ------------------------------------------------------ FAQ */}
          <Section id="faq" title="Questions" description="Answer what people would otherwise phone about.">
            <Headings value={doc.faq} onChange={(p) => edit((d) => void Object.assign(d.faq, p))} />
            <Repeater
              items={doc.faq.items}
              update={(fn) => edit((d) => void (d.faq.items = fn(d.faq.items)))}
              max={16}
              addLabel="Add a question"
              create={() => ({ q: "New question?", a: "" })}
              title={(f) => f.q || "Untitled"}
              render={(f, set) => (
                <>
                  <Text label="Question" value={f.q} onChange={(v) => set({ q: v })} max={160} />
                  <LongText label="Answer" value={f.a} onChange={(v) => set({ a: v })} max={700} />
                </>
              )}
            />
          </Section>

          {/* -------------------------------------------------- Booking */}
          <Section id="booking" title="Booking" description="What happens when someone taps 'Book'.">
            <Select<"pay" | "whatsapp">
              label="How people book"
              value={doc.booking.mode}
              onChange={(v) => edit((d) => void (d.booking.mode = v))}
              options={[
                { value: "pay", label: "Pay with M-Pesa first, then confirm on WhatsApp" },
                { value: "whatsapp", label: "Send a request on WhatsApp (pay later)" },
              ]}
              hint={!payReady && doc.booking.mode === "pay" ? "M-Pesa payments aren't switched on for this site yet, so bookings go to WhatsApp until they are." : undefined}
            />
            <Text label="Booking title" value={doc.booking.title} onChange={(v) => edit((d) => void (d.booking.title = v))} max={80} />
            <LongText label="Booking introduction" value={doc.booking.intro} onChange={(v) => edit((d) => void (d.booking.intro = v))} max={280} rows={2} />
            <StringList label="Session options" values={doc.booking.formats} onChange={(v) => edit((d) => void (d.booking.formats = v.length ? v : d.booking.formats))} max={4} itemMax={40} hint="At least one." />
            <LongText label="Message after payment" value={doc.booking.afterPayment} onChange={(v) => edit((d) => void (d.booking.afterPayment = v))} max={280} rows={2} />
          </Section>

          {/* -------------------------------------------------- Closing */}
          <Section id="closing" title="Closing" description="The last call to action, and the small print.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Text label="Headline" value={doc.closing.title} onChange={(v) => edit((d) => void (d.closing.title = v))} max={60} />
              <Text label="Accent (italic)" value={doc.closing.accent} onChange={(v) => edit((d) => void (d.closing.accent = v))} max={40} />
            </div>
            <LongText label="Text" value={doc.closing.text} onChange={(v) => edit((d) => void (d.closing.text = v))} max={280} rows={2} />
            <LongText label="Disclaimer" value={doc.disclaimer} onChange={(v) => edit((d) => void (d.disclaimer = v))} max={700} hint="Keep it: the mentorship is guidance, not medical or psychological treatment." />
          </Section>
        </div>
      </div>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/8 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <p className="min-w-0 flex-1 truncate text-sm" aria-live="polite">
            {pending ? (
              <span className="text-ink/60">Saving…</span>
            ) : dirty ? (
              <span className="font-semibold text-amber-700">● Unsaved changes</span>
            ) : (
              <span className="text-ink/55">All changes saved{versions[0] ? ` · ${fmt(versions[0].savedAt)}` : ""}</span>
            )}
          </p>
          {dirty && (
            <button type="button" onClick={() => confirm("Discard your unsaved changes?") && setDoc(saved)} disabled={pending} className="h-10 rounded-md px-4 text-sm font-semibold ring-1 ring-ink/15 hover:bg-ink/5">
              Discard
            </button>
          )}
          <button type="button" onClick={save} disabled={!dirty || pending || storage === "none"} className="h-10 rounded-md bg-burgundy px-5 text-sm font-semibold text-white transition hover:bg-burgundy-bright disabled:opacity-40">
            Save & publish
          </button>
        </div>
      </div>

      {toast && (
        <div role={toast.kind === "error" ? "alert" : "status"} className={cn("fixed bottom-20 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-start gap-3 rounded-lg px-4 py-3 text-sm shadow-lg", toast.kind === "ok" ? "bg-ink text-white" : "bg-burgundy-bright text-white")}>
          <span className="min-w-0 flex-1">{toast.text}</span>
          <button type="button" onClick={() => setToast(null)} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
    </div>
  );
}

/** Eyebrow / headline / accent (/ intro) for a section. */
function Headings<T extends { eyebrow: string; title: string; accent: string; intro?: string }>({ value, onChange, withIntro = false }: { value: T; onChange: (patch: Partial<T>) => void; withIntro?: boolean }) {
  return (
    <div className="space-y-5 rounded-lg bg-ink/[0.025] p-4">
      <div className="grid gap-5 sm:grid-cols-3">
        <Text label="Eyebrow" value={value.eyebrow} onChange={(v) => onChange({ eyebrow: v } as Partial<T>)} max={60} />
        <Text label="Headline" value={value.title} onChange={(v) => onChange({ title: v } as Partial<T>)} max={60} />
        <Text label="Accent (italic)" value={value.accent} onChange={(v) => onChange({ accent: v } as Partial<T>)} max={40} />
      </div>
      {withIntro && <LongText label="Introduction" value={value.intro ?? ""} onChange={(v) => onChange({ intro: v } as Partial<T>)} max={280} rows={2} />}
    </div>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" });
}
