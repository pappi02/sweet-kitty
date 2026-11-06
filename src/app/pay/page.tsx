import type { Metadata } from "next";
import { Suspense } from "react";
import { PayLink } from "@/components/payments/pay-link";
import { isDarajaReady } from "@/lib/payments/daraja";

// Payment links the shop sends on WhatsApp, e.g. for the delivery fee or a whole order:
//   https://mysweetkitty.com/pay?ref=SK-ABC123&amount=350
export const metadata: Metadata = {
  title: "Pay with M-Pesa",
  robots: { index: false, follow: false },
};

export default function PayPage() {
  return (
    <main className="tone-light min-h-svh bg-cream px-5 pb-16 pt-28 text-white lg:pt-36">
      <div className="mx-auto max-w-md">
        <Suspense fallback={<div className="h-80" />}>
          <PayLink enabled={isDarajaReady()} />
        </Suspense>
      </div>
    </main>
  );
}
