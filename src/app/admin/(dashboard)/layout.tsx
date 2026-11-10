import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin/auth";
import { logout } from "../actions";

/** Signed-in area. Each page also checks the session itself (pages render in parallel with layouts). */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/8 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/brand/my-sweet-kitty-512.png" alt="" width={510} height={512} className="h-10 w-auto" />
            <span className="hidden font-display text-lg sm:inline">Admin</span>
          </Link>
          <AdminNav />
          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener" className="hidden h-9 items-center rounded-md px-3 text-sm font-medium text-ink/70 transition hover:bg-ink/5 hover:text-ink sm:inline-flex">
              View site ↗
            </a>
            <form action={logout}>
              <button className="h-9 rounded-md px-3 text-sm font-medium text-ink/70 ring-1 ring-ink/12 transition hover:bg-ink hover:text-white">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}

function Loading() {
  return (
    <div className="grid min-h-svh place-items-center">
      <span className="size-6 animate-spin rounded-full border-2 border-burgundy border-t-transparent" aria-label="Loading" />
    </div>
  );
}
