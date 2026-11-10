import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin | My Sweet Kitty" },
  robots: { index: false, follow: false },
};

/** Everything under /admin. `data-admin` hides the shop's header, footer and overlays (globals.css). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-admin className="min-h-svh bg-[#f8f3f5] font-sans text-ink">
      {children}
    </div>
  );
}
