"use client";

import { useCallback, useRef } from "react";
import { toVideo, type PublicFilm } from "@/lib/mentorship/view";
import { cn } from "@/lib/utils";
import { Star4 } from "../ui/decor";
import { PlayIcon } from "../ui/icons";
import { useAutoplay } from "../video/use-autoplay";
import { useVideoLightbox } from "../video/video-lightbox";

/** Opens a film full screen with sound, followed by the other playable films. */
export function usePlayFilm(playable: PublicFilm[]) {
  const { open } = useVideoLightbox();
  return useCallback(
    (film: PublicFilm | null | undefined) => {
      if (!film?.src) return;
      const list = playable.some((f) => f.id === film.id) ? playable : [film, ...playable];
      open(list.map(toVideo), list.findIndex((f) => f.id === film.id));
    },
    [open, playable],
  );
}

/**
 * The picture inside a film card. With a video: a silent loop that only plays while
 * on screen. Without one yet: a designed "film coming soon" frame, so the layout is
 * already final and uploading a video in the admin simply fills it.
 */
export function FilmFrame({ film, className, quiet = false }: { film: PublicFilm | null | undefined; className?: string; quiet?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useAutoplay(ref, { enabled: Boolean(film?.src) });

  if (film?.src) {
    return (
      <video
        ref={ref}
        src={film.src}
        poster={film.poster || undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  if (film?.poster) {
    // eslint-disable-next-line @next/next/no-img-element -- uploaded posters may live on Blob or /uploads
    return <img src={film.poster} alt="" className={cn("h-full w-full object-cover", className)} />;
  }

  return <FilmPlaceholder title={film?.title} quiet={quiet} className={className} />;
}

export function FilmPlaceholder({ title, className, quiet = false }: { title?: string; className?: string; quiet?: boolean }) {
  return (
    <div className={cn("tone-dark relative isolate flex h-full w-full flex-col items-center justify-center overflow-hidden bg-ink text-center text-white", className)} aria-hidden>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_20%_10%,rgba(157,8,66,0.75),transparent_60%),radial-gradient(90%_70%_at_85%_90%,rgba(253,205,231,0.28),transparent_65%),linear-gradient(160deg,#59162b,#330412_70%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.18] mix-blend-overlay [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.4)_0px,transparent_1px,transparent_3px)]" />
      <div className="absolute inset-3 -z-10 rounded-[inherit] border border-white/10" />
      <Star4 className="size-5 text-rose/80" />
      {!quiet && (
        <>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.24em] text-rose/80">Film coming soon</p>
          {title && <p className="mt-2 max-w-[85%] font-display text-lg italic leading-tight text-white/90">{title}</p>}
        </>
      )}
    </div>
  );
}

/** Round play button used on film cards. */
export function PlayBadge({ ready, className, label = "Watch" }: { ready: boolean; className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full pl-1 pr-3.5 text-xs font-semibold ring-1 backdrop-blur-md transition-colors duration-300",
        ready ? "bg-white/15 text-white ring-white/30 group-hover:bg-burgundy group-hover:ring-accent" : "bg-white/10 text-white/75 ring-white/15",
        className,
      )}
    >
      <span className={cn("grid size-7 place-items-center rounded-full", ready ? "bg-white text-burgundy" : "bg-white/20 text-white/80")}>
        <PlayIcon className="ml-0.5 size-3.5" />
      </span>
      {ready ? label : "Coming soon"}
    </span>
  );
}
