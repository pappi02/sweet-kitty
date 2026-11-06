// Safaricom Daraja (M-Pesa Express / STK Push). Server only: imported by the route
// handlers in app/api/payments and never by a client component, so the keys below
// stay on the server.
//
// Everything comes from environment variables (see .env.example). Until the four
// required ones are set, isDarajaReady() is false and the site falls back to
// "we'll send the payment details on WhatsApp".
import { createHash, timingSafeEqual } from "node:crypto";

const env = (k: string) => (process.env[k] ?? "").trim();

export function darajaConfig() {
  const live = env("DARAJA_ENV") === "production";
  const shortcode = env("DARAJA_SHORTCODE");
  const buyGoods = env("DARAJA_TYPE") === "till";
  return {
    live,
    base: live ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke",
    key: env("DARAJA_CONSUMER_KEY"),
    secret: env("DARAJA_CONSUMER_SECRET"),
    passkey: env("DARAJA_PASSKEY"),
    /** Paybill number, or for a till the head-office (store) number. */
    shortcode,
    type: buyGoods ? ("CustomerBuyGoodsOnline" as const) : ("CustomerPayBillOnline" as const),
    /** Who receives the money: the till number for Buy Goods, else the paybill. */
    partyB: (buyGoods && env("DARAJA_TILL")) || shortcode,
    /** Public https address of the site, e.g. https://mysweetkitty.com */
    siteUrl: env("DARAJA_CALLBACK_BASE") || env("NEXT_PUBLIC_SITE_URL"),
    callbackToken: env("DARAJA_CALLBACK_TOKEN"),
  };
}

export function isDarajaReady() {
  const c = darajaConfig();
  return Boolean(c.key && c.secret && c.passkey && c.shortcode && c.siteUrl.startsWith("https://") && c.callbackToken.length >= 16);
}

/* ---------- auth ---------- */

let token: { value: string; expires: number } | null = null;

async function accessToken() {
  if (token && token.expires > Date.now()) return token.value;
  const c = darajaConfig();
  const res = await fetch(`${c.base}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${Buffer.from(`${c.key}:${c.secret}`).toString("base64")}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Daraja auth failed (${res.status})`);
  const data = (await res.json()) as { access_token: string; expires_in: string | number };
  // Refresh a minute early so a token never expires mid-request.
  token = { value: data.access_token, expires: Date.now() + (Number(data.expires_in) - 60) * 1000 };
  return token.value;
}

/** Daraja wants Kenyan time as YYYYMMDDHHmmss. */
function timestamp() {
  return new Date(Date.now() + 3 * 3600_000).toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
}

function password(ts: string) {
  const c = darajaConfig();
  return Buffer.from(`${c.shortcode}${c.passkey}${ts}`).toString("base64");
}

async function post<T>(path: string, body: object): Promise<{ ok: boolean; status: number; data: T }> {
  const c = darajaConfig();
  const res = await fetch(`${c.base}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (res.status === 401) token = null;
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, data };
}

/* ---------- STK push ---------- */

/** "0712 345 678" / "+254712345678" -> "254712345678" */
export function toMsisdn(phone: string): string | null {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("254")) d = d.slice(3);
  else if (d.startsWith("0")) d = d.slice(1);
  return /^[71]\d{8}$/.test(d) ? `254${d}` : null;
}

export function callbackUrl() {
  const c = darajaConfig();
  return `${c.siteUrl.replace(/\/$/, "")}/api/payments/hook/${c.callbackToken}`;
}

export async function stkPush({ msisdn, amount, reference }: { msisdn: string; amount: number; reference: string }) {
  const c = darajaConfig();
  const ts = timestamp();
  const { ok, data } = await post<{
    ResponseCode?: string;
    CheckoutRequestID?: string;
    CustomerMessage?: string;
    errorMessage?: string;
  }>("/mpesa/stkpush/v1/processrequest", {
    BusinessShortCode: c.shortcode,
    Password: password(ts),
    Timestamp: ts,
    TransactionType: c.type,
    Amount: amount,
    PartyA: msisdn,
    PartyB: c.partyB,
    PhoneNumber: msisdn,
    CallBackURL: callbackUrl(),
    AccountReference: reference.slice(0, 12),
    TransactionDesc: "Sweet Kitty",
  });
  if (!ok || data.ResponseCode !== "0" || !data.CheckoutRequestID) {
    console.error("[payments] STK push refused", { reference, error: data.errorMessage ?? data });
    return null;
  }
  return { checkoutId: data.CheckoutRequestID };
}

/* ---------- status ---------- */

export type PayStatus = "pending" | "paid" | "cancelled" | "failed";
export type PayResult = { status: PayStatus; message: string; receipt?: string };

/** What each Daraja result code means for the customer. */
export function describeResult(code: string | number, fallback = ""): PayResult {
  switch (String(code)) {
    case "0":
      return { status: "paid", message: "Payment received. Thank you!" };
    case "1032":
      return { status: "cancelled", message: "You cancelled the M-Pesa request." };
    case "1037":
    case "1019":
      return { status: "failed", message: "The request timed out on your phone. Make sure it's on and unlocked, then try again." };
    case "1":
      return { status: "failed", message: "Your M-Pesa balance wasn't enough for this payment." };
    case "2001":
      return { status: "failed", message: "The M-Pesa PIN was wrong. Please try again." };
    case "1001":
      return { status: "failed", message: "Another M-Pesa request is open on your phone. Finish or cancel it, then try again." };
    default:
      return { status: "failed", message: fallback || "M-Pesa couldn't complete the payment. Please try again." };
  }
}

// Results Safaricom has posted to our callback, kept briefly so the status check can
// answer without another API call (and with the receipt number). On serverless hosts
// each instance has its own copy, so the status check falls back to stkQuery().
const results = new Map<string, PayResult & { at: number }>();

export function rememberResult(checkoutId: string, r: PayResult) {
  const cutoff = Date.now() - 30 * 60_000;
  for (const [k, v] of results) if (v.at < cutoff) results.delete(k);
  results.set(checkoutId, { ...r, at: Date.now() });
}

export async function paymentStatus(checkoutId: string): Promise<PayResult> {
  const known = results.get(checkoutId);
  if (known) return { status: known.status, message: known.message, receipt: known.receipt };

  const c = darajaConfig();
  const ts = timestamp();
  const { data } = await post<{ ResultCode?: string; ResultDesc?: string; errorCode?: string; errorMessage?: string }>("/mpesa/stkpushquery/v1/query", {
    BusinessShortCode: c.shortcode,
    Password: password(ts),
    Timestamp: ts,
    CheckoutRequestID: checkoutId,
  });
  // Daraja can answer with a result code (e.g. 4999) that only means "still waiting".
  const stillWaiting = String(data.ResultCode) === "4999" || /under processing|being processed/i.test(data.ResultDesc ?? "");
  if (data.ResultCode !== undefined && !stillWaiting) return describeResult(data.ResultCode, data.ResultDesc);
  // "500.001.1001: The transaction is being processed", rate limits and other
  // hiccups all mean "ask again shortly".
  return { status: "pending", message: "Waiting for you to enter your M-Pesa PIN…" };
}

/** Constant-time check of the secret in the callback URL. */
export function validCallbackToken(given: string) {
  const want = darajaConfig().callbackToken;
  if (!want) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(want).digest();
  return timingSafeEqual(a, b);
}
