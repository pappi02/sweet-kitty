// Reading posters. getPosters() is cached and tagged, so it costs nothing per
// request; which posters are live is worked out at request time from the clock.
import { cacheLife, cacheTag } from "next/cache";
import { readLatest, type Version } from "../cms/store";
import { postersSchema, type PostersDoc } from "./schema";

export const POSTERS_KEY = "posters";
export const POSTERS_TAG = "posters";

const EMPTY: PostersDoc = { posters: [] };

async function load(): Promise<{ doc: PostersDoc; version: Version | null; problem?: string }> {
  const latest = await readLatest(POSTERS_KEY);
  if (!latest) return { doc: EMPTY, version: null };
  const parsed = postersSchema.safeParse(latest.data);
  if (!parsed.success) {
    console.error("[posters] saved posters are invalid", parsed.error.issues[0]);
    return { doc: EMPTY, version: latest.version, problem: "The saved posters couldn't be read." };
  }
  return { doc: parsed.data, version: latest.version };
}

export async function getPosters(): Promise<PostersDoc> {
  "use cache";
  cacheTag(POSTERS_TAG);
  try {
    const { doc } = await load();
    cacheLife("max");
    return doc;
  } catch (error) {
    console.error("[posters] could not load", error);
    cacheLife("minutes");
    return EMPTY;
  }
}

export async function readPostersForAdmin() {
  return load();
}
