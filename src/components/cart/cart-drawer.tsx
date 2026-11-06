"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { deliveryZones, emptyDetails, mpesaSteps, normalizePhone, orderMessage, orderRef, validate, type FieldErrors, type OrderDetails } from "@/lib/order";
import { kit } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { cn, formatKES } from "@/lib/utils";
import { track } from "../analytics/analytics";
import { MpesaPay } from "../payments/mpesa-pay";
import { Star4 } from "../ui/decor";
import { ArrowIcon, CheckIcon, ChevronIcon, CloseIcon, MinusIcon, PlusIcon, WhatsAppIcon } from "../ui/icons";
import { ProductVisual } from "../ui/product-visual";
import { Button } from "../ui/button";
import { useDialog } from "../ui/use-dialog";
import { MAX_QTY, useCart } from "./cart-provider";

type Step = "bag" | "details" | "sent";
type Sent = { ref: string; subtotal: number; message: string; count: number; phone: string; lines: { id: string; qty: number }[] };

// The order form remembers the customer's details in this browser only.
const DETAILS_KEY = "sweet-kitty-details";
function loadDetails(): OrderDetails {
  try {
    const saved = JSON.parse(localStorage.getItem(DETAILS_KEY) ?? "{}");
    return { ...emptyDetails, ...saved, notes: "", gift: false };
  } catch {
    return emptyDetails;
  }
}
function saveDetails(d: OrderDetails) {
  try {
    localStorage.setItem(DETAILS_KEY, JSON.stringify({ name: d.name, phone: d.phone, zone: d.zone, location: d.location }));
  } catch {}
}

/** `payEnabled` is true once the Daraja (M-Pesa) keys are set on the server. */
export function CartDrawer({ payEnabled = false }: { payEnabled?: boolean }) {
  const { items, open, setOpen, setQty, remove, clear, subtotal, count, add } = useCart();
  const panel = useRef<HTMLElement>(null);
  const [step, setStep] = useState<Step>("bag");
  const [details, setDetails] = useState<OrderDetails>(emptyDetails);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState<Sent | null>(null);

  const close = () => setOpen(false);
  useDialog(panel, open, close);

  // A finished order shouldn't greet the customer next time they open the bag.
  const [lastOpen, setLastOpen] = useState(open);
  if (lastOpen !== open) {
    setLastOpen(open);
    if (open && step === "sent") setStep("bag");
  }

  const hasKit = items.some((i) => i.product.id === kit.id);

  function toDetails() {
    setDetails(loadDetails());
    setErrors({});
    setStep("details");
    track("begin_checkout", { currency: "KES", value: subtotal });
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(details);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      panel.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const ref = orderRef();
    const message = orderMessage(
      ref,
      items.map((i) => ({ name: i.product.name, qty: i.qty, lineTotal: i.lineTotal })),
      subtotal,
      details,
    );
    // Opened straight from the tap so phones don't block it.
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    saveDetails(details);
    track("generate_lead", { currency: "KES", value: subtotal, order_ref: ref });
    setSent({ ref, subtotal, message, count, phone: normalizePhone(details.phone) ?? details.phone, lines: items.map((i) => ({ id: i.product.id, qty: i.qty })) });
    clear();
    setStep("sent");
  }

  const title = step === "bag" ? "Your bag" : step === "details" ? "Delivery details" : "Order sent";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-70">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          />
          <motion.aside
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-cream shadow-2xl outline-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 40 }}
          >
            <header className="flex items-center gap-3 px-6 pb-4 pt-6">
              {step === "details" && (
                <button onClick={() => setStep("bag")} className="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-ink/15 transition hover:bg-ink hover:text-white" aria-label="Back to bag">
                  <ChevronIcon dir="left" className="size-4" />
                </button>
              )}
              <h2 id="bag-title" className="flex-1 font-display text-3xl">
                {title} {step === "bag" && <span className="align-top text-sm tabular-nums text-accent">({count})</span>}
              </h2>
              <button onClick={close} className="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-ink/15 transition hover:bg-ink hover:text-white" aria-label="Close bag">
                <CloseIcon className="size-5" />
              </button>
            </header>

            {step !== "sent" && <Steps step={step} />}

            {step === "bag" && <BagStep items={items} hasKit={hasKit} add={add} setQty={setQty} remove={remove} subtotal={subtotal} onCheckout={toDetails} />}
            {step === "details" && <DetailsStep details={details} setDetails={setDetails} errors={errors} subtotal={subtotal} onSubmit={submit} />}
            {step === "sent" && sent && <SentStep sent={sent} payEnabled={payEnabled} onDone={close} />}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Progress ---------- */

