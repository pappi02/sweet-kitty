// Polled by the browser after an STK push until the customer pays, cancels or it times out.
import { isDarajaReady, paymentStatus } from "@/lib/payments/daraja";
import { allow, clientIp } from "@/lib/payments/rate-limit";

export async function POST(req: Request) {
  if (!isDarajaReady()) return Response.json({ error: "Payments are off." }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { checkoutId?: unknown } | null;
  const id = typeof body?.checkoutId === "string" ? body.checkoutId : "";
  if (!/^[\w-]{10,80}$/.test(id)) return Response.json({ error: "Bad request." }, { status: 400 });
  if (!allow(`status:${clientIp(req)}`, 60, 600_000)) return Response.json({ status: "pending", message: "Still checking…" });
  try {
    return Response.json(await paymentStatus(id));
  } catch (e) {
    console.error("[payments] status error", e);
    return Response.json({ status: "pending", message: "Still checking with M-Pesa…" });
  }
}
