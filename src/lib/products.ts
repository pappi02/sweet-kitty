// Product catalogue. Shaped like the future admin database rows,
// so swapping this file for a database later doesn't change the components.
// Ingredients are intentionally not stored here: they stay secret.
// Prices live in ./prices.ts.

import { prices } from "./prices";

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
  category: "kit" | "body" | "intimate" | "drink" | "bath" | "treats";
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
  /** Ids from lib/videos.ts shown in this product's gallery. */
  videos?: string[];
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
      "Our four signature rituals, in one luxurious kit. Follow the 7-day ritual and feel the change: more energy, more glow, more confidence, more you.",
    price: prices["kit-7-day"],
    category: "kit",
    badge: "Best value",
    benefits: [
      "Our four signature rituals",
      "Guided 7-day glow-up ritual",
      "The biggest transformation",
      "Discreet, gift-ready packaging",
    ],
    howToUse: [
      "Start every morning with the Magic Kitty Juice.",
      "Treat yourself to the Love Bath first thing in the morning.",
      "Use Sweet Kitty Tight and Slippery Kitty as directed in your kit.",
    ],
    includes: ["Sweet Kitty Tight", "Slippery Kitty", "Magic Kitty Juice", "Sweet Kitty Love Bath"],
    tone: ["#73062C", "#59162B"],
    icon: "crown",
    image: "/products/sweet-kitty-7-day-kit.jpg",
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
    price: prices.tight,
    category: "intimate",
    benefits: [
      "Helps you feel tighter and toned",
      "Brings back the youthful you",
      "Boosts your confidence",
      "Awakens your desire",
    ],
    howToUse: ["Use as directed on the pack."],
    tone: ["#9D0842", "#73062C"],
    icon: "gem",
    image: "/products/sweet-kitty-tight.jpg",
    videos: ["tight", "glow"],
    active: true,
    order: 6,
  },
  {
    id: "slippery",
    slug: "slippery-kitty",
    name: "Slippery Kitty",
    shortName: "Slippery",
    tagline: "Silky, fresh and naturally irresistible.",
    description:
      "A natural blend made to support your body's own moisture and freshness, so you feel clean, confident and beautiful.",
    price: prices.slippery,
    category: "intimate",
    benefits: [
      "Supports natural moisture",
      "Keeps kitty clean and fresh",
      "Brings back your confidence and beauty",
      "Awakens your desire",
    ],
    howToUse: ["Use as directed on the pack."],
    tone: ["#E9A9C5", "#9D0842"],
    icon: "droplets",
    image: "/products/slippery-kitty.jpg",
    videos: ["glow"],
    active: true,
    order: 7,
  },
  {
    id: "magic-juice",
    slug: "magic-kitty-juice",
    name: "Magic Kitty Juice",
    shortName: "Kitty Juice",
    tagline: "Your morning elixir for glow, energy and good fortune.",
    description:
      "A natural drinking ritual to start your day glowing. Sip it every morning and step into your higher feminine energy.",
    price: prices["magic-juice"],
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
    tone: ["#9D0842", "#330412"],
    icon: "sparkles",
    image: "/products/magic-kitty-juice.jpg",
    videos: ["juice", "morning"],
    active: true,
    order: 1,
  },
  {
    id: "magic-bath",
    slug: "sweet-kitty-love-bath",
    name: "Sweet Kitty Love Bath",
    shortName: "Love Bath",
    tagline: "A milk and rose soak for body and soul.",
    description: "A luxurious natural bath ritual for soft skin, a calm mind and a feminine glow.",
    price: prices["magic-bath"],
    category: "bath",
    benefits: [
      "Soft, glowing skin",
      "Calms body and mind",
      "A daily ritual of self-love",
      "Wakes up your feminine energy",
    ],
    howToUse: ["Take your Love Bath first thing in the morning."],
    tone: ["#FDCDE7", "#9D0842"],
    icon: "flower",
    image: "/products/sweet-kitty-love-bath.jpg",
    videos: ["film-bath", "bath"],
    active: true,
    order: 5,
  },
  {
    id: "body-scrub",
    slug: "magic-kitty-body-scrub",
    name: "Magic Kitty Body Scrub",
    shortName: "Body Scrub",
    tagline: "Buff away the old. Reveal your softest skin.",
    description: "A rich body scrub that polishes and smooths, leaving your skin soft, fresh and ready to glow.",
    price: prices["body-scrub"],
    category: "body",
    benefits: ["Polishes and smooths skin", "Leaves skin soft and fresh", "Brings out your natural glow", "A little ritual of self-love"],
    howToUse: ["Massage onto damp skin in gentle circles.", "Give extra love to your legs and thighs.", "Rinse well with warm water."],
    tone: ["#E9A9C5", "#73062C"],
    icon: "sparkles",
    image: "/products/magic-kitty-body-scrub.jpg",
    videos: ["film-scrub"],
    active: true,
    order: 2,
  },
  {
    id: "kitty-oil",
    slug: "magic-kitty-oil",
    name: "Magic Kitty Oil",
    shortName: "Kitty Oil",
    tagline: "Silky, glowing skin from head to toe.",
    description: "A silky body oil that melts into your skin, leaving it soft, smooth and beautifully glowing.",
    price: prices["kitty-oil"],
    category: "body",
    benefits: ["Leaves skin silky soft", "Gives a healthy-looking glow", "Melts in beautifully", "Makes every day feel special"],
    howToUse: ["Smooth over clean skin.", "Massage into your legs, thighs, arms and back until it melts in."],
    tone: ["#FDCDE7", "#9D0842"],
    icon: "droplets",
    image: "/products/magic-kitty-oil.jpg",
    videos: ["film-oil"],
    active: true,
    order: 3,
  },
  {
    id: "candies",
    slug: "sweet-kitty-candies",
    name: "Sweet Kitty Candies",
    shortName: "Candies",
    tagline: "A sweet little treat, just for you.",
    description: "Our sweetest ritual: a little pink treat to brighten your day, beautifully packed and easy to carry anywhere.",
    price: prices.candies,
    category: "treats",
    benefits: ["A sweet treat for any moment", "Easy to carry in your bag", "Beautifully packed", "A lovely little gift"],
    howToUse: ["Enjoy as directed on the pack."],
    tone: ["#9D0842", "#73062C"],
    icon: "gem",
    image: "/products/sweet-kitty-candies.jpg",
    active: true,
    order: 4,
  },
];

export const activeProducts = products.filter((p) => p.active).sort((a, b) => a.order - b.order);

export const kit = products.find((p) => p.category === "kit")!;
export const singles = activeProducts.filter((p) => p.category !== "kit");

/** What the kit's contents cost when bought one by one, and what the kit saves. */
export const kitWorth = kit.includes!.reduce((sum, name) => sum + (products.find((p) => p.name === name)?.price ?? 0), 0);
export const kitSaving = kitWorth - kit.price!;

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
  { id: "body", label: "Body" },
  { id: "drink", label: "Drinks" },
  { id: "bath", label: "Bath" },
  { id: "treats", label: "Treats" },
  { id: "intimate", label: "Intimate care" },
] as const;
