// Starts an M-Pesa payment: Safaricom sends the "enter your PIN" prompt to the phone.
// The amount is worked out here from our own prices, never taken from the browser,
// except for a payment link (/pay) where the shop has set the amount itself.
import { isDarajaReady, stkPush, toMsisdn } from "@/lib/payments/daraja";
import { allow, clientIp } from "@/lib/payments/rate-limit";
import { MAX_ORDER_QTY } from "@/lib/order";
import { getProduct } from "@/lib/products";

const REF = /^SK-[A-Z0-9]{4,10}$/;
const MAX_AMOUNT = 250_000; // M-Pesa's per-transaction limit

type Body = { phone?: unknown; reference?: unknown; items?: unknown; amount?: unknown };

function priceItems(items: unknown): number | null {
  if (!Array.isArray(items) || items.length === 0 || items.length > 20) return null;
  let total = 0;
  for (const it of items as { id?: unknown; qty?: unknown }[]) {
    const p = typeof it?.id === "string" ? getProduct(it.id) : undefined;
    const qty = Number(it?.qty);
    if (!p?.active || p.price == null || !Number.isInteger(qty) || qty < 1 || qty > MAX_ORDER_QTY) return null;
    total += p.price * qty;
  }
  return total;
}

const fail = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(req: Request) {
  if (!isDarajaReady()) return fail("M-Pesa payments aren't switched on yet. We'll send payment details on WhatsApp.", 503);

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body) return fail("Bad request.");

  const msisdn = typeof body.phone === "string" ? toMsisdn(body.phone) : null;
  if (!msisdn) return fail("Enter a Safaricom number, e.g. 0712 345 678.");

  const reference = typeof body.reference === "string" ? body.reference.trim().toUpperCase() : "";
  if (!REF.test(reference)) return fail("Missing order reference.");

  let amount: number | null;
  if (body.items !== undefined) amount = priceItems(body.items);
  else {
    const n = Number(body.amount);
    amount = Number.isInteger(n) && n >= 1 && n <= MAX_AMOUNT ? n : null;
  }
  if (!amount || amount > MAX_AMOUNT) return fail("That amount can't be paid by M-Pesa.");

  // At most 3 prompts per phone and 8 per visitor every 10 minutes.
  if (!allow(`phone:${msisdn}`, 3, 600_000) || !allow(`ip:${clientIp(req)}`, 8, 600_000)) {
    return fail("Too many payment requests. Please wait a few minutes and try again.", 429);
  }

  try {
    const res = await stkPush({ msisdn, amount, reference });
    if (!res) return fail("M-Pesa didn't accept the request. Check the number and try again.", 502);
    return Response.json({ checkoutId: res.checkoutId, amount });
  } catch (e) {
    console.error("[payments] STK push error", e);
    return fail("We couldn't reach M-Pesa just now. Please try again.", 502);
  }
}
