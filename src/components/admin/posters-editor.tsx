"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { savePosters } from "@/app/admin/(dashboard)/posters/actions";
import type { StorageMode } from "@/lib/cms/store";
import { describeIssue } from "@/lib/mentorship/schema";
import {
  DELAY_SECONDS_MAX,
  DISPLAY_SECONDS,
  POSTER_KIND_LABELS,
  POSTER_KINDS,
  posterDetailsUrl,
  postersSchema,
  posterStatus,
  TIMES_PER_DAY_MAX,
  type Poster,
  type PosterKind,
  type PostersDoc,
  type PosterStatus,
} from "@/lib/posters/schema";
import { endOfSunday, formatNairobi, fromNairobiInput, toNairobiInput } from "@/lib/posters/time";
import { cn } from "@/lib/utils";
import { PosterView } from "../posters/poster-popup";
import { Field, LongText, MediaField, Repeater, Section, Select, StringList, Text, Toggle } from "./fields";

const HOUR = 3_600_000;
const STATUS_STYLE: Record<PosterStatus, string> = {
  live: "bg-emerald-100 text-emerald-800",
  scheduled: "bg-sky-100 text-sky-800",
  paused: "bg-amber-100 text-amber-800",
  ended: "bg-ink/5 text-ink/50",
};

const control = "h-10 w-full rounded-md bg-white px-3 text-[15px] ring-1 ring-ink/15 outline-none focus:ring-2 focus:ring-burgundy";
const chip = "rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-ink/15 hover:bg-ink/5";

function newPoster(): Poster {
  return {
    id: `poster-${Math.random().toString(36).slice(2, 7)}`,
    title: "New poster",
    image: "",
    kind: "offer",
    summary: "",
    highlights: [],
    details: "",
    priceText: "",
    ctaLabel: "",
    ctaUrl: "",
    terms: "",
    startsAt: new Date().toISOString(),
    endsAt: endOfSunday().toISOString(),
    delaySeconds: 5,
    displaySeconds: 8,
    timesPerDay: 1,
    priority: 0,
    active: true,
  };
}

const howOften = (n: number) => (n === 1 ? "once a day" : `up to ${n}× a day`);

