import Link from "next/link";
import { connection } from "next/server";
import { getPosters } from "@/lib/posters/data";
import { livePosters, POSTER_KIND_LABELS, posterAnchor, type Poster } from "@/lib/posters/schema";
import { formatNairobi } from "@/lib/posters/time";
import { site, whatsappLink } from "@/lib/site";
import { Eyebrow } from "../ui/decor";
import { CheckIcon } from "../ui/icons";

const button = "inline-flex h-12 items-center justify-center rounded-[2px] bg-burgundy px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-burgundy-bright";

function Cta({ url, label }: { url: string; label: string }) {
  if (url.startsWith("/")) return <Link href={url} className={button}>{label}</Link>;
  if (url.startsWith("tel:")) return <a href={url} className={button}>{label}</a>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={button}>
      {label}
    </a>
  );
}

/**
 * "Running now" at the top of /shop: every live poster in full. Tapping a poster
 * pop-up anywhere on the site lands on its own article here (#offer-<id>). Rendered
 * at request time (inside a Suspense boundary), since "live" depends on the clock.
 */
export async function PosterOffers() {
  await connection();
  const posters = livePosters(await getPosters()).slice(0, 10);
  if (posters.length === 0) return null;

  return (
    <section id="offers" aria-label="Offers running now" className="bg-cream px-5 pt-9 lg:px-8 lg:pt-12">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Running now</Eyebrow>
        <h2 className="mt-2 font-display text-[clamp(1.9rem,5vw,3rem)] leading-[1.02]">
          Special <span className="italic text-accent">offers.</span>
        </h2>
        <div className="mt-6 grid gap-5">
          {posters.map((p) => (
            <Offer key={p.id} poster={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Offer({ poster: p }: { poster: Poster }) {
  const paragraphs = p.details.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
  return (
    <article
      id={posterAnchor(p.id)}
      className="grid scroll-mt-28 gap-6 rounded-sm bg-white p-5 ring-1 ring-ink/10 transition-shadow duration-500 target:shadow-[0_0_0_3px_rgba(115,6,44,0.25),0_24px_60px_-20px_rgba(51,4,18,0.35)] sm:p-7 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-10"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- the poster at its own proportions, from Blob or /uploads */}
      <img src={p.image} alt={p.title} className="mx-auto block h-auto w-full max-w-88 rounded-sm shadow-[0_18px_40px_-16px_rgba(51,4,18,0.45)]" />
      <div className="grid min-w-0 content-start gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-burgundy px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">{POSTER_KIND_LABELS[p.kind]}</span>
          <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/60 ring-1 ring-ink/12">Until {formatNairobi(p.endsAt)}</span>
        </div>
        <div>
          <h3 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-tight">{p.title}</h3>
          {p.summary && <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink/72">{p.summary}</p>}
        </div>
        {p.priceText && <p className="font-display text-2xl text-burgundy">{p.priceText}</p>}
        {p.highlights.length > 0 && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-sm text-ink/80">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-burgundy" />
                {h}
              </li>
            ))}
          </ul>
        )}
        {paragraphs.map((t, i) => (
          <p key={i} className="max-w-2xl text-sm leading-relaxed text-ink/72">
            {t}
          </p>
        ))}
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Cta url={p.ctaUrl || whatsappLink(`Hi ${site.name}! I'm interested in: ${p.title}`)} label={p.ctaLabel || (p.ctaUrl ? "Get it now" : "Ask on WhatsApp")} />
        </div>
        {p.terms && <p className="text-xs leading-relaxed text-ink/55">{p.terms}</p>}
      </div>
    </article>
  );
}
