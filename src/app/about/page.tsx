import type { Metadata } from "next";
import { BrandNote, Manifesto, Values } from "@/components/about/about-sections";
import { FinalCta } from "@/components/home/final-cta";
import { WhyUs } from "@/components/home/why-us";
import { PageHero } from "@/components/layout/page-hero";
import { PageTransition } from "@/components/layout/page-transition";
import { CinemaVideo } from "@/components/video/cinema-video";
import { getVideo, videos } from "@/lib/videos";

export const metadata: Metadata = {
  title: "Our secret",
  description: "Why My Sweet Kitty exists: natural, private and beautifully simple rituals for every woman, with a recipe we keep to ourselves.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <PageHero
        index="05"
        label="About"
        title="Our little"
        accent="secret."
        intro="Natural rituals, a recipe we never share, and one belief: every woman deserves to feel irresistible again."
      />
      <Manifesto />
      <CinemaVideo
        video={getVideo("glow")}
        playlist={videos}
        words={["Pure", "magic."]}
        captions={[
          { kicker: "Made with", text: "Natural ingredients, chosen with care." },
          { kicker: "Kept as", text: "Our secret recipe. Always." },
        ]}
      />
      <Values />
      <WhyUs />
      <div className="py-12 lg:py-16">
        <BrandNote />
      </div>
      <FinalCta />
    </PageTransition>
  );
}
