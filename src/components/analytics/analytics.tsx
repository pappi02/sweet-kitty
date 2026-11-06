"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import Script from "next/script";
import { useSyncExternalStore } from "react";
import { gaId } from "@/lib/site";

// Google Analytics 4, loaded only when NEXT_PUBLIC_GA_ID is set AND the visitor
// accepts the cookie notice (Kenya Data Protection Act). The choice is kept in
// this browser and can be changed from the footer.

type Consent = "granted" | "denied" | null;
const KEY = "sweet-kitty-consent";
const listeners = new Set<() => void>();

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function setConsent(v: Consent) {
  try {
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** "pending" on the server and before the browser has been read, so nothing flashes. */
function useConsent(): Consent | "pending" {
  return useSyncExternalStore(subscribe, readConsent, () => "pending" as const);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends a GA4 event when analytics is running; does nothing otherwise. */
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) window.gtag("event", event, params);
}

export function Analytics() {
  const consent = useConsent();
  if (!gaId) return null;

  return (
    <>
      {consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      <AnimatePresence>
        {consent === null && (
          <motion.div
            role="region"
            aria-label="Cookie notice"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="tone-dark fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-80 mx-auto max-w-md rounded-sm bg-ink p-4 text-white shadow-2xl sm:left-auto sm:right-5"
          >
            <p className="text-sm leading-relaxed text-white/90">
              Can we count your visit with Google Analytics? It helps us see what you love. No ads, ever.{" "}
              <Link href="/privacy#what-we-collect" className="underline underline-offset-2">
                Privacy
              </Link>
            </p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setConsent("granted")} className="h-10 flex-1 rounded-[2px] bg-rose text-xs font-semibold uppercase tracking-[0.12em] text-burgundy">
                Accept
              </button>
              <button onClick={() => setConsent("denied")} className="h-10 flex-1 rounded-[2px] text-xs font-semibold uppercase tracking-[0.12em] text-white ring-1 ring-white/40">
                No thanks
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Footer link that brings the cookie notice back. Hidden when analytics isn't set up. */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!gaId) return null;
  return (
    <button
      onClick={() => {
        // Turning analytics off needs a reload to unload Google's script.
        const wasOn = readConsent() === "granted";
        setConsent(null);
        if (wasOn) window.location.reload();
      }}
      className={className}
    >
      Cookie settings
    </button>
  );
}
