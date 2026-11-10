"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import type { StorageMode } from "@/lib/cms/store";
import { cn } from "@/lib/utils";
import { capturePoster, uploadFile, type UploadFolder } from "./upload";

// Small form kit for the admin dashboard.

const control = "w-full rounded-md bg-white px-3 text-[15px] text-ink ring-1 ring-ink/15 outline-none transition placeholder:text-ink/40 focus:ring-2 focus:ring-burgundy";

export function Section({ id, title, description, children, actions }: { id: string; title: string; description?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl bg-white p-5 ring-1 ring-ink/8 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/8 pb-4">
        <div>
          <h2 className="font-display text-2xl">{title}</h2>
          {description && <p className="mt-1 max-w-2xl text-sm text-ink/60">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export function Field({ label, hint, children, count }: { label: string; hint?: ReactNode; children: (id: string) => ReactNode; count?: { value: string; max: number } }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-semibold text-ink/80">
          {label}
        </label>
        {count && <span className={cn("text-xs tabular-nums", count.value.length > count.max ? "font-semibold text-burgundy-bright" : "text-ink/40")}>{count.value.length}/{count.max}</span>}
      </div>
      <div className="mt-1.5">{children(id)}</div>
      {hint && <p className="mt-1 text-xs leading-relaxed text-ink/55">{hint}</p>}
    </div>
  );
}

export function Text({ label, value, onChange, max = 140, hint, placeholder }: { label: string; value: string; onChange: (v: string) => void; max?: number; hint?: ReactNode; placeholder?: string }) {
  return (
    <Field label={label} hint={hint} count={{ value, max }}>
      {(id) => <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(control, "h-10")} />}
    </Field>
  );
}

export function LongText({ label, value, onChange, max = 600, rows = 3, hint }: { label: string; value: string; onChange: (v: string) => void; max?: number; rows?: number; hint?: ReactNode }) {
  return (
    <Field label={label} hint={hint} count={{ value, max }}>
      {(id) => <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={cn(control, "py-2.5 leading-relaxed")} />}
    </Field>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition", checked ? "bg-burgundy" : "bg-ink/20")}
      >
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </button>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="block text-xs text-ink/55">{hint}</span>}
      </span>
    </label>
  );
}

