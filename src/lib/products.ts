// Product catalogue. Shaped like the future admin database rows,
// so swapping this file for a database later doesn't change the components.
// Ingredients are intentionally not stored here: they stay secret.

export type ProductIcon = "crown" | "sparkles" | "droplets" | "flower" | "gem";

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /** Price in KES. null = "price coming soon" */
  price: number | null;
  size?: string;
  category: "kit" | "intimate" | "drink" | "bath";
  badge?: string;
  benefits: string[];
  howToUse: string[];
  includes?: string[];
  /** Two colours for the product's visual gradient */
  tone: [string, string];
  icon: ProductIcon;
  image?: string;
  /** "contain" shows the whole photo (for wide shots) over a soft blurred copy. Default fills the frame. */
  imageFit?: "cover" | "contain";
  active: boolean;
  order: number;
};

export const products: Product[] = [
  {
    id: "kit-7-day",
    slug: "7-day-sweet-kitty-kit",
    name: "The 7-Day Sweet Kitty Kit",
    shortName: "7-Day Kit",
    tagline: "The complete glow-up ritual. Seven days to a brand-new you.",
    description:
      "Everything in the Sweet Kitty collection, in one luxurious kit. Follow the 7-day ritual and feel the change: more energy, more glow, more confidence, more you.",
    price: 10000,
    category: "kit",
    badge: "Best value",
    benefits: [
      "The full Sweet Kitty collection",
      "Guided 7-day glow-up ritual",
      "The biggest transformation",
      "Discreet, gift-ready packaging",
    ],
    howToUse: [
      "Start every morning with the Magic Juice.",
      "Treat yourself to the Magic Bath first thing in the morning.",
      "Use Sweet Kitty Tight and Slippery Kitty as directed in your kit.",
    ],
    includes: ["Sweet Kitty Tight", "Slippery Kitty", "Sweet Kitty Magic Juice", "Sweet Kitty Magic Bath"],
    tone: ["#ff0090", "#3d1530"],
    icon: "crown",
    image: "/products/sweet-kitty-7-day-kit.png",
    imageFit: "contain",
    active: true,
    order: 0,
  },
  {
    id: "tight",
    slug: "sweet-kitty-tight",
    name: "Sweet Kitty Tight",
    shortName: "Tight",
    tagline: "Feel snug, youthful and unstoppable.",
    description:
      "Our signature natural intimate care pack, made with a secret blend of natural ingredients to help you feel firmer, fresher and more confident.",
    price: 3000,
    category: "intimate",
    benefits: [
      "Helps you feel tighter and toned",
      "Brings back the youthful you",
      "Boosts your confidence",
      "Awakens your desire",
    ],
    howToUse: ["Use as directed on the pack."],
    tone: ["#ff4fae", "#a3005c"],
    icon: "gem",
    image: "/products/sweet-kitty-tight.png",
    active: true,
    order: 1,
  },
  {
    id: "slippery",
    slug: "slippery-kitty",
    name: "Slippery Kitty",
    shortName: "Slippery",
    tagline: "Silky, fresh and naturally irresistible.",
    description:
      "A natural blend made to support your body's own moisture and freshness, so you feel clean, confident and beautiful.",
    price: 3000,
    category: "intimate",
    benefits: [
      "Supports natural moisture",
      "Keeps kitty clean and fresh",
      "Brings back your confidence and beauty",
      "Awakens your desire",
    ],
    howToUse: ["Use as directed on the pack."],
    tone: ["#ff8cc8", "#c4006e"],
    icon: "droplets",
    image: "/products/slippery-kitty.png",
    active: true,
    order: 2,
  },
  {
    id: "magic-juice",
    slug: "sweet-kitty-magic-juice",
    name: "Sweet Kitty Magic Juice",
    shortName: "Magic Juice",
    tagline: "Your morning elixir for glow, energy and good fortune.",
    description:
      "A natural drinking ritual to start your day glowing. Sip it every morning and step into your higher feminine energy.",
    price: 3000,
    size: "1 litre",
    category: "drink",
    benefits: [
      "Cleanse your aura",
      "Raise your energy",
      "Bring back your natural glow",
      "Embrace your higher feminine energy",
      "Attract good fortune and abundance",
      "Soothes period discomfort",
      "Rich in antioxidants",
    ],
    howToUse: [
      "Drink first thing in the morning.",
      "Drink plenty of water through the day.",
      "Eat fruits and vegetables about 3 hours later.",
    ],
    tone: ["#ff3ea0", "#5a0d3c"],
    icon: "sparkles",
    image: "/products/sweet-kitty-magic-juice.png",
    active: true,
    order: 3,
  },
  {
    id: "magic-bath",
    slug: "sweet-kitty-magic-bath",
    name: "Sweet Kitty Magic Bath",
    shortName: "Magic Bath",
    tagline: "A milk and rose soak for body and soul.",
    description: "A luxurious natural bath ritual for soft skin, a calm mind and a feminine glow.",
    price: 3000,
    category: "bath",
    benefits: [
      "Soft, glowing skin",
      "Calms body and mind",
      "A daily ritual of self-love",
      "Wakes up your feminine energy",
    ],
    howToUse: ["Take your Magic Bath first thing in the morning."],
    tone: ["#ffc2e2", "#e0007f"],
    icon: "flower",
    image: "/products/sweet-kitty-magic-bath.png",
    active: true,
    order: 4,
  },
];

export const activeProducts = products.filter((p) => p.active).sort((a, b) => a.order - b.order);

export const kit = products.find((p) => p.category === "kit")!;
export const singles = activeProducts.filter((p) => p.category !== "kit");

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string) {
  return activeProducts.find((p) => p.slug === slug);
}

/** The kit has its own page; everything else lives under /shop. */
export function productHref(p: Product) {
  return p.category === "kit" ? "/the-kit" : `/shop/${p.slug}`;
}

export const categories = [
  { id: "all", label: "All" },
  { id: "kit", label: "The Kit" },
  { id: "intimate", label: "Intimate care" },
  { id: "drink", label: "Drinks" },
  { id: "bath", label: "Bath" },
] as const;
