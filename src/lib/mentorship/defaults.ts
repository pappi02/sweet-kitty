// What the mentorship page shows before anything is saved in the admin dashboard.
// It is written from the owner's brief (healing, confidence, money, hormones,
// marriage, purpose, spirit) so the page reads as finished, and every word of it
// can be replaced from /admin/mentorship without touching the design.
//
// Films start empty: each slot shows a designed "coming soon" frame until a video
// is uploaded. The `brief` on each film is the production prompt for Kling.
import type { Mentorship } from "./schema";

const KLING_STYLE =
  "Vertical 9:16, photorealistic, shot on a full-frame cinema camera, 35–50mm lens, shallow depth of field, soft natural window light, warm skin tones, real skin texture with visible pores, natural hair, no retouching, subtle handheld movement. Audio: natural voices with clear Kenyan English accents, soft room tone. No on-screen text, no logos, no subtitles.";

export const defaultMentorship: Mentorship = {
  seo: {
    title: "The Sweet Kitty Mentorship",
    description:
      "One-on-one mentorship for women: heal old wounds, rise above jealousy, build your money and your business, and move through every season of womanhood with grace.",
  },

  hero: {
    eyebrow: "The Sweet Kitty Mentorship",
    title: "Heal. Rise.",
    accent: "Reign.",
    intro:
      "A private, one-on-one mentorship for women who have carried too much for too long. We sit with what hurt you, rebuild your confidence, and set your money, your health and your ambition back in motion.",
    facts: ["One-on-one", "In person or online", "Women 18 to 65", "Fully confidential"],
    filmId: "welcome",
  },

  home: {
    show: true,
    eyebrow: "Beyond the glow",
    title: "Mentorship for",
    accent: "every season of her.",
    text: "The rituals care for your body. The mentorship cares for the rest: old wounds, jealousy, money, marriage, hormones and the dreams you put on hold.",
    filmIds: ["circle", "one-on-one", "welcome"],
  },

  manifesto: {
    quote: "No woman should have to carry it all alone. Not the past, not the pressure, and not the dream.",
    topics: [
      "Childhood wounds",
      "Family pain",
      "Marriage",
      "Friendship",
      "Rejection",
      "Jealousy",
      "Confidence",
      "Money",
      "Business",
      "Ambition",
      "Hormones",
      "Menopause",
      "Motherhood",
      "Purpose",
      "Discipline",
      "Spirit",
    ],
  },

  gallery: {
    eyebrow: "Watch the conversations",
    title: "Listen in on",
    accent: "real talk.",
    intro: "Mentor talks, circles and honest conversations between women. Press play: most of what we teach is easier to hear than to read.",
  },

  films: [
    {
      id: "welcome",
      title: "What this mentorship is",
      caption: "Your mentor explains who it's for, what you'll work on, and what happens after you book.",
      kind: "mentor",
      src: "",
      poster: "",
      inGallery: true,
      brief: `A warm, elegant Kenyan woman in her early 40s, natural short hair, gold studs, cream blazer over a burgundy silk top, sits in a bright, calm consulting room with plants and a linen sofa. She speaks directly to camera, kind but certain: "If you've been carrying pain from your childhood, your marriage or your friendships, this space is for you. We heal it, we rebuild your confidence, and we put your money and your dreams back to work." Slow push-in. ${KLING_STYLE}`,
    },
    {
      id: "circle",
      title: "The Sunday circle",
      caption: "Five women, one sofa, and the conversation every woman needs at least once.",
      kind: "circle",
      src: "",
      poster: "",
      inGallery: true,
      brief: `Five Kenyan women aged 25 to 50, stylish casual clothes, sit close together on a large cream sofa with tea cups in a sunlit living room. One says: "I stopped posting my business because I was scared of what they'd say." Another squeezes her hand: "Their jealousy is not your assignment." The others nod and laugh softly. Gentle slow pan across faces. ${KLING_STYLE}`,
    },
    {
      id: "one-on-one",
      title: "A session, one-on-one",
      caption: "What a private session feels like: tea, a notebook, and someone who finally listens.",
      kind: "one-on-one",
      src: "",
      poster: "",
      inGallery: true,
      brief: `A mentor (Kenyan woman, early 40s, cream blazer) and a client (Kenyan woman, about 30, braids, denim shirt) sit across a small round table with tea and an open notebook by a large window. The client says quietly: "I don't even know where to start." The mentor smiles and leans in: "Start with the first time you felt you weren't enough." Over-the-shoulder shots, shallow focus. ${KLING_STYLE}`,
    },
    {
      id: "hangout",
      title: "Golden hour with the girls",
      caption: "Healing looks like this too: laughter, sunsets and friends who want you to win.",
      kind: "hangout",
      src: "",
      poster: "",
      inGallery: true,
      brief: `Four Kenyan women in their late 20s and 30s laugh together on a rooftop terrace in Nairobi at golden hour, fairy lights, mocktails, city skyline behind. One raises her glass: "To the year we stop shrinking." They clink glasses and cheer. Slow-motion moments, warm sunset light on skin. ${KLING_STYLE}`,
    },
    {
      id: "jealousy",
      title: "When their jealousy dims your light",
      caption: "Why so many women hide, shrink or quit, and how to take your confidence back.",
      kind: "mentor",
      src: "",
      poster: "",
      inGallery: true,
      brief: `The mentor (Kenyan woman, early 40s, burgundy dress) walks slowly through a quiet garden, speaking to camera: "Some of us gave up on ourselves because a few people were jealous. They put you down, and you believed them. Today we take that power back." Tracking shot, soft backlight. ${KLING_STYLE}`,
    },
    {
      id: "money",
      title: "Money, business and your next move",
      caption: "Making money, growing a business and staying focused on your goals.",
      kind: "mentor",
      src: "",
      poster: "",
      inGallery: true,
      brief: `The mentor sits at a light wooden desk with a laptop and a notebook titled "My plan", speaking to camera with energy: "Your ambition is not too much. Let's write the plan, price your worth, and make money in a way that lets you rest." Cut-ins of hands writing goals. ${KLING_STYLE}`,
    },
    {
      id: "wellness",
      title: "Hot flushes, hormones and you",
      caption: "For women in their 40s and beyond: what's changing, and how to feel like yourself again.",
      kind: "one-on-one",
      src: "",
      poster: "",
      inGallery: true,
      brief: `A Kenyan woman in her late 40s, elegant headwrap, fans herself and laughs as she tells the mentor: "The hot flushes, the mood swings, I thought I was losing my mind." The mentor touches her arm: "You're not. Your body is changing season. Let's walk through it together." Living-room setting, soft daylight. ${KLING_STYLE}`,
    },
    {
      id: "story",
      title: "Her story: starting again at 35",
      caption: "Marriage, children, a career on pause, and the morning she chose herself.",
      kind: "story",
      src: "",
      poster: "",
      inGallery: true,
      brief: `A Kenyan woman, about 35, sits by a window in a robe with a cup of tea, speaking softly to camera as if to a friend: "For ten years I put everyone first. My husband, my children, my family. One day I looked in the mirror and didn't know her. That's when I booked my first session." Slow push-in, morning light. ${KLING_STYLE}`,
    },
  ],

  pillars: {
    eyebrow: "What we walk through together",
    title: "Seven areas,",
    accent: "one whole you.",
    intro: "Every session starts with you: where it hurts, what you want, and what's in the way. These are the areas we work on most.",
    items: [
      {
        id: "healing",
        title: "Healing the past",
        kicker: "Childhood and family wounds",
        text: "The pain you carried from childhood and family still decides how you love, how you rest and how much you think you deserve. We name it, understand it and loosen its grip.",
        points: ["Childhood trauma", "Family wounds", "Rejection", "Letting go"],
        filmId: "story",
      },
      {
        id: "confidence",
        title: "Rising above jealousy",
        kicker: "Confidence, back where it belongs",
        text: "Too many women have hidden, shrunk or given up because a few people were jealous. We rebuild the confidence they tried to take, and teach you to stop accepting what was never true.",
        points: ["Jealousy and envy", "Friendship betrayal", "Self-worth", "Being seen again"],
        filmId: "jealousy",
      },
      {
        id: "love",
        title: "Love, marriage and family",
        kicker: "The relationships closest to you",
        text: "Marriage seasons, misunderstandings, motherhood and the weight of family expectations. We work on boundaries, communication and peace at home.",
        points: ["Marriage", "Motherhood", "Children", "Boundaries"],
        filmId: "",
      },
      {
        id: "money",
        title: "Money and business",
        kicker: "Build wealth on your terms",
        text: "How to make money, price your worth, grow a business and stay focused when life is loud. Practical plans you leave the session with.",
        points: ["Making money", "Business growth", "Pricing your worth", "Financial focus"],
        filmId: "money",
      },
      {
        id: "purpose",
        title: "Purpose and ambition",
        kicker: "Goals, desires, discipline",
        text: "Your desires are not too much. We turn the dreams you put on hold into goals, and the goals into habits you can keep.",
        points: ["Life goals", "Ambition", "Discipline", "Focus"],
        filmId: "",
      },
      {
        id: "wellness",
        title: "Hormones and wellness",
        kicker: "Your body, every season",
        text: "Hormonal changes, hot flushes and menopause can make you feel like a stranger to yourself. We help you understand what's changing and build routines that bring you back.",
        points: ["Hormonal balance", "Hot flushes", "Menopause", "Energy and sleep"],
        filmId: "wellness",
      },
      {
        id: "spirit",
        title: "Spirit and mindset",
        kicker: "Grounded from the inside",
        text: "Quiet, faith, gratitude and a mindset that holds steady. The inner work that makes every other change last.",
        points: ["Spiritual grounding", "Mindset", "Inner peace", "Gratitude"],
        filmId: "",
      },
    ],
  },

  programmes: {
    eyebrow: "Programmes",
    title: "A programme for",
    accent: "every season.",
    intro: "A woman of 22 and a woman of 52 are facing different things. Each programme is built for the questions of its season.",
    note: "Prices are in Kenyan shillings. Clients outside Kenya are welcome: sessions run by video call, and we'll share card payment options on WhatsApp.",
    items: [
      {
        id: "bloom",
        name: "Bloom",
        ages: "18–25",
        headline: "Find yourself before the world decides who you are.",
        focus: ["Identity and self-worth", "Friendships and jealousy", "Your first money habits", "Goals that are truly yours"],
        price: 10_000,
        sessions: "One 90-minute session",
        format: "In person or online · 2 weeks of WhatsApp follow-up",
        badge: "",
        filmId: "hangout",
      },
      {
        id: "rise",
        name: "Rise",
        ages: "25–35",
        headline: "Love, career and building something of your own.",
        focus: ["Relationships and marriage", "Starting or growing a business", "Healing family patterns", "Confidence to be seen"],
        price: 15_000,
        sessions: "One 90-minute session",
        format: "In person or online · 2 weeks of WhatsApp follow-up",
        badge: "",
        filmId: "circle",
      },
      {
        id: "reign",
        name: "Reign",
        ages: "35–45",
        headline: "Carrying everyone? It's your turn to be carried.",
        focus: ["Marriage and family seasons", "Burnout and rest", "Early hormonal changes", "Business and wealth growth"],
        price: 20_000,
        sessions: "One 90-minute session",
        format: "In person or online · 3 weeks of WhatsApp follow-up",
        badge: "",
        filmId: "one-on-one",
      },
      {
        id: "grace",
        name: "Grace",
        ages: "45–65",
        headline: "A new chapter, lived with grace and power.",
        focus: ["Menopause and hot flushes", "Reinvention and purpose", "Marriage and the empty nest", "Legacy and wealth"],
        price: 30_000,
        sessions: "One 2-hour session",
        format: "In person or online · 4 weeks of WhatsApp follow-up",
        badge: "",
        filmId: "wellness",
      },
    ],
  },

  steps: {
    eyebrow: "How it works",
    title: "From booking to",
    accent: "breakthrough.",
    items: [
      { title: "Choose your programme", text: "Pick the season that fits you. Not sure? Message us and we'll guide you." },
      { title: "Reserve with M-Pesa", text: "Pay securely to hold your place. The prompt comes to your own phone." },
      { title: "Get your date and time", text: "Within 24 hours we send your exact date, time and how to join, on WhatsApp." },
      { title: "Your private session", text: "One-on-one with your mentor, in person in Nairobi or by video call, wherever you are." },
      { title: "We keep walking with you", text: "Follow-up on WhatsApp, plus the products that support what we worked on." },
    ],
  },

  mentor: {
    eyebrow: "Your mentor",
    name: "The founder of My Sweet Kitty",
    role: "Mentor to women in every season of life",
    bio: [
      "Before there were products, there were conversations: with friends, sisters and strangers who needed someone to listen without judging. My Sweet Kitty began there, and so did this mentorship.",
      "Every session is private and personal. You leave with clarity, a plan, and someone in your corner.",
    ],
    quote: "You were never too much. You were just surrounded by people who wanted less of you.",
    filmId: "welcome",
    photo: "",
  },

  voices: {
    show: false,
    eyebrow: "In their words",
    title: "Women who",
    accent: "chose themselves.",
    items: [],
  },

  faq: {
    eyebrow: "Questions",
    title: "Before you",
    accent: "book.",
    items: [
      { q: "Is the mentorship in person or online?", a: "Both. Meet your mentor in person in Nairobi, or by video call from anywhere in the world. Choose what suits you when you book." },
      { q: "Is everything I share kept private?", a: "Yes. What you share in a session stays between you and your mentor. We never share your story or your details." },
      { q: "What happens after I pay?", a: "Within 24 hours we contact you on WhatsApp with your exact date, time and how to join. If you need to move it, just tell us." },
      { q: "Which programme is right for me?", a: "Start with your age group, since each programme is built for the questions of that season. If you're between two, message us and we'll help you choose." },
      { q: "I live outside Kenya. Can I join?", a: "Absolutely. Sessions run by video call, and we'll share card payment options with you on WhatsApp." },
      { q: "Is this therapy or medical treatment?", a: "No. This is personal mentorship and guidance from woman to woman. For medical concerns, including hormonal or menopausal symptoms, please also see a qualified doctor." },
    ],
  },

  booking: {
    mode: "pay",
    title: "Book your session",
    intro: "Tell us a little about you. After payment, we'll confirm your exact date and time on WhatsApp within 24 hours.",
    formats: ["In person (Nairobi)", "Video call"],
    afterPayment: "Your place is reserved. Send your booking details on WhatsApp and we'll confirm your date and time within 24 hours.",
  },

  closing: {
    title: "Your healing has a",
    accent: "date and a time.",
    text: "Choose your programme, reserve your place, and we'll take it from there. You don't have to carry it alone anymore.",
  },

  disclaimer:
    "The Sweet Kitty Mentorship is personal coaching and guidance. It is not medical, psychological or legal treatment and doesn't replace care from a qualified professional. If you are in crisis or thinking about harming yourself, please contact emergency services or a crisis line in your country right away.",
};
