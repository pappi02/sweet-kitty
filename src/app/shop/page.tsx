import type { Metadata } from "next";
import { Suspense } from "react";
import { PosterOffers } from "@/components/posters/poster-offers";
import { FinalCta } from "@/components/home/final-cta";
import { PageHero } from "@/components/layout/page-hero";
import { PageTransition } from "@/components/layout/page-transition";
import { Collection } from "@/components/shop/collection";
import { ArrowLink, SectionHeading } from "@/components/ui/section-heading";
import { ReelRail } from "@/components/video/reel-rail";
import { activeProducts } from "@/lib/products";
import { videos } from "@/lib/videos";

export const metadata: Metadata = {
  title: "Shop the collection",
  description: "Natural, secret-recipe rituals: the 7-Day Sweet Kitty Kit, Kitty Magic Juice, Kitty Magic Scrub, Kitty Oil, Sweet Kitty Candies, Kitty Love Bath and more.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <PageTransition>
      <PageHero
        index="01"
        label="Shop"
        title="The"
        accent="collection."
        intro={
          <>
            {activeProducts.length} natural rituals, one secret recipe. Each works beautifully on its own. Together, in the 7-Day Kit, they work wonders.
          </>
        }
      />
      {/* Live posters ("Special offers"): request-time, so it streams in without holding the page. */}
      <Suspense fallback={null}>
        <PosterOffers />
      </Suspense>
      <Collection />
      <section className="bg-white/50 py-9 lg:py-12">
        <ReelRail
          list={videos.filter((v) => v.tag !== "Before")}
          heading={<SectionHeading eyebrow="In motion" title="See the ritual" accent="come alive." />}
          aside={<ArrowLink href="/ritual">How the ritual works</ArrowLink>}
        />
      </section>
      <FinalCta />
    </PageTransition>
  );
}
