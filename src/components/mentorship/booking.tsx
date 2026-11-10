"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useId, useRef, useState, type ReactNode } from "react";
import type { MentorshipView, ProgrammeView } from "@/lib/mentorship/view";
import { normalizePhone, orderRef } from "@/lib/order";
import { site, whatsappLink } from "@/lib/site";
import { cn, formatKES } from "@/lib/utils";
import { track } from "../analytics/analytics";
import { MpesaPay } from "../payments/mpesa-pay";
import { Button } from "../ui/button";
import { CheckIcon, CloseIcon, WhatsAppIcon } from "../ui/icons";
import { useDialog } from "../ui/use-dialog";

type Ctx = { book: (programmeId?: string) => void };
const BookingContext = createContext<Ctx | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}

type Booking = MentorshipView["booking"] & { payEnabled: boolean; programmes: ProgrammeView[] };

export function BookingProvider({ booking, children }: { booking: Booking; children: ReactNode }) {
  const [state, setState] = useState<{ programmeId: string } | null>(null);
  const book = useCallback(
    (programmeId?: string) => {
      const id = programmeId ?? booking.programmes[0]?.id ?? "";
      track("begin_checkout", { item_category: "mentorship", item_id: id });
      setState({ programmeId: id });
    },
    [booking.programmes],
  );
  return (
    <BookingContext.Provider value={{ book }}>
      {children}
      <AnimatePresence>{state && <BookingSheet key="booking" booking={booking} initial={state.programmeId} onClose={() => setState(null)} />}</AnimatePresence>
    </BookingContext.Provider>
  );
}

type Details = { programmeId: string; name: string; phone: string; format: string; times: string; focus: string };
type Step = "details" | "pay" | "paid";

const priceLabel = (p: ProgrammeView) => (p.price ? formatKES(p.price) : "Price on request");

function bookingMessage(ref: string, p: ProgrammeView | undefined, d: Details, receipt?: string, paid = false) {
  return [
    `Hi ${site.name}! I'd like to book a mentorship session.`,
    `Booking ref: ${ref}`,
    "",
    `Programme: ${p ? `${p.name} (${p.ages}), ${priceLabel(p)}` : "Not sure yet"}`,
    ...(paid ? [`Paid by M-Pesa${receipt ? `, receipt ${receipt}` : ""}`] : []),
    `Name: ${d.name.trim()}`,
    `WhatsApp: ${normalizePhone(d.phone) ?? d.phone.trim()}`,
    `Session: ${d.format}`,
    ...(d.times.trim() ? [`Best days and times: ${d.times.trim()}`] : []),
    ...(d.focus.trim() ? [`I'd like to work on: ${d.focus.trim()}`] : []),
    "",
    paid ? "Please confirm my date and time." : "Please send me the payment details and my date and time.",
  ].join("\n");
}

