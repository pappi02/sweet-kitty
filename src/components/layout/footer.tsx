import Image from "next/image";
import Link from "next/link";
import { healthNote, legalPages } from "@/lib/legal";
import { singles } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { ArrowIcon } from "../ui/icons";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "The collection" },
      { href: "/the-kit", label: "The 7-Day Kit" },
      ...singles.map((p) => ({ href: `/shop/${p.slug}`, label: p.shortName })),
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/ritual", label: "The ritual" },
      { href: "/stories", label: "Stories & videos" },
      { href: "/about", label: "Our secret" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: whatsappLink("Hi Sweet Kitty!"), label: "WhatsApp", external: true },
      { href: `mailto:${site.email}`, label: "Email us", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="tone-dark bg-burgundy pb-24 pt-14 text-white lg:pb-8">

      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Link href="/the-kit" className="group mt-8 flex items-end justify-between gap-6 border-b border-white/15 pb-10">
          <span className="font-display text-[clamp(1.75rem,5vw,3.25rem)] leading-[0.98]">
            Ready for your <span className="text-accent italic">glow-up?</span>
          </span>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-rose text-burgundy transition-transform duration-300 group-hover:translate-x-1 sm:size-14">
            <ArrowIcon className="w-5 sm:w-7" />
          </span>
        </Link>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Image src="/brand/my-sweet-kitty-512.png" alt="My Sweet Kitty" width={510} height={512} className="h-28 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
              Natural, secret-recipe rituals that help every woman embrace her feminine power. Glow from the inside out.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-white/75">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-soft">{s.label}</span> {s.handle}
                </li>
              ))}
            </ul>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-soft">{c.title}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-white/82">
                {c.links.map((l) => (
                  <li key={l.href}>
                    {"external" in l ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-rose">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="transition-colors hover:text-rose">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/60">
          <nav aria-label="Policies">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 font-semibold uppercase tracking-[0.16em] text-white/75">
              {legalPages.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="transition-colors hover:text-rose">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-4 max-w-3xl leading-relaxed text-white/55">{healthNote}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
            <p>© 2026 My Sweet Kitty · {site.domain}</p>
            <p>Made with love for every woman.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
