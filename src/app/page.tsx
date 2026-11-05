import type { Metadata } from "next";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowToOrder } from "@/components/home/how-to-order";
import { KitSpotlight } from "@/components/home/kit-spotlight";
import { Ritual } from "@/components/home/ritual";
import { Shop } from "@/components/home/shop";
import { Story } from "@/components/home/story";
import { TrustStrip } from "@/components/home/trust-strip";
import { PageTransition } from "@/components/layout/page-transition";
import { ArrowLink, SectionHeading } from "@/components/ui/section-heading";
import { ReelRail } from "@/components/video/reel-rail";
import { getVideo } from "@/lib/videos";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const featured = ["film-scrub", "film-oil", "film-bath", "after", "kit", "drama-who-is-she"].map(getVideo);

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <TrustStrip />
      <KitSpotlight />
      <Shop />
      <Ritual />
      <Story />
      <section className="py-16 lg:py-24">
        <ReelRail
          list={featured}
          heading={<SectionHeading eyebrow="Stories" title="See the" accent="glow." />}
          aside={<ArrowLink href="/stories">All stories & videos</ArrowLink>}
        />
      </section>
      <HowToOrder />
      <Faq />
      <FinalCta />
    </PageTransition>
  );
}
