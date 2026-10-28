import type { Metadata } from "next";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { KitSpotlight } from "@/components/home/kit-spotlight";
import { Reviews } from "@/components/home/reviews";
import { Ritual } from "@/components/home/ritual";
import { Shop } from "@/components/home/shop";
import { Story } from "@/components/home/story";
import { WhyUs } from "@/components/home/why-us";
import { PageTransition } from "@/components/layout/page-transition";
import { Star4 } from "@/components/ui/decor";
import { Marquee } from "@/components/ui/marquee";
import { ArrowLink, SectionHeading } from "@/components/ui/section-heading";
import { CinemaVideo } from "@/components/video/cinema-video";
import { ReelRail } from "@/components/video/reel-rail";
import { dramas, getVideo, videos } from "@/lib/videos";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const benefits = ["Confidence", "Natural glow", "Energy", "Self-love", "Feminine power", "Freshness", "Good fortune"];

function Ribbons() {
  return (
    <div className="relative z-10 -my-6 overflow-hidden py-8">
      <div className="tone-dark -rotate-2 bg-pink py-3.5 shadow-[0_10px_40px_-10px_rgba(255,0,144,0.7)]">
        <Marquee duration={30} fade={false}>
          {benefits.map((b) => (
            <span key={b} className="flex items-center gap-5 px-5 text-sm font-bold uppercase tracking-[0.2em] text-white">
              {b}
              <Star4 className="size-3 text-white/80" />
            </span>
          ))}
        </Marquee>
      </div>
      <div className="tone-light absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 rotate-2 bg-sky py-3.5">
        <Marquee duration={34} reverse fade={false}>
          {benefits.map((b) => (
            <span key={b} className="flex items-center gap-5 px-5 font-display text-sm italic text-white/75">
              {b}
              <Star4 className="size-3 text-pink" />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Ribbons />
      <Story />
      <KitSpotlight />
      <Shop />
      <CinemaVideo
        video={getVideo("after")}
        playlist={videos}
        words={["Seven", "days."]}
        captions={[
          { kicker: "Day one", text: "Tired, heavy and running on empty." },
          { kicker: "Day seven", text: "Glowing, booked and unstoppable." },
        ]}
      />
      <Ritual />
      <section className="py-12 lg:py-16">
        <ReelRail
          list={dramas}
          heading={<SectionHeading eyebrow="Kitty dramas · tap for sound" title="Girl, you" accent="need to see this." />}
          aside={<ArrowLink href="/stories">All stories & videos</ArrowLink>}
        />
      </section>
      <WhyUs />
      <section className="py-12 lg:py-16">
        <ReelRail
          list={videos}
          heading={<SectionHeading eyebrow="Glow reels" title="Watch her" accent="glow up." />}
          aside={<ArrowLink href="/stories">All stories & videos</ArrowLink>}
        />
      </section>
      <Reviews />
      <Faq />
      <FinalCta />
    </PageTransition>
  );
}
