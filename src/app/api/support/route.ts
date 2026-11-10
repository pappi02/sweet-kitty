// The website chat ("Kitty"). Same design as the Elite Masquerade concierge:
// the browser sends the conversation, Claude answers using tools that read the
// site's own data, and any buttons it offers come back as `actions`.
import Anthropic from "@anthropic-ai/sdk";
import { allow, clientIp } from "@/lib/payments/rate-limit";
import { site, whatsappLink } from "@/lib/site";
import { SUPPORT_SYSTEM } from "@/lib/support/prompt";
import { runTool, tools, type SupportAction } from "@/lib/support/tools";

export const maxDuration = 60;

const MODEL = "claude-opus-5-5";
const MAX_TURNS = 30;
const MAX_CHARS = 1500;
const MAX_TOOL_ROUNDS = 6;

type ChatTurn = { role: "user" | "assistant"; content: string };

function parseBody(body: unknown): ChatTurn[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_TURNS);
  const turns: ChatTurn[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (text) turns.push({ role, content: text });
  }
  // The conversation must start and end with the customer.
  while (turns[0]?.role === "assistant") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;
  return turns;
}

const reply = (text: string, actions: SupportAction[] = []) => Response.json({ reply: text, actions });
const team = (text: string) => reply(text, [{ type: "whatsapp", href: whatsappLink(`Hi ${site.name}! `), label: "Chat with the team on WhatsApp" }]);

export async function POST(req: Request) {
  // 20 messages per 5 minutes per visitor (per server instance).
  if (!allow(`support:${clientIp(req)}`, 20, 5 * 60_000)) {
    return reply("You're typing faster than I can keep up 😅 Give me a minute, then ask again.");
  }

  const turns = parseBody(await req.json().catch(() => null));
  if (!turns) return Response.json({ error: "Bad request" }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return team("I can't reply here right now, but the team is on WhatsApp and will help you straight away.");
  }

  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = turns.map((t) => ({ role: t.role, content: t.content }));
  const actions: SupportAction[] = [];

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const res = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 16000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "low" },
        system: [{ type: "text", text: SUPPORT_SYSTEM, cache_control: { type: "ephemeral" } }],
        tools,
        messages,
      });

      if (res.stop_reason === "refusal") {
        return reply("That's not something I can help with here. Anything about our rituals, your order or the mentorship?");
      }

      if (res.stop_reason === "tool_use") {
        messages.push({ role: "assistant", content: res.content });
        const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
        for (const block of res.content) {
          if (block.type !== "tool_use") continue;
          const input = block.input && typeof block.input === "object" ? (block.input as Record<string, unknown>) : {};
          const { result, action } = await runTool(block.name, input);
          if (action) actions.push(action);
          const failed = typeof result === "object" && result !== null && "error" in result;
          results.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(result), is_error: failed || undefined });
        }
        messages.push({ role: "user", content: results });
        continue;
      }

      const text = res.content
        .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n\n")
        .trim();
      return reply(text || "Anything else I can help you with?", dedupe(actions));
    }
    return team("Let me get the team to help you with this one. They're on WhatsApp.");
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return reply("It's a bit busy right now. Give me a minute and ask again?");
    if (error instanceof Anthropic.APIError) console.error("[support] API error", error.status, error.message);
    else console.error("[support] error", error);
    return team("Sorry, I lost that for a second. Ask me again, or reach the team on WhatsApp.");
  }
}

/** Keep the last button of each kind and target, at most three. */
function dedupe(list: SupportAction[]) {
  const map = new Map<string, SupportAction>();
  for (const a of list) map.set(a.type === "add" ? `a:${a.id}` : `${a.type}:${a.href}`, a);
  return [...map.values()].slice(-3);
}
