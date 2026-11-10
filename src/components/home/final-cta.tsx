"use client";

import Image from "next/image";
import { whatsappLink } from "@/lib/site";
import { Button } from "../ui/button";
import { WhatsAppIcon } from "../ui/icons";
import { Reveal, WordReveal } from "../ui/reveal";

export function FinalCta({ href = "/the-kit", label = "Get the 7-Day Kit" }: { href?: string; label?: string }) {
  return (
    <section className="bg-rose tone-light text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-11 text-center lg:grid-cols-[1fr_auto] lg:px-8 lg:py-14 lg:text-left">
        <div>
          <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.89rem,5.44vw,3.02rem)] leading-[1.02] lg:mx-0">
            <WordReveal text="Your main-character era is" /> <span className="italic text-accent">7 days away.</span>
          </h2>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-md text-base text-white/80 lg:mx-0">Your glow-up starts with one message. We&apos;ll take care of the rest.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button href={href} size="lg">
                {label}
              </Button>
              <Button href={whatsappLink("Hi Sweet Kitty! I'm ready for my glow-up 💗")} target="_blank" rel="noopener noreferrer" variant="ghost" size="lg">
                <WhatsAppIcon className="size-4" /> Chat with us
              </Button>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.05} className="mx-auto w-36 lg:w-56">
          <Image src="/brand/my-sweet-kitty-512.png" alt="" width={510} height={512} className="h-auto w-full" />
        </Reveal>
      </div>
    </section>
  );
}
