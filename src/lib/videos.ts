// Video library. Every video on the site comes from this list, so adding a
// new clip is one entry here (later: one upload in the admin dashboard).
// Drop new files in /public/videos and add a poster JPG next to each one.

export type VideoTag = "Before" | "After" | "Ritual" | "Story" | "Glow" | "Kit" | "Drama";

export type Video = {
  id: string;
  src: string;
  poster: string;
  title: string;
  caption: string;
  tag: VideoTag;
  /** Seconds to start from. Lets one clip open on a different moment. */
  start?: number;
};

/** A clip in /public/videos plus its poster, e.g. clip("kitty-glow") -> kitty-glow.mp4 + kitty-glow-poster.jpg */
const clip = (name: string) => ({ src: `/videos/${name}.mp4`, poster: `/videos/${name}-poster.jpg` });

// Our own AI-generated clips, all starring the Sweet Kitty mascot (see video-plan.md).
// Order matters: "Watch her story" plays this list from the top, so it tells her story.
export const videos: Video[] = [
  { id: "before", ...clip("kitty-before"), tag: "Before", title: "Not feeling like herself", caption: "Tired, moody and running on empty." },
  { id: "bestie", ...clip("kitty-message"), tag: "Story", title: "“Girl, haven't you heard?”", caption: "The message that changed everything." },
  { id: "delivery", ...clip("kitty-delivery"), tag: "Story", title: "Discreetly delivered", caption: "A plain parcel. Nobody needs to know." },
  { id: "reveal", ...clip("kitty-reveal"), tag: "Story", title: "The moment she opened it", caption: "Pink tissue, a gift bag, and a feeling." },
  { id: "crown", ...clip("kitty-crown"), tag: "Story", title: "Her crown is back", caption: "The 7-Day Kit, and the start of a new her." },
  { id: "morning", ...clip("kitty-juice"), tag: "Ritual", title: "The morning ritual", caption: "Kitty Magic Juice first, then the Love Bath." },
  { id: "reset", ...clip("kitty-bath"), tag: "Ritual", title: "Day one: reset", caption: "Let go of everything heavy." },
  { id: "glow", ...clip("kitty-glow"), tag: "Glow", title: "Day three glow", caption: "Softer skin, brighter eyes. People notice." },
  { id: "after", ...clip("kitty-after"), tag: "After", title: "Main-character energy", caption: "Seven days later, she's glowing." },
  { id: "holiday", ...clip("kitty-booked"), tag: "After", title: "Booked and glowing", caption: "Business class, sunglasses on." },
  { id: "call", ...clip("kitty-call"), tag: "After", title: "“You still don't have it?”", caption: "Now she's the one telling her bestie." },
  { id: "kit", ...clip("kit-reveal"), tag: "Kit", title: "The 7-Day Kit", caption: "Everything she needs, in one pink bag." },
  { id: "juice", ...clip("magic-juice"), tag: "Kit", title: "Kitty Magic Juice", caption: "Her morning elixir." },
  { id: "bath", ...clip("magic-bath"), tag: "Kit", title: "Kitty Love Bath", caption: "A rose soak for body and soul." },
  { id: "tight", ...clip("tight-box"), tag: "Kit", title: "Sweet Kitty Tight", caption: "Feel snug, youthful and unstoppable." },
];

// 10-second product films: real-looking hands, no mascot, no sound.
export const films: Video[] = [
  { id: "film-scrub", ...clip("film-scrub"), tag: "Ritual", title: "Kitty Magic Scrub", caption: "Soft, polished skin, one slow stroke at a time." },
  { id: "film-oil", ...clip("film-oil"), tag: "Ritual", title: "Kitty Oil", caption: "A silky glow, wherever you need it." },
  { id: "film-bath", ...clip("film-bath"), tag: "Ritual", title: "Kitty Love Bath", caption: "A few quiet minutes that are only yours." },
  { id: "film-juice", ...clip("film-juice"), tag: "Ritual", title: "Kitty Magic Juice", caption: "One glass, every morning. Glow from within." },
  { id: "film-candies", ...clip("film-candies"), tag: "Glow", title: "Sweet Kitty Candies", caption: "Poolside, sun on your skin, something sweet." },
  { id: "film-kit", ...clip("film-kit"), tag: "Kit", title: "The 7-Day Sweet Kitty Kit", caption: "Untie the bow. Your seven days start now." },
];
videos.push(...films);

// Talking mini-dramas (~20 s, with voices and burned-in captions). Kept last so the
// story playlist above stays in order; the stories gallery shows them under "Drama".
export const dramas: Video[] = [
  { id: "drama-intervention", ...clip("drama-intervention"), tag: "Drama", title: "The Intervention", caption: "Kitty hasn't left the sofa. Zuri isn't having it." },
  { id: "drama-who-is-she", ...clip("drama-who-is-she"), tag: "Drama", title: "Who Is She?", caption: "Seven days later, Imani can't believe her eyes." },
  { id: "drama-mum", ...clip("drama-mum"), tag: "Drama", title: "Mum, Don't Open That!", caption: "A plain brown parcel. Mama has questions." },
];
videos.push(...dramas);

// Clips made for one spot only, kept out of the reel gallery and story playlists:
// the before/after slider pair (same framing) and the wide banners.
const extraVideos: Video[] = [
  { id: "compare-before", ...clip("kitty-compare-before"), tag: "Before", title: "Before", caption: "Running on empty." },
  { id: "compare-after", ...clip("kitty-compare-after"), tag: "After", title: "After", caption: "Main-character energy." },
  { id: "lounge-wide", ...clip("kitty-lounge-wide"), tag: "Kit", title: "Kit day", caption: "Her kit, her sofa, her time." },
  { id: "texting-wide", ...clip("kitty-texting-wide"), tag: "Story", title: "Message us", caption: "One message is all it takes." },
];

export const getVideo = (id: string) => [...videos, ...extraVideos].find((v) => v.id === id)!;

/** Video source with a start-time fragment, e.g. /videos/kitty-after.mp4#t=4 */
export const videoSrc = (v: Video) => (v.start ? `${v.src}#t=${v.start}` : v.src);
