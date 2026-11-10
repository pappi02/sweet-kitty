"use client";

import { useEffect, useId, useRef, useState } from "react";
import { normalizePhone } from "@/lib/order";
import { site, whatsappLink } from "@/lib/site";
import { cn, formatKES } from "@/lib/utils";
import { track } from "../analytics/analytics";
import { Button } from "../ui/button";
import { CheckIcon, WhatsAppIcon } from "../ui/icons";

// M-Pesa Express (STK push): the customer taps Pay, Safaricom shows a PIN prompt on
// their phone, and this box waits for the result. Talks only to our own /api/payments.

type Phase =
  | { at: "form"; error?: string }
  | { at: "sending" }
  | { at: "waiting"; checkoutId: string; message: string }
  | { at: "paid"; receipt?: string }
  | { at: "stuck" };

const POLL_MS = 3000;
const GIVE_UP_MS = 120_000;

export function MpesaPay({
  reference,
  amount,
  defaultPhone = "",
  payload,
  tone = "light",
  onPaid,
  paidNote,
}: {
  reference: string;
  amount: number;
  defaultPhone?: string;
  /** Bag lines (priced on the server), a mentorship programme (priced on the server) or, for a payment link, a fixed amount. */
  payload: { items: { id: string; qty: number }[] } | { amount: number } | { programme: string };
  tone?: "light" | "dark";
  /** Called once when M-Pesa confirms the payment. */
  onPaid?: (receipt?: string) => void;
  /** Replaces "We'll confirm on WhatsApp." in the paid message. */
  paidNote?: string;
}) {
  const onPaidRef = useRef(onPaid);
  useEffect(() => {
    onPaidRef.current = onPaid;
  });
  const uid = useId();
  const [phone, setPhone] = useState(defaultPhone);
  const [phase, setPhase] = useState<Phase>({ at: "form" });
  const started = useRef(0);

  // Poll for the result while the PIN prompt is open.
  const checkoutId = phase.at === "waiting" ? phase.checkoutId : null;
  useEffect(() => {
    if (!checkoutId) return;
    let stop = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      if (stop) return;
      if (Date.now() - started.current > GIVE_UP_MS) return setPhase({ at: "stuck" });
      try {
        const res = await fetch("/api/payments/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutId }),
        });
        const r = (await res.json()) as { status?: string; message?: string; receipt?: string };
        if (stop) return;
        if (r.status === "paid") {
          track("purchase", { currency: "KES", value: amount, transaction_id: reference });
          onPaidRef.current?.(r.receipt);
          return setPhase({ at: "paid", receipt: r.receipt });
        }
        if (r.status === "cancelled" || r.status === "failed") return setPhase({ at: "form", error: r.message });
        if (r.message) setPhase((p) => (p.at === "waiting" ? { ...p, message: r.message! } : p));
      } catch {}
      timer = setTimeout(tick, POLL_MS);
    };
    timer = setTimeout(tick, POLL_MS);
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [checkoutId, amount, reference]);

  async function pay() {
    const n = normalizePhone(phone);
    if (!n) return setPhase({ at: "form", error: "Enter a Safaricom number, e.g. 0712 345 678." });
    setPhone(n);
    setPhase({ at: "sending" });
    try {
      const res = await fetch("/api/payments/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: n, reference, ...payload }),
      });
      const r = (await res.json()) as { checkoutId?: string; error?: string };
      if (!res.ok || !r.checkoutId) return setPhase({ at: "form", error: r.error ?? "Something went wrong. Please try again." });
      started.current = Date.now();
      track("add_payment_info", { currency: "KES", value: amount, payment_type: "mpesa" });
      setPhase({ at: "waiting", checkoutId: r.checkoutId, message: `Check your phone and enter your M-Pesa PIN to pay ${formatKES(amount)}.` });
    } catch {
      setPhase({ at: "form", error: "No connection. Check your internet and try again." });
    }
  }

  const dark = tone === "dark";
  const muted = dark ? "text-white/80" : "text-ink/80";

  return (
    <div className={cn("rounded-sm p-5 ring-1", dark ? "tone-dark bg-ink text-white ring-white/10" : "bg-white ring-ink/10")}>
      <div aria-live="polite">
        {phase.at === "paid" ? (
          <div className="flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-burgundy text-white">
              <CheckIcon className="size-4" />
            </span>
            <div>
              <p className="font-display text-xl leading-tight">Paid {formatKES(amount)}. Thank you!</p>
              <p className={cn("mt-1 text-sm", muted)}>
                {phase.receipt ? (
                  <>
                    M-Pesa receipt <span className="font-semibold tabular-nums">{phase.receipt}</span>.{" "}
                  </>
                ) : null}
                Your reference is <span className="font-semibold tabular-nums">{reference}</span>. {paidNote ?? "We'll confirm on WhatsApp."}
              </p>
            </div>
          </div>
        ) : phase.at === "waiting" || phase.at === "sending" ? (
          <div className="flex items-start gap-3">
            <span className="mt-1 size-5 shrink-0 animate-spin rounded-full border-2 border-burgundy border-t-transparent motion-reduce:animate-none" aria-hidden />
            <div>
              <p className="font-semibold">{phase.at === "sending" ? "Sending the M-Pesa request…" : "Waiting for your PIN"}</p>
              {phase.at === "waiting" && <p className={cn("mt-1 text-sm", muted)}>{phase.message}</p>}
            </div>
          </div>
        ) : phase.at === "stuck" ? (
          <div>
            <p className="font-semibold">We haven&apos;t heard back from M-Pesa yet.</p>
            <p className={cn("mt-1 text-sm", muted)}>
              If you paid, you&apos;ll get an M-Pesa SMS. Send us the code on WhatsApp with your reference {reference} and we&apos;ll confirm.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button href={whatsappLink(`Hi ${site.name}! I've paid for order ${reference}. M-Pesa code: `)} target="_blank" rel="noopener noreferrer" variant="dark">
                <WhatsAppIcon className="size-4" /> Send the code
              </Button>
              <Button onClick={() => setPhase({ at: "form" })} variant="light">
                Try again
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {phase.at === "form" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            pay();
          }}
          noValidate
        >
          <label htmlFor={`${uid}-phone`} className={cn("text-xs font-bold uppercase tracking-[0.14em]", muted)}>
            M-Pesa number
          </label>
          <input
            id={`${uid}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0712 345 678"
            aria-invalid={phase.error ? true : undefined}
            aria-describedby={`${uid}-msg`}
            className="mt-1.5 h-12 w-full rounded-[2px] bg-white px-3.5 text-base text-ink ring-1 ring-ink/20 outline-none transition placeholder:text-ink/50 focus:ring-2 focus:ring-burgundy aria-invalid:ring-2 aria-invalid:ring-burgundy-bright"
          />
          <p id={`${uid}-msg`} className={cn("mt-1 text-xs", phase.error ? "font-semibold text-burgundy-bright" : muted)} role={phase.error ? "alert" : undefined}>
            {phase.error ?? "You'll get a prompt on this phone. Enter your PIN there, never on a website."}
          </p>
          <Button type="submit" size="lg" className="mt-3 w-full">
            Pay {formatKES(amount)} with M-Pesa
          </Button>
        </form>
      )}
    </div>
  );
}