export function Select<T extends string>({ label, value, onChange, options, hint }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; hint?: ReactNode }) {
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className={cn(control, "h-10 pr-8")}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

/** A short list of one-line texts (chips, bullet points). */
export function StringList({ label, values, onChange, max = 8, itemMax = 80, hint, placeholder = "Add an item" }: { label: string; values: string[]; onChange: (v: string[]) => void; max?: number; itemMax?: number; hint?: string; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v || values.length >= max) return;
    onChange([...values, v.slice(0, itemMax)]);
    setDraft("");
  };
  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <div>
          <ul className="flex flex-wrap gap-1.5">
            {values.map((v, i) => (
              <li key={`${v}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-ink/5 py-1 pl-3 pr-1 text-sm">
                <input
                  value={v}
                  onChange={(e) => onChange(values.map((x, j) => (j === i ? e.target.value : x)))}
                  aria-label={`${label} ${i + 1}`}
                  className="w-auto min-w-0 bg-transparent outline-none [field-sizing:content]"
                />
                <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="grid size-6 place-items-center rounded-full text-ink/50 hover:bg-ink/10 hover:text-ink" aria-label={`Remove ${v}`}>
                  ×
                </button>
              </li>
            ))}
          </ul>
          {values.length < max && (
            <div className="mt-2 flex gap-2">
              <input
                id={id}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    add();
                  }
                }}
                placeholder={placeholder}
                maxLength={itemMax}
                className={cn(control, "h-9 text-sm")}
              />
              <button type="button" onClick={add} className="h-9 shrink-0 rounded-md px-3 text-sm font-semibold ring-1 ring-ink/15 hover:bg-ink/5">
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </Field>
  );
}

/**
 * A list of cards (films, programmes…) that can be added, reordered, collapsed and removed.
 * Every change goes through `update(prev => next)`, so a slow upload finishing later
 * can't overwrite edits made in the meantime.
 */
export function Repeater<T>({
  items,
  update,
  title,
  render,
  create,
  max,
  addLabel,
  onRemove,
  min = 0,
}: {
  items: T[];
  update: (fn: (prev: T[]) => T[]) => void;
  title: (item: T, index: number) => ReactNode;
  render: (item: T, set: (patch: Partial<T>) => void, index: number) => ReactNode;
  create: () => T;
  max: number;
  addLabel: string;
  /** Custom removal (e.g. to clear references to a deleted film). */
  onRemove?: (index: number) => void;
  min?: number;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    update((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setOpen((o) => (o === i ? j : o === j ? i : o));
  };
  const patch = (i: number) => (p: Partial<T>) => update((prev) => prev.map((x, j) => (j === i ? { ...x, ...p } : x)));

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={cn("rounded-lg ring-1 transition", isOpen ? "bg-[#fdfafb] ring-burgundy/30" : "ring-ink/10")}>
            <div className="flex items-center gap-2 px-3 py-2.5">
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-expanded={isOpen}>
                <span className="w-6 shrink-0 text-xs tabular-nums text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{title(item, i)}</span>
                <span className={cn("text-ink/40 transition-transform", isOpen && "rotate-180")} aria-hidden>
                  ▾
                </span>
              </button>
              <div className="flex shrink-0 items-center">
                <IconBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                  ↑
                </IconBtn>
                <IconBtn label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                  ↓
                </IconBtn>
                <IconBtn
                  label="Remove"
                  disabled={items.length <= min}
                  onClick={() => {
                    if (!confirm("Remove this item? You can undo by not saving.")) return;
                    if (onRemove) onRemove(i);
                    else update((prev) => prev.filter((_, j) => j !== i));
                    setOpen(null);
                  }}
                  danger
                >
                  ×
                </IconBtn>
              </div>
            </div>
            {isOpen && (
              <div className="space-y-5 border-t border-ink/8 px-4 pb-5 pt-4 sm:px-5">
                {render(item, patch(i), i)}
              </div>
            )}
          </div>
        );
      })}
      {items.length < max && (
        <button
          type="button"
          onClick={() => {
            update((prev) => [...prev, create()]);
            setOpen(items.length);
          }}
          className="w-full rounded-lg border border-dashed border-ink/20 py-3 text-sm font-semibold text-ink/70 transition hover:border-burgundy hover:text-burgundy"
        >
          + {addLabel}
        </button>
      )}
    </div>
  );
}

function IconBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} className={cn("grid size-8 place-items-center rounded-md text-base text-ink/55 transition hover:bg-ink/5 hover:text-ink disabled:opacity-25", danger && "hover:bg-burgundy/10 hover:text-burgundy-bright")}>
      {children}
    </button>
  );
}

/** Upload a video or image, see it, replace or remove it. */
export function MediaField({
  label,
  kind,
  value,
  onChange,
  folder,
  storage,
  hint,
  autoPoster = false,
  poster,
}: {
  label: string;
  kind: "video" | "image";
  value: string;
  /** The uploaded file's URL; for a video with `autoPoster`, also its captured poster, in the same call. */
  onChange: (url: string, poster?: string) => void;
  folder: UploadFolder;
  storage: StorageMode;
  hint?: ReactNode;
  autoPoster?: boolean;
  poster?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState("");

  async function pick(file: File | undefined) {
    if (!file) return;
    setError("");
    setProgress(0);
    setStatus("Uploading…");
    try {
      const url = await uploadFile(file, folder, storage, setProgress);
      let posterUrl: string | undefined;
      if (kind === "video" && autoPoster) {
        setStatus("Making the poster…");
        const still = await capturePoster(file);
        if (still) posterUrl = await uploadFile(still, "posters", storage).catch(() => undefined);
      }
      onChange(url, posterUrl);
      setStatus("Uploaded. Save to publish.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setStatus("");
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  }

  const disabled = storage === "none" || progress !== null;

  return (
    <Field label={label} hint={hint}>
      {(id) => (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className={cn("relative shrink-0 overflow-hidden rounded-md bg-ink/5 ring-1 ring-ink/10", kind === "video" ? "aspect-9/16 w-28" : "aspect-4/5 w-28")}>
            {value ? (
              kind === "video" ? (
                <video src={value} poster={poster || undefined} muted playsInline controls preload="metadata" className="h-full w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded file
                <img src={value} alt="" className="h-full w-full object-cover" />
              )
            ) : (
              <span className="grid h-full w-full place-items-center px-2 text-center text-[11px] font-semibold uppercase tracking-wider text-ink/40">No {kind}</span>
            )}
            {progress !== null && (
              <span className="absolute inset-x-0 bottom-0 h-1.5 bg-ink/10">
                <span className="block h-full bg-burgundy transition-all" style={{ width: `${progress}%` }} />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <input ref={input} id={id} type="file" accept={kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp"} className="sr-only" onChange={(e) => pick(e.target.files?.[0])} disabled={disabled} />
              <button type="button" onClick={() => input.current?.click()} disabled={disabled} className="h-9 rounded-md bg-ink px-3.5 text-sm font-semibold text-white transition hover:bg-burgundy disabled:opacity-40">
                {value ? `Replace ${kind}` : `Upload ${kind}`}
              </button>
              {value && (
                <button type="button" onClick={() => onChange("")} disabled={progress !== null} className="h-9 rounded-md px-3 text-sm font-semibold ring-1 ring-ink/15 hover:bg-ink/5">
                  Remove
                </button>
              )}
            </div>
            {progress !== null && <p className="text-xs tabular-nums text-ink/60">{status} {Math.round(progress)}%</p>}
            {progress === null && status && <p className="text-xs font-medium text-emerald-700">{status}</p>}
            {error && <p role="alert" className="text-xs font-semibold text-burgundy-bright">{error}</p>}
            {value && <p className="truncate text-xs text-ink/45" title={value}>{value}</p>}
          </div>
        </div>
      )}
    </Field>
  );
}
