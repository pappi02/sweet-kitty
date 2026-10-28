"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Aurora, Sparkles } from "@/components/ui/decor";
import { ArrowLink } from "@/components/ui/section-heading";
import { ShimmerButton } from "@/components/ui/shimmer-button";

/** Shown when a page crashes. Header and footer stay, so customers can carry on. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <main className="grain tone-light relative isolate flex min-h-svh items-center overflow-hidden bg-sky-light pb-10 pt-28 text-white">
      <Aurora intensity="soft" />
      <Sparkles count={14} seed={500} className="opacity-70" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-7 px-5 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div className="text-center lg:text-left">
          <p className="font-display text-lg italic text-pink">Oops</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,9vw,5rem)] leading-[0.92]">
            Something <span className="text-gradient-pink italic">slipped.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/80 sm:text-[15px] lg:mx-0">
            This page didn&apos;t load properly. Your bag is safe. Try again, or carry on shopping.
          </p>
          <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row lg:justify-start">
            <ShimmerButton onClick={() => retry()} size="lg">
              Try again
            </ShimmerButton>
            <ArrowLink href="/">Back home</ArrowLink>
          </div>
          {digest && <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-white/45">Ref {digest}</p>}
        </div>
        <div className="mx-auto w-40 lg:w-64">
          <Image src="/brand/my-sweet-kitty-512.png" alt="" width={510} height={512} className="h-auto w-full rotate-6 animate-float" />
        </div>
      </div>
    </main>
  );
}
