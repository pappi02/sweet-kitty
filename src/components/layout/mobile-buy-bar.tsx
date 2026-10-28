"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { kit } from "@/lib/products";
import { whatsappLink } from "@/lib/site";
import { formatKES } from "@/lib/utils";
import { useCart } from "../cart/cart-provider";
import { WhatsAppIcon } from "../ui/icons";
import { ShimmerButton } from "../ui/shimmer-button";

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
          <div className="flex items-center gap-2 rounded-full bg-sky-light/90 tone-light p-1 pl-4 shadow-[0_20px_50px_-15px_rgba(255,0,144,0.6)] ring-1 ring-white/10 backdrop-blur-xl">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-pink-soft">The 7-Day Kit</p>
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
            <ShimmerButton onClick={() => add(kit.id)} className="h-10 px-4">
              Get it now
            </ShimmerButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
