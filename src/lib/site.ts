// Site-wide settings. These move into the admin dashboard in a later step.
export const site = {
  name: "My Sweet Kitty",
  domain: "mysweetkitty.com",
  tagline: "Your Beauty Besties",
  // The number printed on the product labels, used for calls and WhatsApp.
  // WhatsApp format: country code, no + or spaces
  whatsapp: "254748727716",
  phone: "0748 727 716",
  phoneHref: "tel:+254748727716",
  email: "mysweetkittyke@gmail.com",
  // Handles as printed on the labels. Add a url once a profile link is confirmed.
  socials: [
    { label: "Instagram", handle: "@mysweetkitty254", url: "https://www.instagram.com/mysweetkitty254" },
    { label: "TikTok", handle: "@MySweetKitty", url: "https://www.tiktok.com/@mysweetkitty" },
    { label: "Facebook", handle: "My sweet kitty", url: "" },
  ] as { label: string; handle: string; url: string }[],

  // Who runs the shop, shown on every policy page. Fill in the blanks as they are
  // confirmed; empty fields are simply left off the page.
  business: {
    tradingName: "My Sweet Kitty",
    legalName: "", // registered business or company name, e.g. "Sweet Kitty Enterprises"
    registrationNo: "", // business registration (BRS) number
    kraPin: "",
    address: "", // physical or postal address
    country: "Kenya",
  },

  // M-Pesa details shown after an order is sent. Leave both empty to say
  // "we'll share the payment number on WhatsApp".
  mpesa: {
    till: "", // Buy Goods till number
    paybill: "", // Paybill number (with account = order reference)
    name: "", // the name M-Pesa shows the customer, so they can check it
  },
};

/** Google Analytics 4 measurement ID (G-XXXXXXX), set in the hosting environment. Empty = no analytics. */
export const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
