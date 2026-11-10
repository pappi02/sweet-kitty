import Image from "next/image";

import { ArrowLink } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="tone-light relative isolate flex min-h-svh items-center overflow-hidden bg-blush pb-10 pt-24 text-white">
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-7 px-5 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div className="text-center lg:text-left">
          <p className="font-display text-lg italic text-accent">N°404</p>
          <h1 className="mt-4 font-display text-[clamp(2.16rem,7.65vw,4.2rem)] leading-[0.92]">
            This kitty <span className="text-accent italic">wandered off.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-white/80 lg:mx-0">The page you&apos;re looking for isn&apos;t here. Let&apos;s get you back to your glow-up.</p>
          <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row lg:justify-start">
            <Button href="/" size="lg">
              Back home
            </Button>
            <ArrowLink href="/shop">Shop the collection</ArrowLink>
          </div>
        </div>
        <div className="mx-auto w-40 lg:w-64">
          <Image src="/brand/my-sweet-kitty-512.png" alt="" width={510} height={512} className="h-auto w-full -rotate-6" />
        </div>
      </div>
    </main>
  );
}
