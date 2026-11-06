// Policy pages. Draft wording: the business owner must review it (ideally with a
// Kenyan lawyer) before launch, especially the returns window and delivery areas.
// Moves into the admin dashboard later, like the rest of the site copy.

export type LegalSection = { id: string; heading: string; body: string[] };

export type LegalPage = {
  slug: "privacy" | "terms" | "delivery" | "returns";
  index: string;
  label: string;
  title: string;
  accent: string;
  intro: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

const UPDATED = "28 October 2026";

export const healthNote =
  "Sweet Kitty products are natural wellness and beauty products, not medicines. They are not intended to diagnose, treat, cure or prevent any disease, and results vary from woman to woman. For adults 18+ only.";

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    index: "08",
    label: "Privacy",
    title: "Your privacy,",
    accent: "kept close.",
    intro: "What we know about you, why we need it, and how you stay in control. Short version: only what it takes to deliver your order.",
    description: "How My Sweet Kitty collects, uses and protects your personal data under the Kenya Data Protection Act, 2019.",
    updated: UPDATED,
    sections: [
      {
        id: "who-we-are",
        heading: "Who we are",
        body: [
          "My Sweet Kitty sells natural feminine wellness products in Kenya through mysweetkitty.com and WhatsApp. We are responsible for the personal data you share with us, and we handle it under the Kenya Data Protection Act, 2019.",
        ],
      },
      {
        id: "what-we-collect",
        heading: "What we collect",
        body: [
          "When you order or message us: your name, phone number, delivery location, what you ordered and anything you choose to tell us in the chat.",
          "On this website: your bag, and the delivery details you type into the order form, are saved only in your own browser so you don't have to type them again. Nothing is sent to us until you tap “Send order on WhatsApp”.",
          "We do not use advertising cookies. If you choose “Accept” on the cookie notice, we use Google Analytics to count visits and see which pages and products people look at. It sets cookies and Google processes that data for us. If you choose “No thanks”, nothing is loaded. You can change your mind at any time from the “Cookie settings” link at the bottom of every page.",
          "Our hosting provider keeps standard technical logs (such as IP address and browser type) to keep the site secure and working.",
        ],
      },
      {
        id: "how-we-use-it",
        heading: "How we use it",
        body: [
          "To confirm and deliver your order, take payment, answer your questions and look after you if something goes wrong.",
          "We only send you offers or news if you have asked for them, and you can say stop at any time.",
          "We never sell your data, and we never share what you bought with anyone who does not need to know.",
        ],
      },
      {
        id: "who-sees-it",
        heading: "Who sees it",
        body: [
          "Our delivery partners receive only your name, phone number and location. They see a plain parcel, never what is inside.",
          "Payment providers such as M-Pesa process your payment under their own terms.",
          "WhatsApp (Meta) carries our chats. Its own privacy policy applies to how it handles messages.",
          "We may share information if the law requires it.",
        ],
      },
      {
        id: "how-long",
        heading: "How long we keep it",
        body: [
          "We keep order records for as long as Kenyan tax and accounting law requires. Chats and contact details that we no longer need are deleted.",
        ],
      },
      {
        id: "your-rights",
        heading: "Your rights",
        body: [
          "You can ask to see the data we hold about you, correct it, delete it, or object to how we use it. You can also withdraw any consent you gave us.",
          "Message us on WhatsApp or email mysweetkittyke@gmail.com. If you are not happy with our answer, you can complain to the Office of the Data Protection Commissioner (odpc.go.ke).",
        ],
      },
      {
        id: "security",
        heading: "Keeping it safe",
        body: [
          "We keep access to customer details to the people who need them to serve you. We will never ask for your M-Pesa PIN or passwords.",
        ],
      },
      {
        id: "changes",
        heading: "Changes to this policy",
        body: ["If we change this policy, we will update this page and the date at the top."],
      },
    ],
  },
  {
    slug: "terms",
    index: "09",
    label: "Terms",
    title: "Terms of",
    accent: "sale.",
    intro: "The simple rules for ordering from My Sweet Kitty. They protect you and they protect us.",
    description: "Terms of sale for ordering My Sweet Kitty products: orders, prices, payment, product use and your rights.",
    updated: UPDATED,
    sections: [
      {
        id: "about",
        heading: "About these terms",
        body: [
          "These terms apply when you buy from My Sweet Kitty through this website or WhatsApp. By placing an order you agree to them. Our products are for adults aged 18 and over.",
        ],
      },
      {
        id: "orders",
        heading: "How an order works",
        body: [
          "Checking out sends your bag to us as a WhatsApp message. That is a request to buy, not yet a confirmed order.",
          "Your order is confirmed once we reply with the total and delivery details and you have paid. We may decline an order, for example if an item has sold out, and we will refund you in full if you have already paid.",
        ],
      },
      {
        id: "prices",
        heading: "Prices",
        body: [
          "Prices are in Kenyan shillings (KSh). Delivery is charged separately and confirmed with you before you pay. If we make a pricing mistake, we will tell you before confirming the order.",
        ],
      },
      {
        id: "payment",
        heading: "Payment",
        body: [
          "We share the payment options with you on WhatsApp. Only pay to the details we give you in our official chat. We will never ask for your M-Pesa PIN.",
        ],
      },
      {
        id: "stock",
        heading: "Stock",
        body: ["We make our products in small batches. If something runs out after you order, we will offer you a wait time or a full refund."],
      },
      {
        id: "using-products",
        heading: "Using our products",
        body: [
          "Sweet Kitty products are natural wellness and beauty products, not medicines. They are not intended to diagnose, treat, cure or prevent any disease, and results vary from woman to woman.",
          "Always follow the directions on the pack. If you are pregnant, breastfeeding, have a medical condition or known allergies, check with your doctor first. Stop using any product that irritates you and message us.",
        ],
      },
      {
        id: "our-content",
        heading: "Our recipes and content",
        body: [
          "Our recipes are trade secrets. The Sweet Kitty name, logo, characters, videos and photos belong to us and may not be copied without permission.",
        ],
      },
      {
        id: "liability",
        heading: "Your rights and our responsibility",
        body: [
          "Nothing in these terms takes away your rights under the Consumer Protection Act, 2012 or other Kenyan law. As far as the law allows, we are not responsible for losses caused by using a product against its directions.",
        ],
      },
      {
        id: "law",
        heading: "Governing law",
        body: ["These terms are governed by the laws of Kenya. If you have a problem, message us first and we will do our best to put it right."],
      },
    ],
  },
  {
    slug: "delivery",
    index: "10",
    label: "Delivery",
    title: "Delivered",
    accent: "discreetly.",
    intro: "Plain packaging, every time. Here is how delivery works, from your WhatsApp message to your door.",
    description: "Delivery information for My Sweet Kitty orders in Kenya: areas, cost, timing and discreet packaging.",
    updated: UPDATED,
    sections: [
      {
        id: "where",
        heading: "Where we deliver",
        body: ["We deliver across Kenya. Tell us your location on WhatsApp and we will confirm that we can reach you."],
      },
      {
        id: "cost-and-time",
        heading: "Cost and timing",
        body: ["Delivery cost and timing depend on where you are. We confirm both with you on WhatsApp before you pay, so there are no surprises."],
      },
      {
        id: "discreet",
        heading: "Discreet packaging",
        body: [
          "Every order is packed plainly, with nothing on the outside that says what is inside. Our riders and couriers only see a parcel, a name and a phone number.",
        ],
      },
      {
        id: "receiving",
        heading: "Receiving your parcel",
        body: [
          "Please keep your phone on so the rider can reach you. If a delivery fails because we could not reach you, we will arrange another attempt; an extra delivery charge may apply.",
          "Check your parcel when it arrives. If anything is damaged, wrong or missing, message us within 48 hours with a photo.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    index: "11",
    label: "Returns",
    title: "Returns &",
    accent: "refunds.",
    intro: "Intimate products need extra care, so our returns are a little different. We always make it right when something is wrong.",
    description: "My Sweet Kitty returns and refunds policy: damaged or wrong items, unopened products and how refunds are paid.",
    updated: UPDATED,
    sections: [
      {
        id: "hygiene",
        heading: "Opened products",
        body: [
          "For hygiene and safety, we cannot take back intimate or consumable products once they are opened or used. This protects every woman who orders from us.",
        ],
      },
      {
        id: "wrong-or-damaged",
        heading: "Damaged, wrong or missing items",
        body: [
          "Message us on WhatsApp within 48 hours of delivery with a photo of the parcel and the item. We will send a replacement or refund you in full, at no cost to you.",
        ],
      },
      {
        id: "unopened",
        heading: "Changed your mind?",
        body: [
          "Unopened products with the seal intact can be returned within 7 days of delivery. Message us first to arrange it. Return delivery is at your cost, and we refund the product price once it reaches us in its original condition.",
        ],
      },
      {
        id: "reactions",
        heading: "If a product does not agree with you",
        body: ["Stop using it straight away and message us. We will talk you through it personally. If symptoms are serious, see a doctor."],
      },
      {
        id: "refunds",
        heading: "How refunds are paid",
        body: ["Refunds go back the way you paid, usually M-Pesa, within 7 days of us approving them."],
      },
    ],
  },
];

export const getLegalPage = (slug: LegalPage["slug"]) => legalPages.find((p) => p.slug === slug)!;
