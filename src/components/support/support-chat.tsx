"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { SupportAction } from "@/lib/support/tools";
import { site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { track } from "../analytics/analytics";
import { useCart } from "../cart/cart-provider";
import { CloseIcon, WhatsAppIcon } from "../ui/icons";
import { useDialog } from "../ui/use-dialog";

type Msg = { role: "user" | "assistant"; content: string; actions?: SupportAction[] };

const AGENT = { name: "Kitty", avatar: "/brand/chat-agent.webp" };

const GREETING: Msg = {
  role: "assistant",
  content: "Hi love 💗 I'm Kitty from Sweet Kitty. Ask me anything about our rituals, ordering and delivery, or the mentorship.",
};

const STARTERS = ["Which product is right for me?", "What's in the 7-Day Kit?", "How do delivery and payment work?", "Tell me about the mentorship"];

/** Replies shorter than this still show the typing dots for a beat, so answers don't land jarringly fast. */
const MIN_TYPING_MS = 700;

type Ctx = { open: (prompt?: string) => void };
const ChatContext = createContext<Ctx>({ open: () => {} });
export const useSupportChat = () => useContext(ChatContext);

/** Renders **bold**, paragraphs and simple "- " lists from plain-text replies. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i} className={cn(i > 0 && "mt-2")}>
          {para.split("\n").map((line, j) => (
            <span key={j} className={cn(j > 0 && "block", /^\s*[-•]\s/.test(line) && "block pl-3 -indent-3")}>
              {line
                .replace(/^\s*[-•]\s/, "• ")
                .split(/(\*\*[^*]+\*\*)/g)
                .map((part, k) => (part.startsWith("**") && part.endsWith("**") ? <strong key={k} className="font-semibold">{part.slice(2, -2)}</strong> : part))}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}

function ActionButton({ action, onClose }: { action: SupportAction; onClose: () => void }) {
  const { add, setOpen } = useCart();
  const [added, setAdded] = useState(false);
  const cls = "inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 py-2 text-left text-[13px] font-semibold transition-colors";

  if (action.type === "link") {
    return (
      <Link href={action.href} onClick={onClose} className={cn(cls, "bg-white text-burgundy ring-1 ring-burgundy/25 hover:bg-blush")}>
        {action.label} <span aria-hidden>→</span>
      </Link>
    );
  }
  if (action.type === "whatsapp") {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" className={cn(cls, "bg-white text-ink ring-1 ring-ink/15 hover:bg-mist")}>
        <WhatsAppIcon className="size-4 text-burgundy" /> {action.label}
      </a>
    );
  }
  if (added) {
    return (
      <button
        type="button"
        onClick={() => {
          onClose();
          setOpen(true);
        }}
        className={cn(cls, "bg-ink text-white hover:bg-ink-2")}
      >
        Added ✓ · View bag
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        add(action.id, action.qty);
        setOpen(false);
        setAdded(true);
        track("add_to_cart", { item_id: action.id, quantity: action.qty, source: "chat" });
      }}
      className={cn(cls, "bg-burgundy text-white hover:bg-burgundy-bright")}
    >
      {action.label}
    </button>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label={`${AGENT.name} is typing`}>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="size-2 rounded-full bg-burgundy" animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.16 }} />
      ))}
    </span>
  );
}

function Avatar({ size = 32, className }: { size?: number; className?: string }) {
  return <Image src={AGENT.avatar} alt="" width={size} height={size} className={cn("shrink-0 rounded-full", className)} style={{ width: size, height: size }} />;
}

function Panel({ onClose, seed, messages, setMessages }: { onClose: () => void; seed?: string; messages: Msg[]; setMessages: React.Dispatch<React.SetStateAction<Msg[]>> }) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sentSeed = useRef(false);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || busy) return;
      const next: Msg[] = [...messages, { role: "user", content }];
      setMessages(next);
      setInput("");
      setBusy(true);
      if (messages.length <= 1) track("chat_start", { source: "support" });
      const started = Date.now();
      let answer: Msg;
      try {
        const res = await fetch("/api/support", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
        });
        const data = (await res.json()) as { reply?: string; actions?: SupportAction[] };
        answer = { role: "assistant", content: data.reply ?? "Sorry, could you say that again?", actions: data.actions };
      } catch {
        answer = { role: "assistant", content: "The connection dropped for a second. Try again?" };
      }
      const wait = MIN_TYPING_MS - (Date.now() - started);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      setMessages((m) => [...m, answer]);
      setBusy(false);
    },
    [busy, messages, setMessages],
  );

  useEffect(() => {
    if (seed && !sentSeed.current) {
      sentSeed.current = true;
      void send(seed);
    }
  }, [seed, send]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="tone-dark relative flex items-center gap-3 bg-linear-to-br from-burgundy-bright via-burgundy to-ink-2 px-4 py-3.5 text-white">
        <span className="relative">
          <Avatar size={44} className="ring-2 ring-rose/70" />
          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-400 ring-2 ring-burgundy" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl leading-tight">{AGENT.name}</p>
          <p className="text-xs text-white/80">Sweet Kitty care · online now</p>
        </div>
        <a href={whatsappLink(`Hi ${site.name}! `)} target="_blank" rel="noopener noreferrer" className="grid size-10 place-items-center rounded-full text-white transition hover:bg-white/10" aria-label="Talk to the team on WhatsApp" title="Talk to the team on WhatsApp">
          <WhatsAppIcon className="size-5" />
        </a>
        <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full text-white transition hover:bg-white/10" aria-label="Close chat">
          <CloseIcon className="size-5" />
        </button>
      </div>

      {/* Conversation */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(120%_60%_at_100%_0%,#fddff5,transparent_60%)] bg-cream px-4 py-4" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "items-end")}>
            {m.role === "assistant" && <Avatar size={28} />}
            <div className={cn("flex max-w-[82%] flex-col", m.role === "user" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "px-3.5 py-2.5 text-[15px] leading-relaxed",
                  m.role === "user" ? "rounded-2xl rounded-br-md bg-burgundy text-white" : "rounded-2xl rounded-bl-md bg-white text-ink shadow-[0_6px_20px_-12px_rgba(51,4,18,0.35)] ring-1 ring-ink/5",
                )}
              >
                <RichText text={m.content} />
              </div>
              {m.actions && m.actions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.actions.map((a, j) => (
                    <ActionButton key={j} action={a} onClose={onClose} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex items-end gap-2">
            <Avatar size={28} />
            <div className="rounded-2xl rounded-bl-md bg-white px-4 py-2.5 ring-1 ring-ink/5">
              <TypingDots />
            </div>
          </div>
        )}

        {messages.length === 1 && !busy && (
          <div className="flex flex-wrap gap-2 pl-9 pt-1">
            {STARTERS.map((s) => (
              <button key={s} type="button" onClick={() => send(s)} className="rounded-full bg-white px-3.5 py-2 text-[13px] font-medium text-burgundy ring-1 ring-burgundy/20 transition hover:bg-blush">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="border-t border-ink/8 bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
      >
        <div className="flex items-end gap-2 rounded-3xl bg-mist px-3 py-1.5 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-burgundy/60">
          <textarea
            ref={inputRef}
            data-autofocus
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 1500))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder="Type a message…"
            aria-label={`Message ${AGENT.name}`}
            className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-base text-ink placeholder:text-ink/45 focus:outline-none [field-sizing:content]"
          />
          <button type="submit" disabled={busy || !input.trim()} className="mb-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-burgundy text-white transition hover:bg-burgundy-bright disabled:opacity-30" aria-label="Send">
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
              <path d="M2.5 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-ink/50">We&apos;ll never ask for your M-Pesa PIN in chat.</p>
      </form>
    </div>
  );
}

export function SupportChatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; seed?: string }>({ open: false });
  // The conversation lives here, so closing the window or changing page keeps it.
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const open = useCallback((prompt?: string) => setState({ open: true, seed: prompt }), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false, seed: undefined })), []);
  const ctx = useMemo(() => ({ open }), [open]);
  const root = useRef<HTMLDivElement>(null);
  useDialog(root, state.open, close);

  return (
    <ChatContext.Provider value={ctx}>
      {children}

      {/* Launcher: sits above the phone buy bar. */}
      <motion.button
        type="button"
        onClick={() => open()}
        initial={{ scale: 0, opacity: 0 }}
        animate={state.open ? { scale: 0.6, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 24, delay: state.open ? 0 : 0.4 }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        className={cn("group fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-3 z-40 size-16 rounded-full drop-shadow-[0_12px_24px_rgba(115,6,44,0.45)] sm:right-5 lg:bottom-6 lg:size-[4.5rem]", state.open && "pointer-events-none")}
        aria-label={`Chat with ${AGENT.name}`}
      >
        <span className="absolute inset-1 -z-10 animate-ping rounded-full bg-rose/40 [animation-duration:2.6s]" aria-hidden />
        <Image src="/brand/chat-badge.webp" alt="" width={144} height={144} className="h-full w-full" />
        <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-burgundy opacity-0 shadow-md ring-1 ring-burgundy/15 transition-opacity group-hover:opacity-100 lg:block">
          Chat with {AGENT.name}
        </span>
      </motion.button>

      <AnimatePresence>
        {state.open && (
          <>
            <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[84] bg-ink/30 backdrop-blur-[1px] lg:bg-transparent lg:backdrop-blur-none" onClick={close} aria-hidden />
            <motion.div
              key="panel"
              ref={root}
              role="dialog"
              aria-modal="true"
              aria-label={`Chat with ${AGENT.name}`}
              tabIndex={-1}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[85] flex flex-col overflow-hidden bg-cream outline-none lg:inset-auto lg:bottom-6 lg:right-6 lg:h-[min(640px,calc(100svh-3rem))] lg:w-[400px] lg:origin-bottom-right lg:rounded-3xl lg:shadow-[0_40px_100px_-30px_rgba(51,4,18,0.6)] lg:ring-1 lg:ring-ink/10"
            >
              <Panel onClose={close} seed={state.seed} messages={messages} setMessages={setMessages} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ChatContext.Provider>
  );
}

/** A button anywhere on the site that opens the chat, optionally with a question already asked. */
export function ChatButton({ prompt, children, className }: { prompt?: string; children: ReactNode; className?: string }) {
  const { open } = useSupportChat();
  return (
    <button type="button" onClick={() => open(prompt)} className={className}>
      {children}
    </button>
  );
}
