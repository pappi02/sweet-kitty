"use client";

import { useRef } from "react";
import { videoSrc, type Video } from "@/lib/videos";
import { cn } from "@/lib/utils";
import { PlayIcon } from "../ui/icons";
import { useAutoplay } from "./use-autoplay";

/** Vertical reel. Plays silently in view; tapping opens the full-screen player with sound. */
export function ReelCard({ video, index, onOpen, className }: { video: Video; index: number; onOpen: () => void; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useAutoplay(ref, { threshold: 0.6 });

  return (
    <button
      onClick={onOpen}
      className={cn("tone-dark group relative isolate block aspect-9/16 w-full overflow-hidden rounded-[1.1rem] bg-ink text-left outline-none ring-pink/50 focus-visible:ring-2", className)}
      aria-label={`Watch: ${video.title}`}
    >
      <video
        ref={ref}
        src={videoSrc(video)}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
      />
      <span className="absolute inset-0 -z-10 bg-linear-to-b from-ink/50 via-transparent to-ink/85" />

      <span className="absolute inset-x-3 top-3 flex items-center justify-between">
        <span className="font-display text-xs italic text-white/90">N°{String(index + 1).padStart(2, "0")}</span>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-white ring-1 ring-white/25 backdrop-blur-md">
          {video.tag}
        </span>
      </span>

      <span className="absolute inset-x-3 bottom-3 block">
        <span className="block font-display text-[15px] italic leading-tight text-white sm:text-base">{video.title}</span>
        <span className="mt-0.5 line-clamp-2 hidden text-[11px] leading-snug text-white/75 sm:block">{video.caption}</span>
        <span className="mt-2 inline-flex h-7 items-center gap-1.5 rounded-full bg-white/15 pl-0.5 pr-2.5 text-[10px] font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition-colors duration-300 group-hover:bg-pink group-hover:ring-pink">
          <span className="grid size-6 place-items-center rounded-full bg-white text-pink-deep">
            <PlayIcon className="ml-0.5 size-3" />
          </span>
          Watch
        </span>
      </span>
    </button>
  );
}
