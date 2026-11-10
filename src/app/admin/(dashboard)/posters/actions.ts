"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { storageMode, writeVersion } from "@/lib/cms/store";
import { describeIssue } from "@/lib/mentorship/schema";
import { POSTERS_KEY, POSTERS_TAG } from "@/lib/posters/data";
import { postersSchema, type PostersDoc } from "@/lib/posters/schema";

export type SavePostersResult = { error: string } | { doc: PostersDoc; savedAt: string };

export async function savePosters(json: string): Promise<SavePostersResult> {
  await requireAdmin();
  if (storageMode() === "none") return { error: "Saving is off because no Vercel Blob store is connected. Connect one to the project in Vercel, then redeploy." };
  if (json.length > 300_000) return { error: "That's too much to save at once." };

  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { error: "The posters couldn't be read. Refresh the page and try again." };
  }
  const parsed = postersSchema.safeParse(data);
  if (!parsed.success) return { error: describeIssue(parsed.error) };

  try {
    const version = await writeVersion(POSTERS_KEY, parsed.data);
    updateTag(POSTERS_TAG);
    return { doc: parsed.data, savedAt: version.savedAt };
  } catch (error) {
    console.error("[admin] saving posters failed", error);
    return { error: "Saving failed. Check your connection and try again." };
  }
}
