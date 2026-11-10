import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { storageMode } from "@/lib/cms/store";
import { readMentorshipForAdmin } from "@/lib/mentorship/data";
import { isDarajaReady } from "@/lib/payments/daraja";
import { readPostersForAdmin } from "@/lib/posters/data";
import { posterStatus } from "@/lib/posters/schema";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="font-display text-4xl">Welcome back.</h1>
      <p className="mt-2 text-ink/65">Edit what the site shows. Changes go live as soon as you save.</p>
      <Suspense fallback={<div className="mt-8 h-48 animate-pulse rounded-xl bg-white/60" />}>
        <Overview />
      </Suspense>
    </main>
  );
}

async function Overview() {
  await requireAdmin();
  const [{ doc, version }, { doc: posterDoc }] = await Promise.all([readMentorshipForAdmin(), readPostersForAdmin()]);
  const liveCount = posterDoc.posters.filter((p) => posterStatus(p) === "live").length;
  const upcoming = posterDoc.posters.filter((p) => posterStatus(p) === "scheduled").length;
  const films = doc.films.length;
  const ready = doc.films.filter((f) => f.src).length;
  const storage = storageMode();
  const pay = isDarajaReady();

  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Link href="/admin/mentorship" className="group rounded-xl bg-white p-6 ring-1 ring-ink/8 transition hover:ring-burgundy/40">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-burgundy">Mentorship</p>
        <p className="mt-2 font-display text-2xl">The mentorship page and homepage band</p>
        <dl className="mt-5 grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-ink/55">Films ready</dt>
            <dd className="mt-0.5 font-display text-2xl tabular-nums">
              {ready}
              <span className="text-base text-ink/45">/{films}</span>
            </dd>
          </div>
          <div>
            <dt className="text-ink/55">Programmes</dt>
            <dd className="mt-0.5 font-display text-2xl tabular-nums">{doc.programmes.items.length}</dd>
          </div>
          <div>
            <dt className="text-ink/55">Last saved</dt>
            <dd className="mt-1 text-sm font-medium">{version ? new Date(version.savedAt).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" }) : "Starter content"}</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm font-semibold text-burgundy">Edit mentorship →</p>
      </Link>

      <Link href="/admin/posters" className="group rounded-xl bg-white p-6 ring-1 ring-ink/8 transition hover:ring-burgundy/40 lg:order-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-burgundy">Posters</p>
        <p className="mt-2 font-display text-2xl">Pop-up posters and offers</p>
        <dl className="mt-5 grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-ink/55">Live now</dt>
            <dd className="mt-0.5 font-display text-2xl tabular-nums">{liveCount}</dd>
          </div>
          <div>
            <dt className="text-ink/55">Scheduled</dt>
            <dd className="mt-0.5 font-display text-2xl tabular-nums">{upcoming}</dd>
          </div>
          <div>
            <dt className="text-ink/55">All</dt>
            <dd className="mt-0.5 font-display text-2xl tabular-nums">{posterDoc.posters.length}</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm font-semibold text-burgundy">Manage posters →</p>
      </Link>

      <div className="rounded-xl bg-white p-6 ring-1 ring-ink/8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/55">Setup</p>
        <ul className="mt-4 space-y-3 text-sm">
          <Status ok={storage !== "none"} label="Content storage" detail={storage === "blob" ? "Vercel Blob" : storage === "local" ? "This computer (development)" : "Not connected: saving is off"} />
          <Status ok={pay} label="M-Pesa payments" detail={pay ? "On: bookings are paid upfront" : "Off: bookings go to WhatsApp"} />
        </ul>
      </div>
    </div>
  );
}

function Status({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className={ok ? "mt-1.5 size-2 rounded-full bg-emerald-600" : "mt-1.5 size-2 rounded-full bg-amber-500"} aria-hidden />
      <span>
        <span className="block font-semibold">{label}</span>
        <span className="text-ink/60">{detail}</span>
      </span>
    </li>
  );
}
