import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { MentorshipExperience } from "@/components/mentorship/sections";
import { JsonLd } from "@/components/seo/json-ld";
import { getMentorship } from "@/lib/mentorship/data";
import { toMentorshipView } from "@/lib/mentorship/view";
import { isDarajaReady } from "@/lib/payments/daraja";
import { absUrl, breadcrumbLd, faqLd, siteUrl } from "@/lib/seo";

// Everything on this page comes from the mentorship document, edited at
// /admin/mentorship. It is cached and rebuilt only when the admin saves.

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getMentorship();
  return {
    title: doc.seo.title,
    description: doc.seo.description,
    alternates: { canonical: "/mentorship" },
    openGraph: { title: doc.seo.title, description: doc.seo.description, url: "/mentorship" },
  };
}

export default async function MentorshipPage() {
  const doc = await getMentorship();
  const view = toMentorshipView(doc, isDarajaReady());

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: doc.seo.title,
    description: doc.seo.description,
    url: absUrl("/mentorship"),
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: "Worldwide",
    offers: doc.programmes.items
      .filter((p) => p.price)
      .map((p) => ({ "@type": "Offer", name: `${p.name} (${p.ages})`, price: p.price, priceCurrency: "KES" })),
  };

  return (
    <PageTransition>
      <JsonLd
        data={[
          service,
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Mentorship", path: "/mentorship" },
          ]),
          ...(doc.faq.items.length ? [faqLd(doc.faq.items)] : []),
        ]}
      />
      <MentorshipExperience view={view} />
    </PageTransition>
  );
}
