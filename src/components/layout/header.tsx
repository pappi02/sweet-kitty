"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { nav } from "@/lib/content";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { BagIcon, CloseIcon, MenuIcon, WhatsAppIcon } from "../ui/icons";
import { Button } from "../ui/button";
import { useDialog } from "../ui/use-dialog";

const menuLinks = [...nav, { href: "/contact", label: "Contact" }];

const isActive = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { count, setOpen, pulse } = useCart();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  const menuRef = useRef<HTMLDivElement>(null);
  useDialog(menuRef, menu, () => setMenu(false));

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(false);
  }

  return (
    <>
      <header className="tone-light fixed inset-x-0 top-0 z-50" style={{ viewTransitionName: "site-header" }}>
        <motion.div
          animate={{ height: scrolled ? 0 : 28, opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          className="tone-dark overflow-hidden bg-burgundy text-rose"
        >
          <p className="flex h-7 items-center justify-center text-xs font-medium tracking-wide">Discreet packaging on every order<span className="hidden sm:inline">. Order in seconds on WhatsApp.</span></p>
        </motion.div>

        <div className={cn("bg-cream transition-shadow duration-300", scrolled && "shadow-[0_8px_30px_-18px_rgba(51,4,18,0.45)]")}>
          <nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-3 sm:px-5 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5" aria-label="My Sweet Kitty home">
              <Image src="/brand/my-sweet-kitty-512.png" alt="My Sweet Kitty" width={510} height={512} preload className="h-14 w-auto" />
              </Link>

            <ul className="hidden items-center lg:flex">
              {nav.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <li key={l.href} className="relative">
                    <Link
                      href={l.href}
                      className={cn("relative block px-3 py-2 text-sm font-medium tracking-wide transition-colors xl:px-3.5", active ? "text-white" : "text-white/72 hover:text-white")}
                    >
                      {l.label}
                    </Link>
                    {active && (
                      <motion.span layoutId="nav-dot" transition={{ type: "spring", stiffness: 500, damping: 38 }} className="absolute bottom-0 left-1/2 -ml-0.75 size-1.5 rounded-full bg-burgundy" />
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-1.5">
              <motion.button
                key={pulse}
                animate={pulse ? { scale: [1, 1.2, 0.95, 1] } : undefined}
                transition={{ duration: 0.35 }}
                onClick={() => setOpen(true)}
                className="relative grid size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10"
                aria-label={`Open bag, ${count} items`}
              >
                <BagIcon className="size-4" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="tone-dark absolute right-1 top-1 grid size-4.5 place-items-center rounded-full bg-burgundy text-xs font-bold text-white"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <button onClick={() => setMenu(true)} className="grid size-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden" aria-label="Open menu" aria-expanded={menu} aria-controls="site-menu">
                <MenuIcon className="size-6" />
              </button>
              <Button href="/the-kit" className="ml-2 hidden lg:inline-flex">
                Get the Kit
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            ref={menuRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            tabIndex={-1}
            className="tone-light fixed inset-0 z-60 flex flex-col overflow-hidden bg-rose text-white outline-none"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 3.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 3.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 3.5rem)" }}
            transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="pointer-events-none absolute -right-1/3 top-1/4 size-[120vw] rounded-full bg-[radial-gradient(circle,rgba(115,6,44,0.35),transparent_65%)]" />
            <div className="relative flex items-center justify-between px-5 pt-4">
              <Image src="/brand/my-sweet-kitty-512.png" alt="My Sweet Kitty" width={510} height={512} className="h-14 w-auto" />
              <button onClick={() => setMenu(false)} className="grid size-11 place-items-center rounded-full ring-1 ring-white/15" aria-label="Close menu">
                <CloseIcon className="size-5" />
              </button>
            </div>
            <motion.ul
              className="relative mt-4 flex flex-col overflow-y-auto px-6"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } } }}
            >
              <motion.li variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                <Link href="/" className="flex items-baseline gap-4 border-b border-white/10 py-2.5">
                  <span className="text-xs tabular-nums text-accent">00</span>
                  <span className={cn("font-display text-[1.75rem] italic", pathname === "/" && "text-accent")}>Home</span>
                </Link>
              </motion.li>
              {menuLinks.map((l, i) => (
                <motion.li key={l.href} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                  <Link href={l.href} className="flex items-baseline gap-4 border-b border-white/10 py-2.5">
                    <span className="text-xs tabular-nums text-accent">0{i + 1}</span>
                    <span className={cn("font-display text-[1.75rem] italic", isActive(pathname, l.href) && "text-accent")}>{l.label}</span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div className="relative mt-auto space-y-3 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }}>
              <Button href="/the-kit" size="lg" className="w-full">
                Shop the 7-Day Kit
              </Button>
              <Button href={whatsappLink("Hi Sweet Kitty! I'd like to know more.")} target="_blank" rel="noopener noreferrer" variant="ghost" size="lg" className="w-full">
                <WhatsAppIcon className="size-4" /> Chat on WhatsApp
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