function BookingSheet({ booking, initial, onClose }: { booking: Booking; initial: string; onClose: () => void }) {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  useDialog(root, true, onClose);

  const [ref] = useState(orderRef);
  const [step, setStep] = useState<Step>("details");
  const [receipt, setReceipt] = useState<string | undefined>();
  const [errors, setErrors] = useState<Partial<Record<"name" | "phone", string>>>({});
  const [d, setD] = useState<Details>({ programmeId: initial, name: "", phone: "", format: booking.formats[0] ?? "", times: "", focus: "" });
  const set = <K extends keyof Details>(k: K, v: Details[K]) => setD((prev) => ({ ...prev, [k]: v }));

  const programme = booking.programmes.find((p) => p.id === d.programmeId);
  const canPay = booking.payEnabled && Boolean(programme?.price);

  function next() {
    const e: typeof errors = {};
    if (d.name.trim().length < 2) e.name = "Please tell us your name.";
    if (!normalizePhone(d.phone)) e.phone = "Enter your WhatsApp number, e.g. 0712 345 678.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep("pay");
  }

  const field = "mt-1.5 h-12 w-full rounded-[2px] bg-white px-3.5 text-base text-ink ring-1 ring-ink/15 outline-none transition placeholder:text-ink/45 focus:ring-2 focus:ring-burgundy aria-invalid:ring-2 aria-invalid:ring-burgundy-bright";
  const label = "text-xs font-bold uppercase tracking-[0.14em] text-ink/70";

  return (
    <motion.div className="fixed inset-0 z-90 flex items-end justify-end lg:items-stretch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={onClose} aria-label="Close booking" tabIndex={-1} />
      <motion.div
        ref={root}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        tabIndex={-1}
        initial={{ y: 40, x: 0, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 36 }}
        className="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-2xl bg-cream text-ink shadow-[0_-30px_80px_-30px_rgba(51,4,18,0.6)] outline-none lg:max-h-none lg:w-[480px] lg:rounded-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-6 pb-4 pt-5">
          <div>
            <p className="font-display text-sm italic text-accent">The Sweet Kitty Mentorship</p>
            <h2 id={`${uid}-title`} className="mt-1 font-display text-[1.75rem] leading-tight">
              {step === "paid" ? "You're booked in." : booking.title}
            </h2>
          </div>
          <button onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-ink/15 transition hover:bg-ink hover:text-white" aria-label="Close">
            <CloseIcon className="size-5" />
          </button>
        </div>

        <ol className="flex gap-1.5 px-6 pt-4" aria-label="Booking steps">
          {(["Your details", canPay ? "Payment" : "Send request", "Confirmed"] as const).map((s, i) => {
            const at = step === "details" ? 0 : step === "pay" ? 1 : 2;
            return (
              <li key={s} className="flex-1">
                <span className={cn("block h-[3px] rounded-full", i <= at ? "bg-burgundy" : "bg-ink/10")} />
                <span className={cn("mt-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em]", i === at ? "text-ink" : "text-ink/50")}>{s}</span>
              </li>
            );
          })}
        </ol>

        <div className="flex-1 overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
          {step === "details" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
              noValidate
              className="space-y-5"
            >
              <p className="text-sm leading-relaxed text-ink/75">{booking.intro}</p>

              <fieldset>
                <legend className={label}>Programme</legend>
                <div className="mt-2 grid gap-2">
                  {booking.programmes.map((p) => {
                    const active = p.id === d.programmeId;
                    return (
                      <label
                        key={p.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-[2px] bg-white px-3.5 py-3 ring-1 transition",
                          active ? "ring-2 ring-burgundy" : "ring-ink/12 hover:ring-ink/30",
                        )}
                      >
                        <input type="radio" name={`${uid}-programme`} value={p.id} checked={active} onChange={() => set("programmeId", p.id)} className="sr-only" />
                        <span className={cn("grid size-5 shrink-0 place-items-center rounded-full ring-1", active ? "bg-burgundy text-white ring-burgundy" : "ring-ink/25")}>
                          {active && <CheckIcon className="size-3" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-lg leading-tight">
                            {p.name} <span className="text-sm not-italic text-ink/60">· {p.ages}</span>
                          </span>
                          <span className="block truncate text-xs text-ink/65">{p.sessions}</span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold tabular-nums">{priceLabel(p)}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor={`${uid}-name`} className={label}>
                  Your name
                </label>
                <input id={`${uid}-name`} data-autofocus value={d.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" maxLength={80} aria-invalid={errors.name ? true : undefined} className={field} placeholder="First and last name" />
                {errors.name && <p className="mt-1 text-xs font-semibold text-burgundy-bright" role="alert">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor={`${uid}-phone`} className={label}>
                  WhatsApp number
                </label>
                <input id={`${uid}-phone`} type="tel" inputMode="tel" autoComplete="tel" value={d.phone} onChange={(e) => set("phone", e.target.value)} maxLength={20} aria-invalid={errors.phone ? true : undefined} className={field} placeholder="0712 345 678" />
                <p className={cn("mt-1 text-xs", errors.phone ? "font-semibold text-burgundy-bright" : "text-ink/60")} role={errors.phone ? "alert" : undefined}>
                  {errors.phone ?? "We confirm your date and time here."}
                </p>
              </div>

              <fieldset>
                <legend className={label}>Session</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {booking.formats.map((f) => (
                    <label key={f} className={cn("cursor-pointer rounded-full px-4 py-2 text-sm font-medium ring-1 transition", d.format === f ? "bg-burgundy text-white ring-burgundy" : "bg-white ring-ink/15 hover:ring-ink/35")}>
                      <input type="radio" name={`${uid}-format`} value={f} checked={d.format === f} onChange={() => set("format", f)} className="sr-only" />
                      {f}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor={`${uid}-times`} className={label}>
                  Best days and times <span className="font-medium normal-case tracking-normal text-ink/50">(optional)</span>
                </label>
                <input id={`${uid}-times`} value={d.times} onChange={(e) => set("times", e.target.value)} maxLength={120} className={field} placeholder="e.g. weekday evenings, Saturday morning" />
              </div>

              <div>
                <label htmlFor={`${uid}-focus`} className={label}>
                  What would you like to work on? <span className="font-medium normal-case tracking-normal text-ink/50">(optional)</span>
                </label>
                <textarea id={`${uid}-focus`} value={d.focus} onChange={(e) => set("focus", e.target.value)} maxLength={400} rows={3} className={cn(field, "h-auto py-3")} placeholder="A sentence is enough. You can share the rest in your session." />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Continue
              </Button>
              <p className="text-center text-xs text-ink/60">Private and confidential. We never share your details.</p>
            </form>
          )}

          {step === "pay" && programme && (
            <div className="space-y-5">
              <Summary programme={programme} d={d} reference={ref} onEdit={() => setStep("details")} />
              {canPay ? (
                <>
                  <MpesaPay
                    reference={ref}
                    amount={programme.price!}
                    defaultPhone={normalizePhone(d.phone) ?? ""}
                    payload={{ programme: programme.id }}
                    paidNote="Next, send us your details on WhatsApp."
                    onPaid={(r) => {
                      setReceipt(r);
                      setStep("paid");
                    }}
                  />
                  <p className="text-center text-xs text-ink/60">
                    Rather pay another way?{" "}
                    <a href={whatsappLink(bookingMessage(ref, programme, d))} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline underline-offset-4">
                      Book on WhatsApp instead
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-ink/75">Send your request on WhatsApp. We&apos;ll reply with how to pay and your exact date and time.</p>
                  <Button href={whatsappLink(bookingMessage(ref, programme, d))} target="_blank" rel="noopener noreferrer" size="lg" className="w-full" onClick={() => track("generate_lead", { item_category: "mentorship", item_id: programme.id })}>
                    <WhatsAppIcon className="size-4" /> Send booking request
                  </Button>
                </>
              )}
            </div>
          )}

          {step === "paid" && programme && (
            <div className="space-y-5">
              <div className="flex gap-3 rounded-sm bg-white p-5 ring-1 ring-ink/10">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-burgundy text-white">
                  <CheckIcon className="size-5" />
                </span>
                <div>
                  <p className="font-display text-xl leading-tight">
                    {programme.name}, {priceLabel(programme)}, paid.
                  </p>
                  <p className="mt-1 text-sm text-ink/75">
                    Reference <span className="font-semibold tabular-nums">{ref}</span>
                    {receipt && (
                      <>
                        {" "}
                        · M-Pesa <span className="font-semibold tabular-nums">{receipt}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-ink/75">{booking.afterPayment}</p>
              <Button href={whatsappLink(bookingMessage(ref, programme, d, receipt, true))} target="_blank" rel="noopener noreferrer" size="lg" className="w-full">
                <WhatsAppIcon className="size-4" /> Send my details on WhatsApp
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Summary({ programme, d, reference, onEdit }: { programme: ProgrammeView; d: Details; reference: string; onEdit: () => void }) {
  return (
    <div className="rounded-sm bg-white p-5 ring-1 ring-ink/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/60">Your booking · {reference}</p>
          <p className="mt-1 font-display text-2xl leading-tight">
            {programme.name} <span className="text-base text-ink/60">· {programme.ages}</span>
          </p>
        </div>
        <button onClick={onEdit} className="text-sm font-semibold underline underline-offset-4">
          Edit
        </button>
      </div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-ink/60">Name</dt>
        <dd className="font-medium">{d.name.trim()}</dd>
        <dt className="text-ink/60">WhatsApp</dt>
        <dd className="font-medium tabular-nums">{normalizePhone(d.phone)}</dd>
        <dt className="text-ink/60">Session</dt>
        <dd className="font-medium">{d.format}</dd>
        <dt className="text-ink/60">Total</dt>
        <dd className="font-semibold tabular-nums">{priceLabel(programme)}</dd>
      </dl>
    </div>
  );
}
