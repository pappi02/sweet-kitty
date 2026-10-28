import type { Metadata } from "next";
import { FaqBrowser } from "@/components/faq/faq-browser";
import { PageHero } from "@/components/layout/page-hero";
import { PageTransition } from "@/components/layout/page-transition";
import { JsonLd } from "@/components/seo/json-ld";
import { allFaqs } from "@/lib/content";
import { faqLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Questions & answers",
  description: "Ordering, delivery, products and safety: everything you want to know about My Sweet Kitty.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <PageTransition>
      <JsonLd data={faqLd(allFaqs)} />
      <PageHero
        index="06"
        label="FAQ"
        title="Ask us"
        accent="anything."
        intro="Ordering, delivery, the products and your safety. If your question isn't here, we answer personally on WhatsApp."
      />
      <FaqBrowser />
    </PageTransition>
  );
}
