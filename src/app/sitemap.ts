import type { MetadataRoute } from "next";
import { legalPages } from "@/lib/legal";
import { singles } from "@/lib/products";
import { absUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const main = [
    { path: "/", priority: 1 },
    { path: "/the-kit", priority: 0.95 },
    { path: "/shop", priority: 0.9 },
    { path: "/ritual", priority: 0.7 },
    { path: "/stories", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/faq", priority: 0.6 },
    { path: "/contact", priority: 0.5 },
  ];
  return [
    ...main.map((p) => ({ url: absUrl(p.path), changeFrequency: "weekly" as const, priority: p.priority })),
    ...singles.map((p) => ({ url: absUrl(`/shop/${p.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...legalPages.map((p) => ({ url: absUrl(`/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