function Steps({ step }: { step: Step }) {
  const steps = ["Bag", "Details", "WhatsApp"];
  const at = step === "bag" ? 0 : 1;
  return (
    <ol className="mx-6 mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]" aria-label="Checkout steps">
      {steps.map((s, i) => (
        <li key={s} className={cn("flex items-center gap-2", i <= at ? "text-ink" : "text-ink/70")} aria-current={i === at ? "step" : undefined}>
          <span className={cn("grid size-5 place-items-center rounded-full text-[11px] tabular-nums", i <= at ? "tone-dark bg-burgundy text-white" : "ring-1 ring-ink/25")}>{i + 1}</span>
          {s}
          {i < steps.length - 1 && <span className="h-px w-5 bg-ink/20" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}

/* ---------- Step 1: the bag ---------- */

type CartItems = ReturnType<typeof useCart>["items"];

function BagStep({
  items,
  hasKit,
  add,
  setQty,
  remove,
  subtotal,
  onCheckout,
}: {
  items: CartItems;
  hasKit: boolean;
  add: (id: string) => void;
  setQty: (id: string, q: number) => void;
  remove: (id: string) => void;
  subtotal: number;
  onCheckout: () => void;
}) {
  return (
    <>
      <div className="flex-1 overflow-y-auto px-6">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="font-display text-3xl italic">Nothing here… yet.</p>
            <p className="mt-2 max-w-[16rem] text-sm text-ink/75">Your glow-up is one tap away. Most women start with the 7-Day Kit.</p>
            <Button onClick={() => add(kit.id)} className="mt-6">
              Add the 7-Day Kit
            </Button>
            <Link href="/shop" className="mt-4 text-sm font-semibold text-ink underline decoration-accent underline-offset-4">
              Browse the collection
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            <AnimatePresence initial={false}>
              {items.map(({ product, qty, lineTotal }) => (
                <motion.li
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-4 py-4"
                >
                  <ProductVisual product={product} className="h-24 w-20 shrink-0 rounded-sm" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="font-display text-lg leading-tight">{product.name}</p>
                    <p className="mt-0.5 text-xs text-ink/75">
                      {formatKES(product.price!)}
                      {product.size && ` · ${product.size}`}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full ring-1 ring-ink/20" role="group" aria-label={`Quantity of ${product.name}`}>
                        <button onClick={() => setQty(product.id, qty - 1)} className="grid size-10 place-items-center" aria-label={`One less ${product.name}`}>
                          <MinusIcon className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                          {qty}
                        </span>
                        <button onClick={() => setQty(product.id, qty + 1)} disabled={qty >= MAX_QTY} className="grid size-10 place-items-center disabled:opacity-40" aria-label={`One more ${product.name}`}>
                          <PlusIcon className="size-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums">{formatKES(lineTotal)}</p>
                        <button onClick={() => remove(product.id)} className="text-xs text-ink/75 underline-offset-2 transition hover:text-accent hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        {items.length > 0 && !hasKit && (
          <button onClick={() => add(kit.id)} className="tone-dark group mt-3 flex w-full items-center justify-between gap-4 rounded-sm bg-ink p-5 text-left text-white">
            <span>
              <span className="block text-xs font-bold uppercase tracking-[0.16em] text-accent-soft">Upgrade your glow</span>
              <span className="mt-1 block text-sm text-white/80">
                Four signature rituals in the <span className="text-white">7-Day Kit</span>, {formatKES(kit.price!)}.
              </span>
            </span>
            <ArrowIcon className="w-7 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
          </button>
        )}
      </div>

      {items.length > 0 && (
        <footer className="space-y-3 border-t border-ink/10 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/75">Subtotal</span>
            <span className="font-display text-3xl tabular-nums">{formatKES(subtotal)}</span>
          </div>
          <p className="text-xs text-ink/75">Delivery fee depends on your location. We confirm it with you on WhatsApp before you pay.</p>
          <Button onClick={onCheckout} size="lg" className="w-full">
            Continue to delivery <ArrowIcon className="w-5" />
          </Button>
          <p className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.16em] text-ink/75">
            Discreet packaging <Star4 className="size-2 text-accent" /> Pay with M-Pesa
          </p>
        </footer>
      )}
    </>
  );
}

/* ---------- Step 2: delivery details ---------- */

function Field({ label, error, hint, children, id }: { label: string; error?: string; hint?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-[0.14em] text-ink/80">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-msg`} className="mt-1 text-xs font-semibold text-burgundy-bright">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-msg`} className="mt-1 text-xs text-ink/75">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

const input =
  "w-full rounded-[2px] bg-white px-3.5 text-base text-ink ring-1 ring-ink/20 outline-none transition placeholder:text-ink/50 focus:ring-2 focus:ring-burgundy aria-invalid:ring-2 aria-invalid:ring-burgundy-bright";

function DetailsStep({
  details,
  setDetails,
  errors,
  subtotal,
  onSubmit,
}: {
  details: OrderDetails;
  setDetails: (d: OrderDetails) => void;
  errors: FieldErrors;
  subtotal: number;
  onSubmit: (e: FormEvent) => void;
}) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const set = <K extends keyof OrderDetails>(k: K, v: OrderDetails[K]) => setDetails({ ...details, [k]: v });
  const a11y = (k: keyof FieldErrors, hint = false) => ({
    id: id(k),
    name: k,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] || hint ? `${id(k)}-msg` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-4">
        <p className="text-sm text-ink/80">We only use these to deliver your order. Your parcel arrives plain, with nothing on the outside.</p>

        <Field label="Your name" id={id("name")} error={errors.name}>
          <input {...a11y("name")} data-autofocus autoComplete="name" value={details.name} onChange={(e) => set("name", e.target.value)} className={cn(input, "h-12")} placeholder="e.g. Wanjiru" />
        </Field>

        <Field label="Phone number" id={id("phone")} error={errors.phone} hint="We'll call this number when your parcel is on the way.">
          <input
            {...a11y("phone", true)}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={details.phone}
            onChange={(e) => set("phone", e.target.value)}
            onBlur={() => {
              const n = normalizePhone(details.phone);
              if (n) set("phone", n);
            }}
            className={cn(input, "h-12")}
            placeholder="0712 345 678"
          />
        </Field>

        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-[0.14em] text-ink/80">Delivery area</legend>
          <div className="mt-1.5 grid gap-2" role="radiogroup" aria-describedby={errors.zone ? `${id("zone")}-msg` : undefined}>
            {deliveryZones.map((z, i) => (
              <label
                key={z.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-[2px] bg-white px-3.5 py-3 text-sm ring-1 transition",
                  details.zone === z.id ? "ring-2 ring-burgundy" : errors.zone ? "ring-burgundy-bright" : "ring-ink/20 hover:ring-ink/40",
                )}
              >
                <input type="radio" name="zone" id={i === 0 ? id("zone") : undefined} value={z.id} checked={details.zone === z.id} onChange={() => set("zone", z.id)} className="size-4 accent-burgundy" />
                {z.label}
              </label>
            ))}
          </div>
          {errors.zone && (
            <p id={`${id("zone")}-msg`} className="mt-1 text-xs font-semibold text-burgundy-bright">
              {errors.zone}
            </p>
          )}
        </fieldset>

        <Field label="Area, estate or town" id={id("location")} error={errors.location} hint="e.g. Kilimani, Argwings Kodhek Rd. Or: Nakuru town.">
          <input {...a11y("location", true)} autoComplete="street-address" value={details.location} onChange={(e) => set("location", e.target.value)} className={cn(input, "h-12")} />
        </Field>

        <Field label="Anything we should know? (optional)" id={id("notes")}>
          <textarea id={id("notes")} name="notes" rows={2} value={details.notes} onChange={(e) => set("notes", e.target.value)} className={cn(input, "py-3")} placeholder="Best time to deliver, a landmark…" />
        </Field>

        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" checked={details.gift} onChange={(e) => set("gift", e.target.checked)} className="size-4 accent-burgundy" />
          It&apos;s a gift
        </label>
      </div>

      <footer className="space-y-3 border-t border-ink/10 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/75">Subtotal</span>
          <span className="font-display text-2xl tabular-nums">
            {formatKES(subtotal)} <span className="font-sans text-xs text-ink/75">+ delivery</span>
          </span>
        </div>
        <Button type="submit" size="lg" className="w-full">
          <WhatsAppIcon className="size-4" /> Send order on WhatsApp
        </Button>
        <p className="text-center text-xs text-ink/75">
          Opens WhatsApp with your order ready to send. No WhatsApp? Call{" "}
          <a href={site.phoneHref} className="font-semibold text-ink underline underline-offset-2">
            {site.phone}
          </a>
          .
        </p>
      </footer>
    </form>
  );
}

/* ---------- Step 3: sent, how to pay ---------- */

function SentStep({ sent, payEnabled, onDone }: { sent: Sent; payEnabled: boolean; onDone: () => void }) {
  const total = formatKES(sent.subtotal);
  const steps = payEnabled
    ? [
        { t: "Send the message", d: "Tap send in WhatsApp if you haven't already." },
        { t: "Pay for your items", d: `Pay ${total} below now, or later once we've confirmed on WhatsApp.` },
        { t: "Delivery fee", d: "We confirm it on WhatsApp for your location and send you a link to pay it by M-Pesa." },
        { t: "Discreet delivery", d: "We call you when your plain parcel is on its way." },
      ]
    : [
        { t: "Send the message", d: "Tap send in WhatsApp if you haven't already." },
        { t: "We confirm your total", d: "Including the delivery fee for your location." },
        { t: "Pay with M-Pesa", d: mpesaSteps(sent.ref, total).join(" ") },
        { t: "Discreet delivery", d: "We call you when your plain parcel is on its way." },
      ];
  return (
    <>
      <div className="flex-1 overflow-y-auto px-6">
        <div className="tone-dark rounded-sm bg-burgundy p-5 text-white">
          <span className="grid size-10 place-items-center rounded-full bg-rose text-burgundy">
            <CheckIcon className="size-5" />
          </span>
          <p className="mt-3 font-display text-2xl leading-tight">Your order is ready in WhatsApp</p>
          <p className="mt-1 text-sm text-white/85">
            Reference <span className="font-semibold tabular-nums text-white">{sent.ref}</span> · {sent.count} {sent.count === 1 ? "item" : "items"} · {total} + delivery
          </p>
        </div>

        {payEnabled && (
          <div className="mt-4">
            <MpesaPay reference={sent.ref} amount={sent.subtotal} defaultPhone={sent.phone} payload={{ items: sent.lines }} />
          </div>
        )}

        <ol className="mt-5 border-t border-ink/10">
          {steps.map((s, i) => (
            <li key={s.t} className="flex gap-4 border-b border-ink/10 py-3.5">
              <span className="font-display text-lg italic tabular-nums text-accent">{i + 1}.</span>
              <span>
                <span className="block text-sm font-semibold">{s.t}</span>
                <span className="mt-0.5 block text-sm text-ink/80">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-ink/75">We will never ask for your M-Pesa PIN. Keep your reference for any questions.</p>
      </div>

      <footer className="space-y-2.5 border-t border-ink/10 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        <Button href={whatsappLink(sent.message)} target="_blank" rel="noopener noreferrer" variant="dark" size="lg" className="w-full">
          <WhatsAppIcon className="size-4" /> WhatsApp didn&apos;t open? Tap here
        </Button>
        <Button onClick={onDone} variant="light" size="lg" className="w-full">
          Done
        </Button>
      </footer>
    </>
  );
}
