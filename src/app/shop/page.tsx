import type { Metadata } from "next";
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
  description: "Natural, secret-recipe rituals: the 7-Day Sweet Kitty Kit, Sweet Kitty Tight, Slippery Kitty, Magic Juice and Magic Bath.",
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
      <Collection />
      <section className="bg-white/50 py-12 lg:py-16">
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
