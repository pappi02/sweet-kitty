import type { Metadata } from "next";
import Link from "next/link";
import { legalPages, type LegalPage } from "@/lib/legal";
import { breadcrumbLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";
import { PageHero } from "../layout/page-hero";
import { PageTransition } from "../layout/page-transition";
import { JsonLd } from "../seo/json-ld";
import { Star4 } from "../ui/decor";
import { ArrowIcon, WhatsAppIcon } from "../ui/icons";

export function legalMetadata(page: LegalPage): Metadata {
  return { title: page.label === "Terms" ? "Terms of sale" : `${page.label} policy`, description: page.description, alternates: { canonical: `/${page.slug}` } };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Shared layout for the policy pages: numbered index on the left, the clauses on the right. */
export function LegalPageView({ page }: { page: LegalPage }) {
  const others = legalPages.filter((p) => p.slug !== page.slug);

  return (
    <PageTransition>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: page.label, path: `/${page.slug}` }])} />
      <PageHero index={page.index} label={page.label} title={page.title} accent={page.accent} intro={page.intro} />

      <section className="py-10 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16 lg:px-8">
          {/* Index */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/55">Last updated</p>
            <p className="mt-1 font-display text-lg italic">{page.updated}</p>
            <nav aria-label="On this page" className="mt-6 hidden border-t border-ink/10 lg:block">
              <ol>
                {page.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="group flex items-baseline gap-3 border-b border-ink/10 py-2 text-[13px] text-ink/70 transition-colors hover:text-ink">
                      <span className="text-[11px] tabular-nums text-pink">{pad(i + 1)}</span>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* Clauses */}
          <div className="max-w-2xl">
            <ol className="border-t border-ink/10">
              {page.sections.map((s, i) => (
                <li key={s.id} id={s.id} className="scroll-mt-28 border-b border-ink/10 py-6 lg:grid lg:grid-cols-[3rem_minmax(0,1fr)] lg:py-7">
                  <span className="font-display text-sm italic tabular-nums text-pink">{pad(i + 1)}</span>
                  <div>
                    <h2 className="mt-1 font-display text-[1.45rem] leading-tight lg:mt-0">{s.heading}</h2>
                    <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/78 sm:text-[15px]">
                      {s.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <a
              href={whatsappLink(`Hi Sweet Kitty! I have a question about your ${page.label.toLowerCase()} policy.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 flex items-center justify-between gap-4 border-b border-ink/15 pb-4"
            >
              <span>
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-pink-deep">
                  <WhatsAppIcon className="size-3.5" /> Still unsure?
                </span>
                <span className="mt-1 block font-display text-xl italic">Ask us on WhatsApp</span>
              </span>
              <ArrowIcon className="w-7 shrink-0 text-pink transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Other policies */}
      <section className="border-t border-ink/10 bg-mist py-8 lg:py-10">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-ink/55">
            <Star4 className="size-2.5 text-pink" /> More policies
          </p>
          <ul className="mt-3 grid border-t border-ink/10 sm:grid-cols-3 sm:border-t-0">
            {others.map((p) => (
              <li key={p.slug} className="border-b border-ink/10 sm:border-b-0 sm:border-l sm:first:border-l-0 sm:first:pl-0 sm:pl-5">
                <Link href={`/${p.slug}`} className="group flex items-center justify-between gap-3 py-3 sm:py-1">
                  <span>
                    <span className="block text-[11px] tabular-nums text-pink">N°{p.index}</span>
                    <span className="font-display text-lg">
                      {p.title} <span className="italic">{p.accent}</span>
                    </span>
                  </span>
                  <ArrowIcon className="w-6 shrink-0 text-pink transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageTransition>
  );
}
