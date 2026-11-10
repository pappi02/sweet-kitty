// Promotional posters (pop-ups), edited at /admin/posters. Same design as the
// Executive Hideaway posters: an image that pops up a few seconds after a visitor
// arrives, and an offer section (top of /shop) that tapping it opens.
import { z } from "zod";
import { isSafeMediaUrl } from "../mentorship/schema";

export const POSTER_KINDS = ["offer", "event", "announcement"] as const;
export type PosterKind = (typeof POSTER_KINDS)[number];
export const POSTER_KIND_LABELS: Record<PosterKind, string> = { offer: "Special offer", event: "Event", announcement: "Announcement" };

/** How long a poster stays on screen before it closes itself. */
export const DISPLAY_SECONDS = { min: 5, max: 15 } as const;
export const DELAY_SECONDS_MAX = 120;
export const TIMES_PER_DAY_MAX = 10;

/** The booking button: a page on this site, an https:// address or tel:. Empty = the shop. */
export function isSafeCta(value: string) {
  if (value === "") return true;
  if (/^tel:\+?[\d\s-]{6,20}$/.test(value)) return true;
  if (value.startsWith("/")) return !value.startsWith("//") && !value.includes("\\");
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const text = (max: number) => z.string().trim().max(max);
const isoDate = z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Choose a valid date and time.");

export const posterSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]{1,40}$/),
    title: text(120).min(1, "Every poster needs a title."),
    image: z.string().trim().max(600).min(1, "Upload the poster image.").refine(isSafeMediaUrl, "The image must be uploaded here."),
    kind: z.enum(POSTER_KINDS),
    summary: text(300),
    highlights: z.array(text(120)).max(12),
    details: text(4000),
    priceText: text(80),
    ctaLabel: text(40),
    ctaUrl: text(500).refine(isSafeCta, "The button link must start with / (a page here), https:// or tel:+254…"),
    terms: text(1000),
    startsAt: isoDate,
    endsAt: isoDate,
    delaySeconds: z.number().int().min(0).max(DELAY_SECONDS_MAX),
    displaySeconds: z.number().int().min(DISPLAY_SECONDS.min).max(DISPLAY_SECONDS.max),
    timesPerDay: z.number().int().min(1).max(TIMES_PER_DAY_MAX),
    priority: z.number().int().min(-100).max(100),
    active: z.boolean(),
  })
  .refine((p) => Date.parse(p.endsAt) > Date.parse(p.startsAt), { message: "The end must be after the start.", path: ["endsAt"] });

export const postersSchema = z
  .object({ posters: z.array(posterSchema).max(30) })
  .superRefine((doc, ctx) => {
    const ids = new Set<string>();
    doc.posters.forEach((p, i) => {
      if (ids.has(p.id)) ctx.addIssue({ code: "custom", path: ["posters", i, "id"], message: "Two posters share an id." });
      ids.add(p.id);
    });
  });

export type Poster = z.infer<typeof posterSchema>;
export type PostersDoc = z.infer<typeof postersSchema>;

export type PosterStatus = "live" | "scheduled" | "ended" | "paused";

export function posterStatus(p: Pick<Poster, "active" | "startsAt" | "endsAt">, now = Date.now()): PosterStatus {
  if (now >= Date.parse(p.endsAt)) return "ended";
  if (!p.active) return "paused";
  return now < Date.parse(p.startsAt) ? "scheduled" : "live";
}

export const posterAnchor = (id: string) => `offer-${id}`;
export const posterDetailsUrl = (id: string) => `/shop#${posterAnchor(id)}`;

/** What the pop-up needs. */
export type PublicPoster = Pick<Poster, "id" | "title" | "image" | "delaySeconds" | "displaySeconds" | "timesPerDay" | "endsAt"> & { detailsUrl: string };

/** Running now, highest priority first. */
export function livePosters(doc: PostersDoc, now = Date.now()) {
  return doc.posters
    .filter((p) => posterStatus(p, now) === "live")
    .sort((a, b) => b.priority - a.priority || Date.parse(b.startsAt) - Date.parse(a.startsAt));
}

export function toPublicPoster(p: Poster): PublicPoster {
  return { id: p.id, title: p.title, image: p.image, delaySeconds: p.delaySeconds, displaySeconds: p.displaySeconds, timesPerDay: p.timesPerDay, endsAt: p.endsAt, detailsUrl: posterDetailsUrl(p.id) };
}
