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
  // Shown in the "only X kits left" bar. Keep this matched to real stock.
  kitsLeft: 5,
  kitsBatch: 20,
  // Handles exactly as printed on the labels. Shown as text, not links.
  socials: [
    { label: "Instagram", handle: "@mysweetkitty254" },
    { label: "TikTok", handle: "@MySweetKitty" },
    { label: "Facebook", handle: "My sweet kitty" },
  ],
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
