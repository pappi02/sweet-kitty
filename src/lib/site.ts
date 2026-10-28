// Site-wide settings. These move into the admin dashboard in a later step.
export const site = {
  name: "My Sweet Kitty",
  domain: "mysweetkitty.com",
  tagline: "Embrace your feminine power",
  // TODO: replace with the real WhatsApp business number (country code, no +)
  whatsapp: "254700000000",
  // Shown in the "only X kits left" bar. Keep this matched to real stock.
  kitsLeft: 5,
  kitsBatch: 20,
  socials: {
    instagram: "#",
    tiktok: "#",
    facebook: "#",
  },
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
