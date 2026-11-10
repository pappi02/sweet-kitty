// Tools the chat agent can call. Every fact comes from the site's own data, so the
// agent never has to guess, and button "actions" are passed back to the chat UI.
import type Anthropic from "@anthropic-ai/sdk";
import { allFaqs } from "../content";
import { getLegalPage, healthNote } from "../legal";
import { getMentorship } from "../mentorship/data";
import { products, productHref } from "../products";
import { site, whatsappLink } from "../site";

/** Something the chat UI renders as a button under a reply. */
export type SupportAction =
  | { type: "add"; id: string; qty: number; label: string }
  | { type: "link"; href: string; label: string }
  | { type: "whatsapp"; href: string; label: string };

const PAGES = ["/shop", "/the-kit", "/ritual", "/stories", "/mentorship", "/mentorship#programmes", "/faq", "/contact", "/delivery", "/returns", "/about"] as const;

export const tools: Anthropic.Beta.BetaTool[] = [
  {
    name: "get_products",
    description: "Every product on sale: id, name, price (KES), size, what it's for, benefits, how to use it, and what the 7-Day Kit includes. Use for any product, price or 'which one is for me' question.",
    input_schema: {
      type: "object",
      properties: { category: { type: "string", enum: ["kit", "body", "intimate", "drink", "bath", "treats"], description: "Optional filter." } },
      additionalProperties: false,
    },
  },
  {
    name: "get_policies",
    description: "How ordering, M-Pesa payment, delivery, discreet packaging and returns work, frequently asked questions, and the health note.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_mentorship",
    description: "The Sweet Kitty Mentorship: programmes by age group with prices and what they cover, the focus areas, how booking works, and its FAQ.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "offer_add_to_bag",
    description: "Show an 'Add to bag' button for a product under your reply. Use once she has chosen. It doesn't order or charge anything.",
    input_schema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "id from get_products" },
        qty: { type: "integer", minimum: 1, maximum: 10 },
      },
      required: ["product_id"],
      additionalProperties: false,
    },
  },
  {
    name: "offer_link",
    description: "Show a button that opens a page of this site. For a product page, pass product_id instead of page.",
    input_schema: {
      type: "object",
      properties: {
        page: { type: "string", enum: [...PAGES] },
        product_id: { type: "string" },
        label: { type: "string", description: "Short button text, e.g. 'See the 7-Day Kit'" },
      },
      required: ["label"],
      additionalProperties: false,
    },
  },
  {
    name: "offer_whatsapp",
    description: "Show a button that opens WhatsApp with the Sweet Kitty team, with a short message already written. Use for anything the team must handle, or when she wants a person.",
    input_schema: {
      type: "object",
      properties: { summary: { type: "string", description: "One line written as the customer, e.g. 'I'd like to check on my order SK-7K2Q9F.'" } },
      required: ["summary"],
      additionalProperties: false,
    },
  },
];

type Input = Record<string, unknown>;
const legal = (slug: "delivery" | "returns") => getLegalPage(slug).sections.map((s) => ({ topic: s.heading, details: s.body.join(" ") }));

/** Runs one tool. Returns the JSON for the model and, optionally, a button for the UI. */
export async function runTool(name: string, input: Input): Promise<{ result: unknown; action?: SupportAction }> {
  switch (name) {
    case "get_products": {
      const list = products.filter((p) => p.active && (!input.category || p.category === input.category));
      return {
        result: list.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price_kes: p.price,
          size: p.size,
          tagline: p.tagline,
          description: p.description,
          benefits: p.benefits,
          how_to_use: p.howToUse,
          includes: p.includes,
        })),
      };
    }
    case "get_policies":
      return {
        result: {
          faqs: allFaqs,
          delivery: legal("delivery"),
          returns: legal("returns"),
          health_note: healthNote,
          whatsapp: site.phone,
        },
      };
    case "get_mentorship": {
      const m = await getMentorship();
      return {
        result: {
          about: m.hero.intro,
          programmes: m.programmes.items.map((p) => ({ name: p.name, ages: p.ages, price_kes: p.price, sessions: p.sessions, format: p.format, covers: p.focus })),
          note: m.programmes.note,
          focus_areas: m.pillars.items.map((p) => ({ title: p.title, about: p.text })),
          how_booking_works: m.steps.items,
          faq: m.faq.items,
          disclaimer: m.disclaimer,
        },
      };
    }
    case "offer_add_to_bag": {
      const p = products.find((x) => x.id === input.product_id && x.active);
      if (!p || p.price == null) return { result: { error: "Unknown or unavailable product_id. Call get_products." } };
      const qty = Math.min(10, Math.max(1, Number(input.qty) || 1));
      return { result: { ok: true }, action: { type: "add", id: p.id, qty, label: `Add ${qty > 1 ? `${qty} × ` : ""}${p.shortName} to bag` } };
    }
    case "offer_link": {
      const label = String(input.label ?? "Open").slice(0, 40);
      if (input.product_id) {
        const p = products.find((x) => x.id === input.product_id && x.active);
        if (!p) return { result: { error: "Unknown product_id." } };
        return { result: { ok: true }, action: { type: "link", href: productHref(p), label } };
      }
      const page = String(input.page);
      if (!(PAGES as readonly string[]).includes(page)) return { result: { error: "Unknown page." } };
      return { result: { ok: true }, action: { type: "link", href: page, label } };
    }
    case "offer_whatsapp": {
      const summary = String(input.summary ?? "").replace(/\s+/g, " ").trim().slice(0, 300);
      return { result: { ok: true }, action: { type: "whatsapp", href: whatsappLink(`Hi ${site.name}! ${summary}`), label: "Chat with the team on WhatsApp" } };
    }
    default:
      return { result: { error: `Unknown tool ${name}` } };
  }
}
