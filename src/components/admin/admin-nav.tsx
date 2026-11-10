"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/mentorship", label: "Mentorship" },
  { href: "/admin/posters", label: "Posters" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {links.map((l) => {
        const active = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={cn("h-9 rounded-md px-3 text-sm font-medium leading-9 transition", active ? "bg-burgundy/8 text-burgundy" : "text-ink/65 hover:bg-ink/5 hover:text-ink")}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
