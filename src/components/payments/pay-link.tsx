"use client";

import { useSearchParams } from "next/navigation";
import { site, whatsappLink } from "@/lib/site";
import { formatKES } from "@/lib/utils";
import { Button } from "../ui/button";
import { WhatsAppIcon } from "../ui/icons";
import { MpesaPay } from "./mpesa-pay";

/** Reads ?ref=SK-…&amount=… and offers an M-Pesa prompt for exactly that. */
export function PayLink({ enabled }: { enabled: boolean }) {
  const q = useSearchParams();
  const ref = (q.get("ref") ?? "").trim().toUpperCase();
  const amount = Number(q.get("amount"));
  const valid = /^SK-[A-Z0-9]{4,10}$/.test(ref) && Number.isInteger(amount) && amount >= 1 && amount <= 250_000;
  const what = q.get("for") === "delivery" ? "Delivery fee" : "Your order";

  return (
    <>
      <p className="font-display text-sm italic text-accent">Secure M-Pesa payment</p>
      <h1 className="mt-2 font-display text-[clamp(1.8rem,6.8vw,2.52rem)] leading-[1]">
        {valid ? (
          <>
            {what}, <span className="italic text-accent">{formatKES(amount)}</span>
          </>
        ) : (
          "This payment link isn't complete"
        )}
      </h1>

      {valid ? (
        <>
          <p className="mt-3 text-sm text-white/80">
            Order reference <span className="font-semibold tabular-nums text-white">{ref}</span>. Check that the amount matches what we sent you on WhatsApp.
          </p>
          <div className="mt-6">
            {enabled ? (
              <MpesaPay reference={ref} amount={amount} payload={{ amount }} />
            ) : (
              <p className="rounded-sm bg-white p-5 text-sm text-ink/80 ring-1 ring-ink/10">Online M-Pesa payment isn&apos;t available right now. Message us and we&apos;ll send the payment details.</p>
            )}
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm text-white/80">Part of the link may be missing. Ask us on WhatsApp and we&apos;ll send it again.</p>
      )}

      <div className="mt-6 flex flex-col gap-2 text-sm text-white/80">
        <Button href={whatsappLink(valid ? `Hi ${site.name}! A question about paying for order ${ref}.` : `Hi ${site.name}! My payment link didn't work.`)} target="_blank" rel="noopener noreferrer" variant="dark" className="w-full">
          <WhatsAppIcon className="size-4" /> Questions? WhatsApp us
        </Button>
        <p className="mt-2 text-xs text-white/75">We will never ask for your M-Pesa PIN. The prompt comes from M-Pesa on your phone.</p>
      </div>
    </>
  );
}
