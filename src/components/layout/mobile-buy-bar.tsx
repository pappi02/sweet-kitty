"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { kit } from "@/lib/products";
import { whatsappLink } from "@/lib/site";
import { formatKES } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { WhatsAppIcon } from "../ui/icons";
import { Button } from "../ui/button";

// Pages that sell the kit. Product pages have their own bar.
const pages = ["/", "/the-kit", "/ritual", "/stories", "/about"];

/** Sticky buy bar on phones, shown after the hero scrolls away. */
export function MobileBuyBar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const { add, open } = useCart();

  useMotionValueEvent(scrollY, "change", (v) => {
    const nearBottom = v + window.innerHeight > document.documentElement.scrollHeight - 160;
    setShow(v > window.innerHeight * 0.8 && !nearBottom);
  });

  return (
    <AnimatePresence>
      {show && !open && pages.includes(pathname) && (
        <motion.div
          initial={{ y: 110 }}
          animate={{ y: 0 }}
          exit={{ y: 110 }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden"
        >
          <div className="flex items-center gap-2 rounded-[2px] bg-cream tone-light p-1.5 pl-4 shadow-[0_18px_40px_-16px_rgba(51,4,18,0.55)] ring-1 ring-burgundy/20">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold uppercase tracking-[0.16em] text-accent-soft">The 7-Day Kit</p>
              <p className="font-display text-[15px] leading-tight text-white">{formatKES(kit.price!)}</p>
            </div>
            <a
              href={whatsappLink("Hi Sweet Kitty! I'd like to order the 7-Day Kit.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="grid size-10 place-items-center rounded-full text-white ring-1 ring-white/15"
            >
              <WhatsAppIcon className="size-4" />
            </a>
            <Button onClick={() => add(kit.id)} className="h-11 px-4">
              Get it now
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
