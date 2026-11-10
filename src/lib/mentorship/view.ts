// Turns the stored mentorship document into what the public pages need: films
// resolved by id, admin-only notes (production briefs) left out of the browser.
import type { Video } from "../videos";
import { filmKindLabels, type Film, type Mentorship } from "./schema";

export type PublicFilm = {
  id: string;
  title: string;
  caption: string;
  kind: Film["kind"];
  label: string;
  src: string;
  poster: string;
};

export function toPublicFilm(f: Film): PublicFilm {
  return { id: f.id, title: f.title, caption: f.caption, kind: f.kind, label: filmKindLabels[f.kind], src: f.src, poster: f.poster };
}

const FALLBACK_POSTER = "/brand/my-sweet-kitty-512.png";

/** For the site's full-screen player. Only films with a video file can play. */
export function toVideo(f: PublicFilm): Video {
  // The player only prints the tag as a label, so the film's own label ("Mentor talk"…) is used.
  return { id: `m-${f.id}`, src: f.src, poster: f.poster || FALLBACK_POSTER, title: f.title, caption: f.caption, tag: f.label as Video["tag"] };
}

export type MentorshipView = ReturnType<typeof toMentorshipView>;

export function toMentorshipView(doc: Mentorship, payEnabled: boolean) {
  const films = doc.films.map(toPublicFilm);
  const film = (id: string) => (id ? films.find((f) => f.id === id) ?? null : null);
  return {
    manifesto: doc.manifesto,
    steps: doc.steps,
    faq: doc.faq,
    booking: doc.booking,
    closing: doc.closing,
    disclaimer: doc.disclaimer,
    hero: { ...doc.hero, film: film(doc.hero.filmId) },
    home: { ...doc.home, films: doc.home.filmIds.map(film).filter((f): f is PublicFilm => f !== null) },
    gallery: { ...doc.gallery, films: doc.films.filter((f) => f.inGallery).map(toPublicFilm) },
    pillars: { ...doc.pillars, items: doc.pillars.items.map((p) => ({ ...p, film: film(p.filmId) })) },
    programmes: { ...doc.programmes, items: doc.programmes.items.map((p) => ({ ...p, film: film(p.filmId) })) },
    mentor: { ...doc.mentor, film: film(doc.mentor.filmId) },
    voices: { ...doc.voices, items: doc.voices.items.map((v) => ({ ...v, film: film(v.filmId) })) },
    /** Every film that can actually play, in order, for the full-screen player's playlist. */
    playable: films.filter((f) => f.src),
    payEnabled: payEnabled && doc.booking.mode === "pay",
  };
}

export type ProgrammeView = MentorshipView["programmes"]["items"][number];
