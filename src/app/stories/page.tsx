import type { Metadata } from "next";
import { Reviews } from "@/components/home/reviews";
import { Story } from "@/components/home/story";
import { PageHero } from "@/components/layout/page-hero";
import { PageTransition } from "@/components/layout/page-transition";
import { ReelGallery } from "@/components/stories/reel-gallery";
import { Eyebrow, Sparkles } from "@/components/ui/decor";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal, WordReveal } from "@/components/ui/reveal";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { CompareVideos } from "@/components/video/compare-videos";
import { whatsappLink } from "@/lib/site";
import { videos } from "@/lib/videos";

export const metadata: Metadata = {
  title: "Stories & videos",
  description: "Watch the My Sweet Kitty glow-up: before and after, the morning ritual and real glow stories.",
  alternates: { canonical: "/stories" },
};

export default function StoriesPage() {
  return (
    <PageTransition>
      <PageHero
        index="04"
        label="Stories"
        title="Her story,"
        accent="in motion."
        intro={
          <>
            {videos.length} reels and counting. Watch the before, the ritual and the glow, then tap any video to watch it full screen with sound.
          </>
        }
      />

      {/* Featured: before / after */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:px-8">
          <Reveal className="order-2 lg:order-1">
            <CompareVideos className="mx-auto aspect-4/5 w-full max-w-[320px] rounded-[1.5rem] lg:max-w-[370px]" />
          </Reveal>
          <div className="order-1 lg:order-2">
            <Reveal>
              <Eyebrow>Featured</Eyebrow>
            </Reveal>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,6.4vw,2.85rem)] leading-[1.04]">
              <WordReveal text="Her whole week," /> <span className="text-gradient-pink italic">in one slide.</span>
            </h2>
            <Reveal delay={0.05}>
              <p className="mt-4 max-w-md text-sm sm:text-[15px] leading-relaxed text-ink/72">
                On the left, the woman who felt invisible. On the right, the one who walks into a room and owns it. Drag the line and watch the difference seven mornings make.
              </p>
              <dl className="mt-6 grid grid-cols-2 border-t border-ink/10">
                <div className="py-3.5 pr-4">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/55">Before</dt>
                  <dd className="mt-1 font-display text-xl italic">Running on empty</dd>
                </div>
                <div className="border-l border-ink/10 py-3.5 pl-5">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-deep">After</dt>
                  <dd className="mt-1 font-display text-xl italic">Main-character energy</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bg-white/50">
        <ReelGallery />
      </div>

      <Story />

      {/* Send us your video */}
      <section className="px-3 pt-6 sm:px-5">
        <Reveal className="grain tone-light relative isolate mx-auto max-w-6xl overflow-hidden rounded-4xl bg-sky px-6 py-10 text-center text-white sm:px-12 lg:py-14">
          <Sparkles count={16} seed={88} className="opacity-70" />
          <p className="relative font-display text-sm italic text-pink-deep">Your turn</p>
          <h2 className="relative mx-auto mt-3 max-w-3xl font-display text-[clamp(1.75rem,5vw,2.9rem)] leading-[1.04]">
            Your glow-up could be <span className="text-gradient-pink italic">next on this wall.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-sm sm:text-[15px] text-white/80">
            Film your day one and your day seven, send them to us on WhatsApp, and we may feature you here.
          </p>
          <div className="relative mt-6 flex justify-center">
            <ShimmerButton size="lg" href={whatsappLink("Hi Sweet Kitty! I'd love to send you my glow-up video 💗")} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" /> Send us your video
            </ShimmerButton>
          </div>
        </Reveal>
      </section>

      <Reviews />
    </PageTransition>
  );
}
