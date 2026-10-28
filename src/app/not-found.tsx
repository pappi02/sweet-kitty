import Image from "next/image";
import { Aurora, Sparkles } from "@/components/ui/decor";
import { ArrowLink } from "@/components/ui/section-heading";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export default function NotFound() {
  return (
    <main className="grain tone-light relative isolate flex min-h-svh items-center overflow-hidden bg-sky-light pb-10 pt-28 text-white">
      <Aurora intensity="soft" />
      <Sparkles count={18} seed={404} className="opacity-70" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-7 px-5 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div className="text-center lg:text-left">
          <p className="font-display text-lg italic text-pink">N°404</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,9vw,5rem)] leading-[0.92]">
            This kitty <span className="text-gradient-pink italic">wandered off.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm sm:text-[15px] text-white/80 lg:mx-0">The page you&apos;re looking for isn&apos;t here. Let&apos;s get you back to your glow-up.</p>
          <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row lg:justify-start">
            <ShimmerButton href="/" size="lg">
              Back home
            </ShimmerButton>
            <ArrowLink href="/shop">Shop the collection</ArrowLink>
          </div>
        </div>
        <div className="mx-auto w-40 lg:w-64">
          <Image src="/brand/my-sweet-kitty-512.png" alt="" width={510} height={512} className="h-auto w-full animate-float -rotate-6" />
        </div>
      </div>
    </main>
  );
}
