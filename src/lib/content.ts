// Shared copy used across pages. Moves into the admin dashboard later.

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/the-kit", label: "The Kit" },
  { href: "/ritual", label: "Ritual" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
] as const;

export const days = [
  { name: "Reset", text: "Your first Magic Juice and Magic Bath. Let go of everything heavy.", bg: "linear-gradient(160deg,#ffe8f4,#ffc2e2)" },
  { name: "Energy", text: "You wake up lighter. More water, more fruit, more you.", bg: "linear-gradient(160deg,#ffd6ec,#ff8cc8)" },
  { name: "Glow", text: "Skin softer, eyes brighter. People start to notice.", bg: "linear-gradient(160deg,#ffc2e2,#ff4fae)" },
  { name: "Confidence", text: "You walk differently. Head up, shoulders back.", bg: "linear-gradient(160deg,#ff8cc8,#ff0090)" },
  { name: "Self-love", text: "The mirror is your friend again. You choose you.", bg: "linear-gradient(160deg,#ff4fae,#d6007a)" },
  { name: "Magnetic", text: "Your energy walks into the room before you do.", bg: "linear-gradient(160deg,#ff0090,#a3005c)" },
  { name: "Reborn", text: "Meet the new you: glowing, booked and unstoppable.", bg: "linear-gradient(160deg,#d6007a,#a3005c)" },
];

/** Days 5–7 use deep backgrounds, so their text is white. */
export const isDarkDay = (i: number) => i >= 4;

export const morningSteps = [
  { time: "06:30", title: "Wake & sip", text: "Start every morning with the Magic Juice, before anything else touches your lips.", product: "sweet-kitty-magic-juice" },
  { time: "06:45", title: "Soak", text: "Run your Magic Bath first thing. A few quiet minutes that are only yours.", product: "sweet-kitty-magic-bath" },
  { time: "07:15", title: "Care", text: "Use Sweet Kitty Tight and Slippery Kitty as directed in your kit.", product: "sweet-kitty-tight" },
  { time: "All day", title: "Hydrate", text: "Drink plenty of water through the day. Your glow loves it.", product: null },
  { time: "09:30", title: "Nourish", text: "About three hours after your juice, eat fruits and vegetables.", product: null },
];

export const values = [
  { title: "Natural", text: "Made from natural ingredients. Nothing you need to second-guess." },
  { title: "Secret", text: "Our recipes stay with us. That's the magic, and that's a promise." },
  { title: "Discreet", text: "Plain packaging and private ordering on WhatsApp. Nobody needs to know." },
  { title: "For every woman", text: "Made for every woman who is ready to choose herself again." },
];

export const facts = [
  { value: 100, suffix: "%", label: "Natural", text: "Pure, natural ingredients. The exact recipe stays our secret." },
  { value: 7, suffix: "", label: "Days", text: "One guided ritual to meet a brand-new version of you." },
  { value: 0, suffix: "", label: "Awkward questions", text: "Plain, discreet packaging on every single order." },
  { value: 1, suffix: "", label: "Message to order", text: "Add to bag, check out on WhatsApp. We handle the rest." },
];

export type Faq = { q: string; a: string };

export const faqGroups: { id: string; title: string; items: Faq[] }[] = [
  {
    id: "ordering",
    title: "Ordering",
    items: [
      {
        q: "How do I order?",
        a: "Add your favourites to your bag and tap “Checkout on WhatsApp”. Your order is sent to us in one message and we confirm payment and delivery with you directly.",
      },
      { q: "How do I pay?", a: "Once your order arrives on WhatsApp, we confirm your total and share the payment options with you personally." },
      { q: "Can I order for a friend?", a: "Of course. Add what she needs, tell us on WhatsApp that it's a gift, and we'll keep it discreet and beautifully packed." },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    items: [
      { q: "Is the packaging discreet?", a: "Always. Every order is packed plainly, with nothing on the outside that says what's inside." },
      { q: "How long does delivery take?", a: "It depends on where you are. We confirm the delivery time and cost on WhatsApp when you order." },
    ],
  },
  {
    id: "products",
    title: "Products",
    items: [
      { q: "What's inside the products?", a: "Only natural ingredients. The exact recipes are our secret, which is what makes Sweet Kitty, Sweet Kitty." },
      {
        q: "Why choose the 7-Day Kit?",
        a: "The kit brings the whole collection together in one guided ritual. The more of the ritual you follow, the bigger the transformation.",
      },
      { q: "How much do the products cost?", a: "Every single ritual is KSh 3,000. The full 7-Day Kit, with all four, is KSh 10,000. Buy them on their own or save with the kit." },
    ],
  },
  {
    id: "safety",
    title: "Safety",
    items: [
      {
        q: "Is it safe for me?",
        a: "Our products are made from natural ingredients. If you're pregnant, breastfeeding, have a medical condition or known allergies, please check with your doctor before use, and stop using any product that irritates you.",
      },
      { q: "What if a product doesn't agree with me?", a: "Stop using it straight away and message us. We'll talk you through it personally." },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((g) => g.items);
