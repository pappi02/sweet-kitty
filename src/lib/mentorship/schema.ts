// The shape of everything the mentorship page shows. The admin dashboard edits one
// document of this shape; the public pages only ever render it. Every field has a
// limit, so a bad save can't break the page or smuggle in a foreign media URL.
import { z } from "zod";

/** Media must come from this site (/uploads, /videos, /products…) or our Vercel Blob store. */
export function isSafeMediaUrl(value: string) {
  if (value === "") return true;
  if (value.startsWith("/")) return !value.startsWith("//") && !value.includes("..") && !value.includes("\\") && /^\/[A-Za-z0-9/_.\-%]+$/.test(value);
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

const text = (max: number) => z.string().trim().max(max);
const line = (max = 140) => text(max);
const media = z.string().trim().max(600).refine(isSafeMediaUrl, "Media must be an uploaded file or a file on this site.");
const id = z.string().trim().regex(/^[a-z0-9-]{1,40}$/, "Ids use lowercase letters, numbers and dashes.");
/** Optional reference to a film by id ("" = none). */
const filmRef = z.union([id, z.literal("")]);

export const filmKinds = ["mentor", "circle", "one-on-one", "hangout", "story"] as const;
export const filmKindLabels: Record<(typeof filmKinds)[number], string> = {
  mentor: "Mentor talk",
  circle: "The circle",
  "one-on-one": "One-on-one",
  hangout: "Hangout",
  story: "Her story",
};

export const filmSchema = z.object({
  id,
  title: line(80).min(1, "Every film needs a title."),
  caption: line(180),
  kind: z.enum(filmKinds),
  /** The video file. Empty = a designed "coming soon" frame shows instead. */
  src: media,
  /** Still image shown before playing. Captured automatically on upload. */
  poster: media,
  /** Admin-only notes: the Kling prompt / shot list used to produce this film. */
  brief: text(3000),
  /** Show in the "Watch the conversations" gallery. */
  inGallery: z.boolean(),
});

export const pillarSchema = z.object({
  id,
  title: line(60).min(1, "Every focus area needs a title."),
  kicker: line(90),
  text: text(600),
  points: z.array(line(80)).max(8),
  filmId: filmRef,
});

export const programmeSchema = z.object({
  id,
  name: line(40).min(1, "Every programme needs a name."),
  ages: line(24),
  headline: line(140),
  focus: z.array(line(90)).max(8),
  /** Price in KES. null = "Price on request" (booking goes to WhatsApp). */
  price: z.number().int().min(1).max(250_000).nullable(),
  sessions: line(80),
  format: line(80),
  badge: line(24),
  filmId: filmRef,
});

export const mentorshipSchema = z
  .object({
    seo: z.object({ title: line(70), description: line(170) }),
    hero: z.object({
      eyebrow: line(60),
      title: line(60),
      accent: line(40),
      intro: text(320),
      facts: z.array(line(40)).max(4),
      filmId: filmRef,
    }),
    home: z.object({
      show: z.boolean(),
      eyebrow: line(60),
      title: line(60),
      accent: line(40),
      text: text(320),
      filmIds: z.array(id).max(3),
    }),
    manifesto: z.object({ quote: text(220), topics: z.array(line(40)).max(16) }),
    gallery: z.object({ eyebrow: line(60), title: line(60), accent: line(40), intro: text(280) }),
    films: z.array(filmSchema).max(40),
    pillars: z.object({ eyebrow: line(60), title: line(60), accent: line(40), intro: text(280), items: z.array(pillarSchema).max(10) }),
    programmes: z.object({ eyebrow: line(60), title: line(60), accent: line(40), intro: text(280), note: text(280), items: z.array(programmeSchema).min(1, "Keep at least one programme.").max(6) }),
    steps: z.object({ eyebrow: line(60), title: line(60), accent: line(40), items: z.array(z.object({ title: line(60), text: text(240) })).max(6) }),
    mentor: z.object({ eyebrow: line(60), name: line(60), role: line(80), bio: z.array(text(600)).max(4), quote: text(200), filmId: filmRef, photo: media }),
    voices: z.object({
      show: z.boolean(),
      eyebrow: line(60),
      title: line(60),
      accent: line(40),
      items: z.array(z.object({ id, quote: text(400), name: line(60), detail: line(80), filmId: filmRef })).max(12),
    }),
    faq: z.object({ eyebrow: line(60), title: line(60), accent: line(40), items: z.array(z.object({ q: line(160), a: text(700) })).max(16) }),
    booking: z.object({
      /** "pay": M-Pesa first (when payments are switched on). "whatsapp": request on WhatsApp. */
      mode: z.enum(["pay", "whatsapp"]),
      title: line(80),
      intro: text(280),
      formats: z.array(line(40)).min(1).max(4),
      afterPayment: text(280),
    }),
    closing: z.object({ title: line(60), accent: line(40), text: text(280) }),
    disclaimer: text(700),
  })
  .superRefine((doc, ctx) => {
    const filmIds = new Set<string>();
    doc.films.forEach((f, i) => {
      if (filmIds.has(f.id)) ctx.addIssue({ code: "custom", path: ["films", i, "id"], message: `Two films share the id "${f.id}".` });
      filmIds.add(f.id);
    });
    const checkRef = (ref: string, path: (string | number)[]) => {
      if (ref && !filmIds.has(ref)) ctx.addIssue({ code: "custom", path, message: "This points to a film that no longer exists. Choose another film." });
    };
    checkRef(doc.hero.filmId, ["hero", "filmId"]);
    checkRef(doc.mentor.filmId, ["mentor", "filmId"]);
    doc.home.filmIds.forEach((f, i) => checkRef(f, ["home", "filmIds", i]));
    doc.pillars.items.forEach((p, i) => checkRef(p.filmId, ["pillars", "items", i, "filmId"]));
    doc.programmes.items.forEach((p, i) => checkRef(p.filmId, ["programmes", "items", i, "filmId"]));
    doc.voices.items.forEach((v, i) => checkRef(v.filmId, ["voices", "items", i, "filmId"]));
    const ids = new Set<string>();
    doc.programmes.items.forEach((p, i) => {
      if (ids.has(p.id)) ctx.addIssue({ code: "custom", path: ["programmes", "items", i, "id"], message: `Two programmes share the id "${p.id}".` });
      ids.add(p.id);
    });
  });

export type Mentorship = z.infer<typeof mentorshipSchema>;
export type Film = z.infer<typeof filmSchema>;
export type Pillar = z.infer<typeof pillarSchema>;
export type Programme = z.infer<typeof programmeSchema>;
export type FilmKind = (typeof filmKinds)[number];

/** A readable "where" for the first validation problem, e.g. "Programmes › item 2 › price". */
export function describeIssue(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Something in the form isn't valid.";
  const where = issue.path
    .map((p) => (typeof p === "number" ? `item ${p + 1}` : String(p).replace(/([A-Z])/g, " $1").toLowerCase()))
    .join(" › ");
  return where ? `${where}: ${issue.message}` : issue.message;
}
