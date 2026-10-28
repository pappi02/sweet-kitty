"use client";

import { useRef } from "react";
import { videoSrc, type Video } from "@/lib/videos";
import { cn } from "@/lib/utils";
import { useAutoplay } from "./use-autoplay";

/** Silent looping video that fills its box. Plays only while visible. */
export function AmbientVideo({ video, className }: { video: Video; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useAutoplay(ref);
  return (
    <video
      ref={ref}
      src={videoSrc(video)}
      poster={video.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
