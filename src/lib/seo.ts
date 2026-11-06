// Structured data (JSON-LD) helpers. Search engines and AI assistants read these
// to understand the shop, its products and its pages.
import { type Faq } from "./content";
import { productHref, type Product } from "./products";
import { site } from "./site";

export const siteUrl = `https://${site.domain}`;
export const absUrl = (path: string) => new URL(path, siteUrl).toString();

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    url: siteUrl,
    logo: absUrl("/icons/icon-512.png"),
    slogan: site.tagline,
    ...(site.business.legalName && { legalName: site.business.legalName }),
    sameAs: site.socials.map((s) => s.url).filter(Boolean),
    areaServed: { "@type": "Country", name: "Kenya" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${site.whatsapp}`,
      email: site.email,
      areaServed: "KE",
      availableLanguage: ["English", "Swahili"],
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.name,
    url: siteUrl,
    inLanguage: "en-KE",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function productLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absUrl(productHref(p))}#product`,
    name: p.name,
    description: `${p.tagline} ${p.description}`,
    image: p.image ? [absUrl(p.image)] : undefined,
    sku: p.id,
    brand: { "@type": "Brand", name: site.name },
    url: absUrl(productHref(p)),
    ...(p.price != null && {
      offers: {
        "@type": "Offer",
        url: absUrl(productHref(p)),
        priceCurrency: "KES",
        price: p.price,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": `${siteUrl}/#organization` },
      },
    }),
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: absUrl(t.path) })),
  };
}

export function faqLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
