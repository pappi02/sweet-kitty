// Safaricom posts the result of every STK push here. The secret token in the URL
// (DARAJA_CALLBACK_TOKEN) keeps strangers from posting fake results, and nothing is
// treated as paid on the callback's word alone: the status check also asks Daraja.
import { describeResult, rememberResult, validCallbackToken } from "@/lib/payments/daraja";

type Item = { Name: string; Value?: string | number };
type Callback = {
  Body?: {
    stkCallback?: {
      CheckoutRequestID?: string;
      ResultCode?: number | string;
      ResultDesc?: string;
      CallbackMetadata?: { Item?: Item[] };
    };
  };
};

const accepted = () => Response.json({ ResultCode: 0, ResultDesc: "Accepted" });

export async function POST(req: Request, ctx: RouteContext<"/api/payments/hook/[token]">) {
  const { token } = await ctx.params;
  if (!validCallbackToken(token)) return new Response(null, { status: 404 });

  const body = (await req.json().catch(() => null)) as Callback | null;
  const cb = body?.Body?.stkCallback;
  if (!cb?.CheckoutRequestID || cb.ResultCode === undefined) return accepted();

  const meta = Object.fromEntries((cb.CallbackMetadata?.Item ?? []).map((i) => [i.Name, i.Value]));
  const result = describeResult(cb.ResultCode, cb.ResultDesc);
  const receipt = meta.MpesaReceiptNumber ? String(meta.MpesaReceiptNumber) : undefined;
  rememberResult(cb.CheckoutRequestID, { ...result, receipt });

  // Shows up in the hosting logs. The phone number is masked.
  const phone = meta.PhoneNumber ? String(meta.PhoneNumber).replace(/^(\d{6})\d+(\d{2})$/, "$1****$2") : undefined;
  console.info("[payments] M-Pesa result", {
    checkoutId: cb.CheckoutRequestID,
    status: result.status,
    code: cb.ResultCode,
    amount: meta.Amount,
    receipt,
    phone,
  });
  return accepted();
}
