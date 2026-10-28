import type { Metadata } from "next";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { Ritual } from "@/components/home/ritual";
import { InsideTheBox, KitCompare, KitHero, KitPromise } from "@/components/kit/kit-sections";
import { PageTransition } from "@/components/layout/page-transition";
import { JsonLd } from "@/components/seo/json-ld";
import { faqGroups } from "@/lib/content";
import { kit } from "@/lib/products";
import { breadcrumbLd, productLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The 7-Day Sweet Kitty Kit",
  description: "The complete glow-up ritual: Sweet Kitty Tight, Slippery Kitty, Magic Juice and Magic Bath with a guided 7-day ritual. KSh 10,000.",
  alternates: { canonical: "/the-kit" },
  openGraph: {
    title: "The 7-Day Sweet Kitty Kit",
    description: kit.tagline,
    url: "/the-kit",
    siteName: site.name,
    locale: "en_KE",
    type: "website",
    images: kit.image ? [{ url: kit.image, alt: kit.name }] : undefined,
  },
};

const kitFaqs = [...faqGroups.find((g) => g.id === "products")!.items, ...faqGroups.find((g) => g.id === "ordering")!.items].slice(0, 5);

export default function KitPage() {
  return (
    <PageTransition>
      <JsonLd data={[productLd(kit), breadcrumbLd([{ name: "Home", path: "/" }, { name: "The 7-Day Kit", path: "/the-kit" }])]} />
      <KitHero />
      <InsideTheBox />
      <KitPromise />
      <Ritual guideLink />
      <KitCompare />
      <Faq items={kitFaqs} title="Before you" accent="glow." />
      <FinalCta href="/shop" label="Shop the collection" />
    </PageTransition>
  );
}