export function PostersEditor({ initial, savedAt: initialSavedAt, storage, problem }: { initial: PostersDoc; savedAt: string | null; storage: StorageMode; problem?: string }) {
  const [doc, setDoc] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [savedAt, setSavedAt] = useState(initialSavedAt);
  const [toast, setToast] = useState<{ kind: "ok" | "error"; text: string } | null>(problem ? { kind: "error", text: problem } : null);
  const [preview, setPreview] = useState<Poster | null>(null);
  const [pending, start] = useTransition();
  const dirty = useMemo(() => JSON.stringify(doc) !== JSON.stringify(saved), [doc, saved]);

  const update = useCallback((fn: (prev: Poster[]) => Poster[]) => setDoc((d) => ({ posters: fn(d.posters) })), []);
  const closePreview = useCallback(() => setPreview(null), []);

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
    const check = postersSchema.safeParse(doc);
    if (!check.success) return setToast({ kind: "error", text: describeIssue(check.error) });
    start(async () => {
      const r = await savePosters(JSON.stringify(doc));
      if ("error" in r) return setToast({ kind: "error", text: r.error });
      setDoc(r.doc);
      setSaved(r.doc);
      setSavedAt(r.savedAt);
      setToast({ kind: "ok", text: "Saved. Live posters start popping up within about a minute." });
    });
  }

  const live = doc.posters.filter((p) => posterStatus(p) === "live").length;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 sm:px-6 lg:pt-10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-burgundy">Posters</p>
      <h1 className="mt-1 font-display text-4xl">Pop-up posters</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/60">
        A poster pops up a few seconds after a visitor arrives, stays on screen for {DISPLAY_SECONDS.min}–{DISPLAY_SECONDS.max} seconds, and shows up to its
        &ldquo;times per day&rdquo; on each device (at least 30 minutes apart). Tapping it opens its offer at the top of the shop. Times are Nairobi time.
        {live > 0 && <span className="font-semibold text-emerald-700"> {live} live now.</span>}
      </p>

      {storage === "none" && (
        <p className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
          Saving and uploads are off: no Vercel Blob store is connected to this project. Connect one in Vercel (Storage → Blob), then redeploy.
        </p>
      )}

      <div className="mt-6">
        <Section id="posters" title="Posters" description="When several are live at once, the highest priority shows first.">
          {doc.posters.length === 0 && <p className="rounded-lg bg-ink/[0.03] px-4 py-6 text-center text-sm text-ink/60">No posters yet. Add one below.</p>}
          <Repeater<Poster>
            items={doc.posters}
            update={update}
            max={30}
            addLabel="New poster"
            create={newPoster}
            title={(p) => {
              const s = posterStatus(p);
              return (
                <span className="flex min-w-0 items-center gap-2.5">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                    <img src={p.image} alt="" className="h-9 w-7 shrink-0 rounded object-cover ring-1 ring-ink/10" />
                  ) : (
                    <span className="h-9 w-7 shrink-0 rounded bg-ink/5" />
                  )}
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS_STYLE[s])}>{s}</span>
                  <span className="truncate">{p.title || "Untitled"}</span>
                  <span className="hidden shrink-0 font-normal text-ink/45 md:inline">
                    · {formatNairobi(p.startsAt)} → {formatNairobi(p.endsAt)} · {p.displaySeconds}s · {howOften(p.timesPerDay)}
                  </span>
                </span>
              );
            }}
            render={(p, set) => (
              <>
                <div className="grid gap-5 sm:grid-cols-[1fr_200px]">
                  <Text label="Title" value={p.title} onChange={(v) => set({ title: v })} max={120} hint="Read out by screen readers, and the heading of the offer." />
                  <Select<PosterKind> label="Type" value={p.kind} onChange={(v) => set({ kind: v })} options={POSTER_KINDS.map((k) => ({ value: k, label: POSTER_KIND_LABELS[k] }))} />
                </div>

                <MediaField
                  label="Poster image"
                  kind="image"
                  value={p.image}
                  onChange={(v) => set({ image: v })}
                  folder="images"
                  scope="posters"
                  storage={storage}
                  hint="JPEG, PNG or WebP. A portrait poster works best."
                />

                <div className="space-y-2">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <DateTime label="Starts (Nairobi time)" value={p.startsAt} onChange={(v) => set({ startsAt: v })} />
                    <DateTime label="Ends (Nairobi time)" value={p.endsAt} onChange={(v) => set({ endsAt: v })} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={chip} onClick={() => set({ endsAt: endOfSunday().toISOString() })}>
                      Until Sunday midnight
                    </button>
                    {[
                      ["24 hours", 24],
                      ["3 days", 72],
                      ["1 week", 168],
                    ].map(([label, h]) => (
                      <button key={label} type="button" className={chip} onClick={() => set({ endsAt: new Date(Date.now() + Number(h) * HOUR).toISOString() })}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 rounded-lg bg-ink/[0.025] p-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label={`Shows for: ${p.displaySeconds}s`} hint={`${DISPLAY_SECONDS.min}–${DISPLAY_SECONDS.max} seconds, then it closes itself.`}>
                    {(id) => (
                      <input id={id} type="range" min={DISPLAY_SECONDS.min} max={DISPLAY_SECONDS.max} step={1} value={p.displaySeconds} onChange={(e) => set({ displaySeconds: Number(e.target.value) })} className="mt-3 w-full accent-burgundy" />
                    )}
                  </Field>
                  <Field label="Times per day" hint="On each device, 30+ min apart.">
                    {(id) => (
                      <select id={id} value={p.timesPerDay} onChange={(e) => set({ timesPerDay: Number(e.target.value) })} className={control}>
                        {Array.from({ length: TIMES_PER_DAY_MAX }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n === 1 ? "Once a day" : `${n} times a day`}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <Field label="Delay (seconds)" hint="After a visitor arrives.">
                    {(id) => <input id={id} type="number" min={0} max={DELAY_SECONDS_MAX} value={p.delaySeconds} onChange={(e) => set({ delaySeconds: clampInt(e.target.value, 0, DELAY_SECONDS_MAX) })} className={control} />}
                  </Field>
                  <Field label="Priority" hint="Highest shows first.">
                    {(id) => <input id={id} type="number" min={-100} max={100} value={p.priority} onChange={(e) => set({ priority: clampInt(e.target.value, -100, 100) })} className={control} />}
                  </Field>
                </div>

                <fieldset className="space-y-5 rounded-lg p-4 ring-1 ring-ink/10">
                  <legend className="px-1 text-xs font-bold uppercase tracking-[0.14em] text-ink/60">Offer details (top of the shop)</legend>
                  <LongText label="Summary" value={p.summary} onChange={(v) => set({ summary: v })} max={300} rows={2} />
                  <StringList label="What's included" values={p.highlights} onChange={(v) => set({ highlights: v })} max={12} itemMax={120} />
                  <LongText label="Description" value={p.details} onChange={(v) => set({ details: v })} max={4000} rows={4} hint="Leave a blank line between paragraphs." />
                  <div className="grid gap-5 sm:grid-cols-3">
                    <Text label="Price (optional)" value={p.priceText} onChange={(v) => set({ priceText: v })} max={80} placeholder="e.g. KSh 8,500" />
                    <Text label="Button label" value={p.ctaLabel} onChange={(v) => set({ ctaLabel: v })} max={40} placeholder="Get it now" />
                    <Text label="Button link" value={p.ctaUrl} onChange={(v) => set({ ctaUrl: v })} max={500} placeholder="/the-kit, https://… or tel:+254…" hint="Empty: opens WhatsApp." />
                  </div>
                  <LongText label="Terms (optional)" value={p.terms} onChange={(v) => set({ terms: v })} max={1000} rows={2} />
                </fieldset>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Toggle label="Active" checked={p.active} onChange={(v) => set({ active: v })} hint="Turn off to pause without deleting." />
                  <div className="flex gap-2">
                    {posterStatus(p) === "live" && saved.posters.some((x) => x.id === p.id) && (
                      <a href={posterDetailsUrl(p.id)} target="_blank" rel="noopener" className="h-9 rounded-md px-3 text-sm font-semibold leading-9 ring-1 ring-ink/15 hover:bg-ink/5">
                        View offer ↗
                      </a>
                    )}
                    <button type="button" disabled={!p.image} onClick={() => setPreview(p)} className="h-9 rounded-md bg-ink px-3.5 text-sm font-semibold text-white hover:bg-burgundy disabled:opacity-40">
                      Preview pop-up
                    </button>
                  </div>
                </div>
              </>
            )}
          />
        </Section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/8 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <p className="min-w-0 flex-1 truncate text-sm" aria-live="polite">
            {pending ? <span className="text-ink/60">Saving…</span> : dirty ? <span className="font-semibold text-amber-700">● Unsaved changes</span> : <span className="text-ink/55">All changes saved{savedAt ? ` · ${formatNairobi(savedAt)}` : ""}</span>}
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
        <div role={toast.kind === "error" ? "alert" : "status"} className={cn("fixed bottom-20 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-start gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg", toast.kind === "ok" ? "bg-ink" : "bg-burgundy-bright")}>
          <span className="min-w-0 flex-1">{toast.text}</span>
          <button type="button" onClick={() => setToast(null)} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <AnimatePresence>{preview && <PosterView key="preview" poster={{ ...preview, detailsUrl: null }} onClose={closePreview} />}</AnimatePresence>
    </div>
  );
}

function clampInt(value: string, min: number, max: number) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
}

/** A datetime-local input that reads and writes Nairobi time, stored as an ISO string. */
function DateTime({ label, value, onChange }: { label: string; value: string; onChange: (iso: string) => void }) {
  return (
    <Field label={label}>
      {(id) => (
        <input
          id={id}
          type="datetime-local"
          value={toNairobiInput(new Date(value))}
          onChange={(e) => {
            const d = fromNairobiInput(e.target.value);
            if (d) onChange(d.toISOString());
          }}
          className={control}
        />
      )}
    </Field>
  );
}
