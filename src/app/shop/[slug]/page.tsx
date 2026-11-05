import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductDetail } from "@/components/shop/product-detail";
import { getProductBySlug, kit, singles } from "@/lib/products";
import { breadcrumbLd, productLd } from "@/lib/seo";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return singles.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const description = `${product.tagline} ${product.description}`;
  const url = `/shop/${product.slug}`;
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description: product.tagline,
      url,
      siteName: site.name,
      locale: "en_KE",
      type: "website",
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
  };
}

async function ProductContent({ params }: { params: PageProps<"/shop/[slug]">["params"] }) {
  const { slug } = await params;
  if (slug === kit.slug) permanentRedirect("/the-kit");
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const trail = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: product.name, path: `/shop/${product.slug}` },
  ];
  return (
    <>
      <JsonLd data={[productLd(product), breadcrumbLd(trail)]} />
      <ProductDetail product={product} />
    </>
  );
}

/** Shown for a moment while the product loads: same layout, soft placeholders. */
function ProductSkeleton() {
  return (
    <section className="pb-10 pt-28 sm:pt-32 lg:pt-36" aria-busy>
      <div className="mx-auto grid max-w-6xl gap-7 px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8">
        <div className="aspect-4/5 animate-pulse rounded-sm bg-blush" />
        <div className="space-y-5 pt-6">
          <div className="h-3 w-28 rounded-full bg-blush" />
          <div className="h-14 w-4/5 rounded-sm bg-blush" />
          <div className="h-5 w-2/3 rounded-full bg-blush/70" />
          <div className="h-24 w-full rounded-sm bg-blush/50" />
          <div className="h-14 w-full rounded-full bg-blush" />
        </div>
      </div>
    </section>
  );
}

export default function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  return (
    <PageTransition>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </PageTransition>
  );
}
