// Reading the mentorship content.
//
// The public pages use getMentorship(): cached and tagged, so the page is served
// as static HTML and only rebuilt when the admin saves (updateTag("mentorship")).
// The admin editor uses readMentorshipForAdmin(), which always reads the live copy.
import { cacheLife, cacheTag } from "next/cache";
import { readLatest, type Version } from "../cms/store";
import { defaultMentorship } from "./defaults";
import { mentorshipSchema, type Film, type Mentorship } from "./schema";

export const MENTORSHIP_KEY = "mentorship";
export const MENTORSHIP_TAG = "mentorship";

async function load(): Promise<{ doc: Mentorship; version: Version | null; problem?: string }> {
  const latest = await readLatest(MENTORSHIP_KEY);
  if (!latest) return { doc: defaultMentorship, version: null };
  const parsed = mentorshipSchema.safeParse(latest.data);
  if (!parsed.success) {
    console.error("[mentorship] saved content is invalid, showing defaults", parsed.error.issues[0]);
    return { doc: defaultMentorship, version: latest.version, problem: "The saved content couldn't be read, so the defaults are showing." };
  }
  return { doc: parsed.data, version: latest.version };
}

export async function getMentorship(): Promise<Mentorship> {
  "use cache";
  cacheTag(MENTORSHIP_TAG);
  try {
    const { doc } = await load();
    cacheLife("max");
    return doc;
  } catch (error) {
    // Storage hiccup: show the defaults now and try again in a few minutes.
    console.error("[mentorship] could not load content", error);
    cacheLife("minutes");
    return defaultMentorship;
  }
}

export async function readMentorshipForAdmin() {
  return load();
}

/** Server-side price for a programme, so the browser can never set its own amount. */
export async function programmePrice(programmeId: string): Promise<number | null> {
  const doc = await getMentorship();
  return doc.programmes.items.find((p) => p.id === programmeId)?.price ?? null;
}

export const findFilm = (doc: Mentorship, id: string): Film | undefined => (id ? doc.films.find((f) => f.id === id) : undefined);
