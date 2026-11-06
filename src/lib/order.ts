// Order form helpers: delivery zones, phone checks and the WhatsApp order message.
// There is no fixed delivery fee: it depends on the exact location and is
// confirmed with the customer on WhatsApp.
import { site } from "./site";
import { formatKES } from "./utils";

export const deliveryZones = [
  { id: "nairobi-cbd", label: "Nairobi CBD", short: "Nairobi CBD" },
  { id: "nairobi", label: "Nairobi (outside CBD)", short: "Nairobi" },
  { id: "near-nairobi", label: "Near Nairobi (Kiambu, Ruiru, Thika, Kitengela, Rongai, Syokimau…)", short: "Near Nairobi" },
  { id: "kenya", label: "Elsewhere in Kenya (courier)", short: "Courier" },
] as const;

export type ZoneId = (typeof deliveryZones)[number]["id"];

export type OrderDetails = {
  name: string;
  phone: string;
  zone: ZoneId | "";
  location: string;
  notes: string;
  gift: boolean;
};

export const emptyDetails: OrderDetails = { name: "", phone: "", zone: "", location: "", notes: "", gift: false };

/** Kenyan mobile number in any common form -> "0712 345 678", or null if it isn't one. */
export function normalizePhone(input: string): string | null {
  let d = input.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("254")) d = "0" + d.slice(3);
  if (/^[71]\d{8}$/.test(d)) d = "0" + d;
  if (!/^0[71]\d{8}$/.test(d)) return null;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}

export type FieldErrors = Partial<Record<"name" | "phone" | "zone" | "location", string>>;

export function validate(d: OrderDetails): FieldErrors {
  const e: FieldErrors = {};
  if (d.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!normalizePhone(d.phone)) e.phone = "Enter a Kenyan mobile number, e.g. 0712 345 678.";
  if (!d.zone) e.zone = "Choose where we're delivering.";
  if (d.location.trim().length < 3) e.location = "Tell us the area, estate or town.";
  return e;
}

/** Short reference the customer and the shop can both quote, e.g. SK-7K2Q9F. */
export function orderRef() {
  const t = Date.now().toString(36).slice(-4).toUpperCase();
  const r = Math.floor(Math.random() * 36 * 36).toString(36).padStart(2, "0").toUpperCase();
  return `SK-${t}${r}`;
}

type Line = { name: string; qty: number; lineTotal: number };

export function orderMessage(ref: string, lines: Line[], subtotal: number, d: OrderDetails) {
  const zone = deliveryZones.find((z) => z.id === d.zone)?.short ?? "";
  return [
    `Hi ${site.name}! I'd like to place an order.`,
    `Order ref: ${ref}`,
    "",
    ...lines.map((l) => `• ${l.qty} × ${l.name} (${formatKES(l.lineTotal)})`),
    `Subtotal: ${formatKES(subtotal)} + delivery (please confirm)`,
    "",
    `Name: ${d.name.trim()}`,
    `Phone: ${normalizePhone(d.phone) ?? d.phone}`,
    `Delivery: ${zone}, ${d.location.trim()}`,
    ...(d.gift ? ["This is a gift, please pack it discreetly."] : []),
    ...(d.notes.trim() ? [`Notes: ${d.notes.trim()}`] : []),
    "",
    "Payment: M-Pesa",
  ].join("\n");
}

/** What to tell the customer about paying, from the M-Pesa details in site.ts. */
export function mpesaSteps(ref: string, total: string) {
  const { till, paybill, name } = site.mpesa;
  const payee = name ? ` (${name})` : "";
  if (till) return [`Go to M-Pesa → Lipa na M-Pesa → Buy Goods and Services.`, `Till number: ${till}${payee}.`, `Amount: ${total} plus the delivery fee we confirm.`];
  if (paybill) return [`Go to M-Pesa → Lipa na M-Pesa → Pay Bill.`, `Business number: ${paybill}${payee}, account: ${ref}.`, `Amount: ${total} plus the delivery fee we confirm.`];
  return [
    `We'll reply on WhatsApp with your total, including delivery, and the M-Pesa number to pay.`,
    `Pay only to the details we send from ${site.phone}.`,
  ];
}
