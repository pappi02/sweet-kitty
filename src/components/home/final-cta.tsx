"use client";

import Image from "next/image";
import { whatsappLink } from "@/lib/site";
import { Aurora, Sparkles } from "../ui/decor";
import { WhatsAppIcon } from "../ui/icons";
import { Reveal, WordReveal } from "../ui/reveal";
import { ShimmerButton } from "../ui/shimmer-button";

export function FinalCta({ href = "/the-kit", label = "Get the 7-Day Kit" }: { href?: string; label?: string }) {
  return (
    <section className="px-3 pb-6 sm:px-5">
      <div className="grain relative isolate mx-auto max-w-6xl overflow-hidden rounded-4xl bg-linear-to-br from-pink-deep via-[#ff6fbf] to-[#c4006e] px-6 py-10 text-white sm:px-12 lg:py-14">
        <Aurora intensity="soft" />
        <Sparkles count={18} seed={55} />
        <div className="relative grid items-center gap-8 text-center lg:grid-cols-[1fr_auto] lg:text-left">
          <div>
            <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.8rem,6vw,3rem)] leading-[1.04] lg:mx-0">
              <WordReveal text="Your main-character era is" /> <span className="italic text-[#ffd9ee]">7 days away.</span>
            </h2>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-4 max-w-md text-sm sm:text-[15px] text-white/82 lg:mx-0">Don&apos;t be the last one in your circle to find out. Your glow-up starts today.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <ShimmerButton href={href} variant="light" size="lg">
                  {label}
                </ShimmerButton>
                <ShimmerButton href={whatsappLink("Hi Sweet Kitty! I'm ready for my glow-up 💗")} target="_blank" rel="noopener noreferrer" variant="ghost" size="lg">
                  <WhatsAppIcon className="size-4" /> Chat with us
                </ShimmerButton>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.05} className="mx-auto w-24 lg:w-40">
            <Image src="/brand/my-sweet-kitty-512.png" alt="" width={510} height={512} className="h-auto w-full animate-float drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
